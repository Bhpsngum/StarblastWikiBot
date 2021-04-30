// enable the line below if you have the `process.js` file
// var process = require("./process.js");

// packages declaration
// var WikiAPI = require("wikiapi");
var { MediaWikiJS } = require("@lavgup/mediawiki.js");
var Discord = require("discord.js");
var axios = require("axios");
var fetch_delay = 86400; // in seconds
var page = "https://starblastio.fandom.com/wiki/";
var ready = { status: false };
var titles = {
  "log": "Special log",
  "edit": "Article edited",
  "new": "Article created",
  "visualeditor": "Visual Editor",
  "mw-blank": "Blanked page",
  "categorize": "Category modified"
}
var logChannelID = "837523024181592065", logChannel, lastDate, lastID;
var bot = new MediaWikiJS({
  url: 'https://starblastio.fandom.com/api.php'
});
var client = new Discord.Client({
  partials: []
});

// log the bot into Discord
client.login(process.env.token);

client.on('ready', async function() {
  console.log("Connected as "+client.user.tag+" in Discord");
  // log the bot into wiki
  bot.login('StarblastWikiBot@StarblastWikiBot', process.env.password).then(function(){
    console.log("Logged in as "+bot.api.options.botUsername+" in StarblastioFandom");
  });
  client.user.setActivity("Checking Wiki");
  logChannel = client.channels.cache.get(logChannelID);
  var messages = await logChannel.messages.fetch({ limit: 2 });
  messages = [...messages.values()];
  const lastMessage = messages[0].embeds;
  (new Promise(function (resolve, reject) {
    var needcheck = false;
    if (!(lastMessage||[]).length) lastDate = new Date().toISOString();
    else {
      let embed = lastMessage[lastMessage.length - 1];
      if ((embed||{}).timestamp) {
        let rcID = parseInt((embed.footer.text.match(/\d+/)||[0])[0]);
        needcheck = true;
        lastDate = new Date(embed.timestamp).toISOString();
        fetchRC(logChannel, null, null, function(item){
          return item.rcid > rcID
        }, function (){
          lastDate = new Date(embed.timestamp+1000).toISOString();
          resolve();
        });
      }
      else lastDate = new Date().toISOString();
    }
    if (!needcheck) resolve();
  })).then(function () {
    console.log("Fetched last timestamp: "+lastDate);
    var startFetchRC = function () {
      fetchRC(logChannel, null, null, null, function(){setTimeout(startFetchRC, 5000)});
    }
    setTimeout(startFetchRC, 5000);
  });
});

// pandoc converter
var pandoc = function (originalLang, targetLang, content) {
  return new Promise(function(resolve, reject) {
    let requests = ((content||"").match(/[^]{1,4000}/g) || []).filter(i => i);
    if (requests.length == 0) reject(new Error("Malfunctioned input data"));
    else Promise.all(requests.map(i => axios.get("https://pandoc.org/cgi-bin/trypandoc?from="+originalLang+"&to="+targetLang+"&text="+encodeURIComponent(i)+"&standalone=0"))).then(function (values) {
      resolve(values.map(v => ((v||{}).data||{}).html || "").join(""));
    }).catch(reject)
  });
}

// check for updates of the page "Modding Tutorial" from "pmgl/starblast-modding/README.md" daily
var checkUpdateModdingPage = function() {
  axios.get("https://raw.githubusercontent.com/pmgl/starblast-modding/master/README.md").then(function(data) {
    let text = data.data, req = [];
    while (text.length > 0) {
      let match = text.match(/\n+\s*\#+\s./);
      if (match) {
        let tempindex = match.index + match[0].lastIndexOf("\n") + 1;
        req.push(text.slice(0, tempindex));
        text = text.slice(tempindex, text.length);
      }
      else {
        req.push(text);
        text = "";
      }
    }
    Promise.all(req.map(r => pandoc("markdown", "mediawiki", r))).then(async function(values){
      let res = values.map(i => i + "\n").join("").trim();

      // replace all external images with local Fandom ones
      let ModdingInterfaceText;
      res = res.replace(/\[File\:\s*([^\|]+?)\|(.+\|)*(.+?)\]/g, function (Aqua, url, Kazuma, desc) {
        let text = "[File:";
        switch(url) {
          case 'https://raw.githubusercontent.com/Bhpsngum/img-src/master/ModdingInterface.png':
            text += "ModdingInterface.png|400px|thumb";
            ModdingInterfaceText = desc;
            break;
          case 'https://i.stack.imgur.com/YOBFy.png':
            text += "Hues_ruler.png|frameless|500px";
            break;
          default:
            let match = url.match(/starblast\.data\.neuronality\.com\/img\/tutorial-(.+)\.png/);
            if (match) text += "Tutorial-" + match[1] + ".png|frameless|200px";
        }
        return text+"|"+(desc||"")+"]";
      });

      // handle one small exception
      let found = res.lastIndexOf(ModdingInterfaceText);
      if (found != -1) res = res.slice(0, found - 3) + res.slice(found + ModdingInterfaceText.length + 3, res.length);
      // +-2 is to remove the 4 astrophes and 2 new lines wrapped around the text

      // set table to WikiTable with width 100%
      res = res.replace(/\n\{\|\n/g, '\n{| class = "wikitable" width = "100%"\n');

      // replace all gamepedia external links with native direct links
      res = res.replace(/\[https\:\/\/starblastio\.(fandom|gamepedia)\.com\/(wiki\/)*(.+?)\s(.+?)\]/g, function (Amane, Yashiro, Tsukasa, pageName, text) {
        pageName = pageName.replace(/_/g, " ");
        let result = (pageName == text)?pageName:(pageName+"|"+text);
        return "[["+result+"]]";
      });

      // replace all “ with " because JS doesn't accept the former
      res = res.replace(/“/g, '"');

      // remove the title
      res = res.replace("= Starblast Modding =\n", "")
      // edit the page
      bot.edit("Modding Tutorial", res, 'Testing deployment StarblastWikiBot: Update Modding Page from origin', { bot: 1, nocreate: 1, minor: 1 }, function(){});
      //await bot.edit_page('Modding_Tutorial', res, { bot: 1, nocreate: 1, minor: 1, summary: 'First Testing deploy of the StarblastWikiBot: Update Modding Page from origin' });

    }).catch(console.log);
  });
  setInterval(checkUpdateModdingPage, fetch_delay);
}
var fetchRC = function (channel, isManual, fetchDuration, criteria, callback) {
  let t = parseInt(fetchDuration), start;
  if (isNaN(t)) {
    if (isManual) return channel.send("Invalid duration. Please specify valid number of hours.");
    else start = lastDate;
  }
  else start = new Date(Date.now()-t*3600*1e3).toISOString();
  bot.api.get({
    action: 'query',
    list: 'recentchanges',
    rcprop: 'title|timestamp|comment|user|flags|sizes|ids|redirect|tags',
    rcend: new Date().toISOString(),
    rcstart: start,
    rcdir: "newer",
    rclimit: bot.API_LIMIT
  }).then(async function (data) {
    let rc = data.query.recentchanges.filter(function(item) {
      return typeof criteria == "function"?criteria(item):true
    });
    isManual && console.log(rc);
    if (!isManual && rc.length > 0) lastDate = new Date(Date.parse(rc[rc.length - 1].timestamp)+1000).toISOString();
    for (let info of rc) {
      let title = titles[info.type]||info.type;
      if (info.new) title = titles["new"];
      let difference = info.newlen - info.oldlen;
      let comment = info.comment.replace(/\[\[([^\|]+?)(\|(.+?))*\]\]/g, function(t,a,b,c) {
        return "["+page+encodeURIComponent(a)+" "+(c||a)+"]"
      }).replace(/\/\s*\*\s*(.+?)\s*\*\s*\//g, function(a, v) {
        return "[" + page + encodeURIComponent(info.title) + "#" + encodeURIComponent(v) + " Section '" + v + "']"
      }).replace(/\[(.+?)\s(.+?)\]/g,"[$2]($1)");
      var embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setTimestamp(info.timestamp)
      .setFooter('ID #'+info.rcid)
      .setColor('#0099ff')
      .addFields(
        {name: 'Page name and diffs', value: "["+info.title+"]("+page+(info.type=="log"?"Special:Log":(encodeURIComponent(info.title)+"?curid="+info.pageid+"&diff="+info.revid+"&oldid="+info.old_revid))+")"},
        {name: 'Author', value: "["+(info.anon?"`[Anomynous]` ":"")+info.user+"]("+page+(info.anon?"Special:Contributions/":"UserProfile:")+encodeURIComponent(info.user)+")"},
        {name: 'Minor edit?', value: info.minor?"Yes":"No", inline: true},
        {name: 'Redirected?', value: info.redirect?"Yes":"No", inline: true},
        {name: "Tags", value: info.tags.map(i => titles[i]||i).join(", ") || "None", inline: true}
      );
      if (info.type != "log") embed.addField("Bytes changed", info.oldlen + " --> " + info.newlen + " (" + (difference>=0?"+":"") + difference + ")", true);
      embed.addField('Comment', comment||"`None`");
      channel.send(embed);
    }
    if (rc.length == 0 && isManual) channel.send("No logs found during the specified duration.");
  });
  typeof callback == "function" && callback();
}
client.on("message", function(message) {
  if (message.content.startsWith("w!")) {
    message.content = message.content.replace("w!","");
    let commands = message.content.trim().split(" ");
    switch (commands[0].toLowerCase()) {
      case "ping":
        message.channel.send("Pong! Current ping is **"+client.ws.ping+"ms**!");
        break;
      // case "test":
      //   bot.edit({
      //     title: "User:Bhpsngum/Sandbox",
      //     content: commands[1]||"",
      //     summary: 'Bot test'
      //   }).then(function(){message.channel.send("Done!")});
      //   break;
      case "recentchanges":
      case "rc":
        fetchRC(message.channel, true, commands[1]);
        break;
      case "break":
        bot.breakThisLmao();
    }
  }
});
