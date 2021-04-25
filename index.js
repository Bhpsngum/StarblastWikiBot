const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const https=require('https');
const DiscordExtended = require('discord.js-extended');
client.login(process.env.token);
function random(i)
{
	return Math.floor(Math.random()*i);
}
function ncmd(message,content,gifs)
{
  message.channel.send(new Discord.MessageEmbed().setTitle("Megumin").setDescription(`${(content||"")}`).setImage(`${gifs[random(gifs.length)]}`).setColor("#"+random(16**6-1).toString(16)));
}
DiscordExtended.extend(client);

let seconds=0,maximg=3,timeline=1,img={}, mc;
let ManageGuild = {};
var owners = ["454602208357384201","549091067828371466","745475962736476332"], special_ppl = ["689452305212637253","422269559526129685"], admin = [...owners,...special_ppl];
client.on("ready", function() {
		console.log("Connected as "+client.user.tag);
		client.user.setActivity("Explosion to blow up the server :D");
		let fetchChannels = ["751718670870380544"]
		for (let i of fetchChannels) client.channels.cache.get(i).fetch();
		mc = client.channels.cache.get("816207078888177674");
});
var fetch = require("node-fetch");
setInterval(function(){
	if (seconds==timeline*60)
	{
		seconds=0;
		for (let i in img) img[i]=0;
	}
	seconds++;
},1000);
var command = function(message,client)
{
	let cmd=message.content;
	if (message.attachments.size>0)
	{
		switch(message.channel.id)
		{
			case "605196313293881354":	/*screenshot*/
			case "560522277435736069":	/*good-stuffs*/
			case "587933039070543873":	/*memes*/
			case "571351770530578442":	/*spam*/
			case "599584247975641118":	/*modding-files-posting*/
			case "663578444973473822":	/*ship-code*/
				break;
			default:
				if (!img[message.channel.id]) img[message.channel.id]=1;
				else if (img[message.channel.id]==maximg)
				{
					let url=[];
					for (let i of message.attachments.values()) url.push(i.url);
					let content=message.content||"Your attachments here:";
					message.delete()
					.then(function(){
						let limitimg=(maximg==1)?(""):("s")+"/";
						let limitmin=(timeline==1)?("min"):(timeline.toString()+" mins");
						let mleft=(Math.floor(seconds/60)==0)?(""):(Math.floor(seconds/60).toString()+"m");
						let sleft=(seconds%60==0)?(""):((seconds%60).toString()+"s");
						message.author.send(`Sorry, your attachments have exceeded the channel's attachments limit! (${maximg.toString()} image${limitimg}/${limitmin}\nPlease try again after ${mleft}${sleft}!`);
					}).catch(e => {});
				}
				else img[message.channel.id]++;
		}
	}
	if (cmd[0] == "`")
	{
    let args=cmd.substring(1,cmd.length).split(' '),mes,exec=args[0];
		let commands = [
			[
				"explosion",
				"explode"
			],
			"sad",
			"cry",
			"aquasmile",
			"aqualaugh",
			"aquauseless",
			"aquaangry",
			"aquacry",
			"aquashy",
			[
				"no",
				"nope",
				"yepn't",
				"yupn't",
				"yepn't"
			],
			[
				"thumbsup",
				"like"
			],
			"scared",
			[
				"yes",
				"yep",
				"yup"
			],
			"laugh",
			[
				"doublethumbsup",
				"doublelikes"
			],
			[
				"teamdance",
				"partydance"
			],
			[
				"kazumathumbsup",
				"kazumalike"
			],
			"kazumasad"
		],cm=1;
		let disabled_guild = ["718493630280499221"]
		if (disabled_guild.indexOf(message.channel.guild.id) != -1  && admin.indexOf(message.author.id) == -1) message.channel.send("Sorry, my commands are disabled here\nOnly my dedicated users are allowed to use it").then(msg => {msg.delete({timeout: 10000})}).catch(e => {});
		else switch(exec.toLowerCase())
		{
			case "random":
				cm=0;
				setTimeout(function(){message.channel.startTyping()},1000);
				setTimeout(function(){message.channel.send("random command?");message.channel.stopTyping(true)},3000);
				setTimeout(function(){message.channel.startTyping()},4000);
				setTimeout(function(){message.channel.send("hmmm... let me think");message.channel.stopTyping(true)},5000);
				setTimeout(function(){message.channel.startTyping()},6000);
				setTimeout(function(){message.channel.send("How about this?");message.channel.stopTyping(true)},7000);
				setTimeout(function(){message.channel.startTyping()},8000);
				setTimeout(function(){
					let rd=random(commands.length),rdmsg=(typeof commands[rd] === 'object')?commands[rd][random(commands[rd].length)]:commands[rd];
					message.channel.send(`\`${rdmsg}`);
					message.channel.send("________________________");
					message.channel.stopTyping(true);
				},9000);
				break;
      case "kazumasad":
        ncmd(message,"Really? He's sad :<",[
          "https://tenor.com/view/kazuma-konosuba-anger-sad-disappointed-gif-14006080"
        ]);
        break;
			case "explosion":
      case "explode":
        let mentionid= [...new Set([...message.mentions.users.keys()]).values()],msg="\n<@"+message.author.id+"> blew out ",self=false,ignore=false,userself=false;
        if (mentionid.length==0) msg="";
        else
        {
          if (mentionid.indexOf(client.user.id) != -1)
          {
            self=true;
            mentionid.splice(mentionid.indexOf(client.user.id),1);
          }
          if (mentionid.indexOf(message.author.id) != -1)
          {
            userself=true;
            mentionid.splice(mentionid.indexOf(message.author.id),1);
          }
          if (mentionid.length==0)
          {
            if (!userself)
            {
              ignore=true;
              message.channel.send("But... w-why do i have to explode myself ;-;");
            }
            else
            {
              msg+="themselves :D";
            }
          }
          else
          {
            for (let id=0;id<mentionid.length;id++) mentionid[id]="<@"+mentionid[id]+">";
            if (mentionid.length == 1)
            {
              msg+=mentionid[0];
              if (userself) msg+=" and themselves";
            }
            else
            {
              msg+=mentionid.slice(0,mentionid.length-1).join(", ");
              if (userself) msg+=", "+mentionid[mentionid.length-1]+" and themselves";
              else msg+=" and "+mentionid[mentionid.length-1];
            }
            msg+=" :D";
            if (self) msg+="\n(nah, I'm using my explosion, so there's no way I will take the damage lol)";
          }
        }
				if (!ignore) ncmd(message,"EXPLOSION!\n"+msg,[
          "https://tenor.com/view/konosuba-explode-pyromancer-rekt-explosion-gif-11415028",
          "https://tenor.com/view/explosion-gif-9488133",
          "https://tenor.com/view/megumin-konosuba-explode-boom-gif-13780914",
          "https://tenor.com/view/megumin-fire-anime-magic-gif-8587771"
        ]);
				break;
			case "sad":
				ncmd(message,":<",[
          "https://tenor.com/view/megumin-arch-wizard-crimson-demon-clan-sad-about-to-cry-gif-15174157"
        ]);
				break;
			case "cry":
        ncmd(message,"😭",[
          "https://tenor.com/view/megumin-konosuba-cry-gif-13780912"
        ]);
				break;
			case "hi":
			case "hello":
				cm=0;
				message.channel.startTyping();
				setTimeout(function(){message.channel.send("Hi <@"+message.author.id+">!\nHave a good day!");message.channel.stopTyping(true)},3000);
				break;
			case "bye":
				cm=0;
				message.channel.startTyping();
				setTimeout(function(){message.channel.send("It's sad to see you go <@"+message.author.id+"> :<\nAnyway, Have a good day!");message.channel.stopTyping(true)},3000);
				break;
			case "help":
				let msgh = "Hi! I'm Megumin :3\n"+
				"My job here is mainly deleting and delivering messages to its right channel,\n"+
				"But if you want to wake me up, you can use these commands:\n"+
				"My prefix here is \\`, Enjoy!\n"+
				"**explosion**: Use my explosion ability, you can tag someone to get them involved to the explosion :D, make sure that you're choose the safe place to avoid the destruction!\n"+
				"**aquacry**: I will make Aqua cry and send it to you, but please don't ask me for this :<\n"+
				"**aqualaugh**: Just tell a joke to her and wait for her reaction, kinda easy :D\n"+
				"**aquashy**: Make Aqua shy :\">\n"+
				"**aquaangry**: Make her angry, be careful 'cus she'll not like what you're thinking :/\n"+
				"**laugh**: I'm laughing :D\n"+
				"**yes**: yes from me :>\n"+
				"**no**: a big no from me :)\n"+
				"**thumbsup**: You'll be given a thumbs up from me :D\n"+
				"**doublethumbsups**: Double thumbs ups from me and Aqua :D\n"+
				"**sad**: I'm sad :<\n"+
				"**cry**: I'm crying 😭\n"+
				"**hi**: Greetings from mine!\n"+
				"**bye**: Really :<, see you again\n"+
				"**help**: Give you a guide from me\n"+
				"And there are many hidden commands too, have fun finding it :D";
				message.channel.send(msgh);
				break;
      case "aquasmile":
        ncmd(message,":)",[
          "https://tenor.com/view/konosuba-aqua-chibi-smile-eneko-gif-14792624"
        ]);
				break;
			case "aqualaugh":
        ncmd(message,"Aqua laughed so hard :D",[
          "https://tenor.com/view/anime-girl-laugh-cute-gif-12252557"
        ]);
				break;
      case "aquauseless":
			case "aquaangry":
        if (!random(2))
        {
          if ("AQUAUSELESS"==exec.toUpperCase()) mes="Really? You make her angry 😱";
          else mes="K i've done :) Wait a sec...\nNANI??";
          ncmd(message,mes,[
            "https://tenor.com/view/konosuba-aqua-angry-gif-14708521"
          ]);
          break;
        }
      case "aquacry":
        if ("AQUAUSELESS"==exec.toUpperCase()) mes="Really? She's crying because of that :<";
        else mes="It's not too hard for me to make Aqua cry, but... don't ask me for that next time :<";
        ncmd(message,mes,[
          "https://tenor.com/view/aqua-anime-cry-gif-10893043",
          "https://tenor.com/view/aqua-crying-sad-lonely-gif-15064840",
          "https://tenor.com/view/aqua-kono-subarashii-sad-teary-eye-gif-13601442",
          "https://tenor.com/view/aqua-gif-10582639"
        ]);
        break;
      case "aquashy":
        ncmd(message,":\">",[
          "https://tenor.com/view/konosuba-aqua-nervous-shy-gif-13921933",
          "https://tenor.com/view/anime-shy-cute-aqua-kono-suba-gif-15458919",
          "https://tenor.com/view/aqua-kono-suba-anime-manga-pointing-gif-15411826"
        ]);
        break;
      case "no":
      case "nope":
      case "yesn't":
      case "yupn't":
      case "yepn't":
        ncmd(message,exec.toUpperCase()+"! :D",[
          "https://tenor.com/view/konosuba-no-megumin-nope-nah-gif-10202831"
        ]);
        break;
      case "thumbsup":
      case "like":
        ncmd(message,"👍",[
          "https://tenor.com/view/megumin-thumbs-up-okay-approve-like-gif-11492110"
        ]);
        break;
      case "scared":
        ncmd(message,"😱",[
          "https://tenor.com/view/anime-shocked-konosuba-megumin-gif-14210797"
        ]);
        break;
      case "yep":
      case "yes":
      case "yup":
        ncmd(message,exec.toUpperCase(),[
          "https://tenor.com/view/megumin-yes-isekai-quartet-konosuba-lol-gif-14047646",
          "https://tenor.com/view/anime-megumin-nod-gif-13451461"
        ]);
        break;
      case "doublethumbsups":
      case "doublelikes":
        ncmd(message,"nice :D",[
          "https://tenor.com/view/konosuba-anime-aqua-megumin-thumbs-up-gif-16674639",
          "https://tenor.com/view/nice-bakuretsu-nice-bakuretsu-explosion-nice-explosion-gif-13721423"
        ]);
        break;
      case "laugh":
        ncmd(message,":)",[
          "https://tenor.com/view/konosuba-megumin-laughing-laugh-giggle-gif-16688519"
        ]);
        break;
      case "teamdance":
      case "partydance":
        ncmd(message,"It's Dancing time!",[
          "https://tenor.com/view/konosuba-anime-darkness-dancing-aqua-gif-16674643"
        ]);
        break;
      case "kazumathumbsup":
      case "kazumalike":
        ncmd(message,"Kazuma gives you a big 👍 :D",[
          "https://tenor.com/view/satou-kazuma-thumbs-up-fish-grill-anime-gif-14047702",
          "https://tenor.com/view/konosuba-kazuma-anime-ok-thumbs-up-gif-16688549",
          "https://tenor.com/view/aqua-konosuba-kazuma-thumbs-up-okay-gif-16688512"
        ]);
        break;
			case "say":
				let chid = args[1], msgs = args.slice(2,args.length).join(" "), failf = () => message.channel.send("An unknown error occured.")
				if (admin.indexOf(message.author.id) != -1) try{
					let channel = client.channels.cache.get(chid);
					channel.send(msgs).catch(failf);
					let guild = channel.guild||{};
					let mesg = (msgs.match(/[^]{1,1950}/g)||[]).filter(i=>i);
					if (mesg.length == 0) mesg = [{}];
					mesg.forEach((m,i) => mc.send(new Discord.MessageEmbed().setTitle("Say Log (Page "+(i+1)+"/"+mesg.length+")").setDescription("Used by <@!"+message.author.id+"> in <#"+chid+"> (ID "+chid+").\nServer: **"+(guild.name||"Unknown")+"** (ID "+guild.id+").\nMessage content:\n_______\n"+(typeof m == "string"?m:"No content.")).setColor("#0000FF")));
				}catch(e){failf()};
				message.delete().catch(e=>{});
				cm=0;
				break;
			case "ping":
				message.channel.send("EXPLOSION!").then(msg => msg.edit("Pong! Everything got exploded in **"+client.ws.ping+"ms**!"));
				break;
			case "invite":
				message.channel.send(new Discord.MessageEmbed().setTitle("Invite me to your servers! :D").setURL("https://discord.com/api/oauth2/authorize?client_id=688593742038695965&permissions=0&scope=bot").setColor("#FFC0CB"));
				cm = 0;
				break;
			case "talk-permission":
				if (args[1] === "612gdbou1208") {
					message.channel.send("Here is the list of members that can talk through me!\n**Bot Owners:**\n"+owners.map(i=>"<@"+i+">").join("\n")+"\n**Special people:**\n"+special_ppl.map(i=>"<@"+i+">").join("\n"));
					message.delete().catch(e=>{})
				}
				cm = 0;
				break;
			case "testinvite":
				client.getInviteInfo(args[1]||"").then(data => {
					data = data.guild || {};
					message.channel.send("Server Name: **"+data.name+"** (ID "+data.id+")")
				}).catch(() => message.channel.send("Invalid invite!"));
				cm = 0;
				break;
			case "eval":
				let ctx = owners.indexOf(message.author.id) != -1 || ["689452305212637253","749284222862098493"].indexOf(message.author.id) != -1, evalmsg;
				if (ctx) {
					evalmsg = args.slice(1,args.length).join(" ");
					let evlog = (evalmsg.match(/[^]{1,1950}/g)||[]).filter(i=>i);
					if (evlog.length == 0) evlog = [{}];
					evlog.forEach((fres, i) => mc.send(new Discord.MessageEmbed().setTitle("Evaluation Log (Page "+(i+1)+"/"+evlog.length+")").setDescription("**<@!"+message.author.id+"> used the ``eval` command:**\n"+(typeof fres != "string"?"No content found.":("```js\n"+fres+"\n```"))).setColor("#0000FF")));
				}
				let utx = owners.indexOf(message.author.id) != -1?client:undefined;
				if (ctx) {
					let DiscordExtended, https, random, ncmd, seconds, maximg, timeline, img, ManageGuild, owners, special_ppl, admin, fetch, getGuildInfo, ManageMessage, commands, cm, mes, exec, disabled_guild, process, client = utx, color, content, title, logtitle, g = console.log, success, wlist = [];
					console.log = function(...items) {wlist.push(...items)}
					try{
						let cmd, args, utx, evlog, mc, g, success, wlist;
						let evalres = eval(evalmsg);
						evalres = (function(evalres) {
							if (evalres == null) {
								if (evalres === null) return "null";
								else return "undefined";
							} else switch (typeof evalres) {
								case "object":
									try{return JSON.stringify(evalres, null, '\t')}catch(e){return "[Non-parsable Object]"}
								case "string":
									return '"'+evalres.replace(/"/g,"\\\"")+'"';
								default:
									if (evalres == console.log) return "function () { [native code] }";
									return evalres.toString();
							}
						})(evalres);
						evalres = (evalres.match(/[^]{1,1950}/g)||[]).filter(i=>i);
						if (evalres.length == 0) evalres = ["undefined"];
						success = true;
						content = evalres;
						title = "Evaluation Results";
						logtitle = "Evaluation Success";
						color = "#00FF00";
					}catch(e){
						if (e instanceof Error) {
							let t = e.name + (e.message?(": "+e.message):"");
							e = t + "\n" + e.stack.replace(t+"\n","").split("\n")[0];
						} else e = (function(evalres) {
							if (evalres == null) {
								if (evalres === null) return "null";
								else return "undefined";
							} else switch (typeof evalres) {
								case "object":
									try{return JSON.stringify(evalres, null, '\t')}catch(e){return "[Non-parsable Object]"}
								case "string":
									return '"'+evalres.replace(/"/g,"\\\"")+'"';
								default:
									if (evalres == console.log) return "function () { [native code] }";
									return evalres.toString();
							}
						})(e);
						e = (e.match(/[^]{1,1950}/g)||[]).filter(i=>i);
						if (e.length == 0) e = ["undefined"];
						content = e;
						title = "An error occured!";
						logtitle = "Evaluation Failed";
						color = "#FF0000";
						success = false;
					}
					if (success && wlist.length > 0) {
						wlist = wlist.map(i => ((function(evalres) {
							if (evalres == null) {
								if (evalres === null) return "null";
								else return "undefined";
							} else switch (typeof evalres) {
								case "object":
									try{return JSON.stringify(evalres, null, '\t')}catch(e){return "[Non-parsable Object]"}
								case "string":
									return '"'+evalres.replace(/"/g,"\\\"")+'"';
								default:
									if (evalres == console.log) return "function () { [native code] }";
									return evalres.toString();
							}
						})(i).match(/[^]{1,1950}/g)||[]).filter(i=>i).map(i => "> "+i)).flat();
					}
					if (wlist.length > 0) content = [wlist, content].flat();
					content.forEach((fres, i) => message.channel.send(new Discord.MessageEmbed().setTitle((wlist.length>0?("Evaluation "+(i<wlist.length?"Logs":"Results")):title)+" (Page "+(i+1)+"/"+content.length+")").setDescription("```js\n"+fres+"\n```").setColor(color)));
					content.forEach((fres, i) => mc.send(new Discord.MessageEmbed().setTitle((wlist.length>0?("Evaluation "+(i<wlist.length?"Log":"Results")):logtitle)+" (Page "+(i+1)+"/"+content.length+")").setDescription("**Used by <@!"+message.author.id+">:**\n```js\n"+fres+"\n```").setColor(color)));
					console.log = g;
				}
				cm = 0;
				break;
			default:
				cm=0;
		}
		if (cm && !random(5)) message.channel.send("**Tip:** Try `\`random` to explore my hidden commands! :D");
	}
  else if (message.mentions.users.get(client.user.id) && message.author.id != client.user.id)
  {
		message.channel.startTyping();
  	setTimeout(function(){message.channel.send("Hi <@"+message.author.id+">!\nGlad to see you here! ^^");message.channel.stopTyping(true)},3000);
  }
}
var ManageMessage =  function(message,client,tf,includes,content,alchannelid)
{
	let condition=false;
	message.content.replace(includes,function(v){condition=true});
	if (condition==tf)
	{
		let usercontent=message.content;
		message.delete()
		.then(function()
		{
			if (!tf)
			{
				message.author.send(`Sorry, only ${content} links are allowed in this channel\nYour message will be displayed here for your convenience:`);
				message.author.send(usercontent);
			}
			else
			{
				message.author.send(`Sorry, ${content} links is not allowed in this channel\nYour message has been sent to the proper channel instead (check my ping for you to see the message)\nEnjoy!`);
				let adreg=false;
				usercontent.replace("https://"+includes,function(v){adreg=true});
				if (!adreg) usercontent=usercontent.replace(includes,"https://"+includes);
				client.channels.cache.get(alchannelid).send("Message from <@"+message.author.id+">:\n"+usercontent);
			}
		}).catch(e => {});
	}
	return condition==tf;
}
ManageGuild.message = function (message,client)
{
	switch (message.channel.guild.id)
	{
		case "547049374778130443":
		{
			switch(message.channel.id)
			{
				case "595894985740648449":     /*#link-posting-starblast*/
					return ManageMessage(message,client,false,"starblast.io","Starblast");
				case "595865501675159554":   /*#discord-server-posting*/
					return ManageMessage(message,client,false,"discord.gg","Discord invitation");
				case "595882289016340490":			/*#link-posting-surviv*/
					return (ManageMessage(message,client,true,"starblast.io","Starblast","595894985740648449") ||
					ManageMessage(message,client,true,"discord.gg","Discord invitation","595865501675159554"))
				case "605196313293881354":	/*screenshots*/
					if (message.attachments.size == 0)
					{
						let dat=message.content;
						message.delete()
						.then(function()
						      {
							message.author.send("Sorry, only attachments are allowed in this channel\nYour message will be displayed here for your convenience:");
							message.author.send(dat);
						})
						.catch(e => {});
					}
					return 1;
				default:
				return (ManageMessage(message,client,true,"starblast.io","Starblast","595894985740648449") ||
				ManageMessage(message,client,true,"discord.gg","Discord invitation","595865501675159554") ||
				ManageMessage(message,client,true,"surviv.io","Surviv","595882289016340490"));
			}
		}
		break;
		case "695547560240349234":
			if (message.channel.id == "751718670870380544") {
				let names = ["731156851240206366","♻️"];
				for (let i of names) message.react(i);
			}
			return !1;
	}
}
ManageGuild.Reaction = function(RMessage,user,client)
{
	let message = RMessage.message;
	switch(message.channel.guild.id)
	{
		case "718493630280499221":
			if (message.channel.id == "739870895450882148")
			{
				let accept = ["👍","👎","✅"];
				let admin_accept = ["☑️"];
				let admin = ["454602208357384201","422269559526129685","393460366010482689"];
				let warn =0;
				if (accept.indexOf(RMessage.emoji.name) == -1)
				{
					if (admin_accept.indexOf(RMessage.emoji.name) == -1) warn =1;
					else if (admin.indexOf(user.id) == -1) warn =1;
				}
				if (warn)
				{
					client.channels.cache.get("739863008033112154").send("<@"+user.id+"> don't abuse reactions in the <#739870895450882148> channel!")
					.then(msg => {msg.delete({timeout: 10000})}).catch(e => {});
					RMessage.users.remove(user);
				}
			}
			break;
		case "695547560240349234":
			if (message.channel.id == "751718670870380544")
			{
				let accept = ["yeetus","♻️","✅"];
				let admin_accept = ["☑️"];
				let admin = ["454602208357384201","422269559526129685","489586569779609601","549091067828371466"];
				let warn =0;
				if (accept.indexOf(RMessage.emoji.name) == -1)
				{
					if (admin_accept.indexOf(RMessage.emoji.name) == -1) warn =1;
					else if (admin.indexOf(user.id) == -1) warn =1;
				}
				if (warn)
				{
					client.channels.cache.get("745981065285468201").send("<@"+user.id+"> pls vote correctly in <#751718670870380544> or u die\n  - *45rfew the Money*")
					.then(msg => {msg.delete({timeout: 10000})}).catch(e => {});
					RMessage.users.remove(user);
				}
			}
			break;
	}
}
client.on("messageReactionAdd", function(rmes,user) {
	if (rmes.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			rmes.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	ManageGuild.Reaction(rmes,user,client);
});
client.on("message", function(message) {
  if (!ManageGuild.message(message,client)) command(message, client);
});
client.on("messageUpdate", function(oldMessage,newMessage)
{
	ManageGuild.message(newMessage,client);
})
client.on("guildCreate", function (guild) {
	try{mc.send(new Discord.MessageEmbed().setTitle("Guild Joined").setDescription("Server: **"+(guild.name||"Unknown")+"** (ID "+guild.id+")").setColor("#00FF00"))}catch(e){}
});
client.on("guildDelete", function (guild) {
	try{mc.send(new Discord.MessageEmbed().setTitle("Guild Left/Deleted").setDescription("Server: **"+(guild.name||"Unknown")+"** (ID "+guild.id+")").setColor("#FF0000"))}catch(e){}
});
