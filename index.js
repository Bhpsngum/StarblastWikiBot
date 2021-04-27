// This bot is still in development, remove the first 2 lines to test it
ThrowAWackyErrorSoThatTheBotCantRun();

// packages declaration
// var WikiAPI = require("wikiapi");
var WikiAPI = require("nodemw");
var axios = require("axios");
var fetch_delay = 86400; // in seconds

// declare and log the bot in
// var bot = new WikiAPI("http://starblastio.fandom.com/api.php");
var bot = new WikiAPI({
  protocol: "https",
  server: 'starblastio.fandom.com',
  path: '',
  debug: true,
  username: "StarblastWikiBot",
  password: process.env.password
});
//console.log(bot);

//bot.login("StarblastWikiBot", "qhgeoble0lboq7s5m394r2175l0a63us", function(){});

// pandoc converter
var pandoc = function (originalLang, targetLang, content) {
  return new Promise(function(resolve, reject) {
    let requests = ((content||"").match(/[^]{1,4000}/g) || []).filter(i => i);
    if (requests.length == 0) reject(new Error("Malfunctioned input data"));
    else Promise.all(requests.map(i => axios.get("https://pandoc.org/cgi-bin/trypandoc?from="+originalLang+"&to="+targetLang+"&text="+encodeURIComponent(i)+"&standalone=0"))).then(function (values) {
      resolve(values.map(v => ((v||{}).data||{}).html || "").join(""));
    }).catch(function(e){reject(new Error(e))})
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

// keep the bot working
//bot.listen(function(){}, { delay: '1h' });

// Do all actions
checkUpdateModdingPage();
