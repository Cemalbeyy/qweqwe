const loglar = require('./ayarlar.json');
const {
    stripIndents,
    oneLine
} = require('common-tags');
const Discord = require("discord.js");
const client = new Discord.Client();
const express = require('express');
const app = express();
const http = require('http');
const moment = require("moment-timezone");
moment.tz.setDefault("Europe/Istanbul");
const Jimp = require('jimp');
const GIFEncoder = require('gifencoder');
const db = require('quick.db')
const weather = require('weather-js');
const arraySort = require('array-sort');
const table = require('table');
const figlet = require('figlet');
const moment2 = require('moment');
require('moment-duration-format');
const Cleverbot = require("cleverbot-node");
const clbot = new Cleverbot;
const fs = require("fs");
const ms = require('ms');
const chalk = require('chalk')
const { Command } = require('discord.js-commando');
const request = require('request-promise');
const snekfetch = require('snekfetch');
const DBL = require("dblapi.js");
const util = require('util');
const urlExists = util.promisify(require('url-exists'));
const oneLine2 = require('common-tags').oneLine;
const commando = require('discord.js-commando');
const queue = new Map();
require('./util/eventLoader')(client);

client.queue = new Map()

app.get("/", (request, response) => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Loxy's Inc.: '${Date.now()}' aktifim olm ne bakıyon aq`);
  response.sendStatus(200);
});
client.on("ready", async message => {
  var Activity = [
      

               "♕ Yeniden Yükseliş",
               "💡 v?davet | Botumuzu ekleyin",
               "🔥 v?yardım 🔥 + v?davet 🔥 + v?otorol 🔥",
               "》 Prefixim : v? ",
               ` ☇ ${client.guilds.size} Sunucuya ve ${client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} Kullanıcıya hizmet !`,
               "💪 7/24 Aktifim ! ",
               "👀 Seni !",
    

  ];

setInterval(function() {

      var random = Math.floor(Math.random()*(Activity.length-0+1)+0);

      client.user.setActivity(Activity[random], { type: 'WATCHING' });
      }, 23000);
  
  client.user.setStatus("idle")

});
//

client.on('messageReactionAdd', (reaction, user) => {
    /*if (reaction.emoji.id == "537246439789821953"){
      reaction.message.guild.members.get(user.id).addRole("545918036658356225").catch(error => { 
        return console.log("WeracsAPIError: Rol verilemedi")
    });//siyah
    }*/
  
    if (reaction.emoji.name == "⛔"){
      reaction.message.guild.members.get(user.id).addRole("550770567075201086").catch(error => { 
        return console.log("LoxyAPIError: Rol verilemedi")
    });//nsfw
    }
});

client.on('messageReactionRemove', (reaction, user) => {
    /*if (reaction.emoji.id == "537246439789821953"){
      reaction.message.guild.members.get(user.id).removeRole("545918036658356225").catch(error => { 
        return console.log("WeracsAPIError: Rol verilemedi")
    });//siyah
    }*/
  
    if (reaction.emoji.name == "⛔"){
      reaction.message.guild.members.get(user.id).removeRole("550770567075201086").catch(error => { 
        return console.log("LoxyAPIError: Rol verilemedi")
    });//nsfw
    }
});

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Vélskud - Yüklenen komutlar: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};
//

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === loglar.sahip) permlvl = 4;
  return permlvl;
};
client.on('guildCreate', guild => {
  client.channels.get('584719982273757184').send(`${process.env.basarili} \`${guild.name}\`(${guild.id}) adlı Sunucuya eklendim , bu sunucuda \`${guild.memberCount}\` kişi var , sunucusunun kurucusu ise ${guild.owner}(${guild.ownerID}) `);
});


client.on('guildDelete', guild => {
  client.channels.get('584719982273757184').send(`${process.env.basarisiz} \`${guild.name}\`(${guild.id}) adlı Sunucusundan atıldım , bu sunucuda \`${guild.memberCount}\` kişi var , sunucusunun kurucusu ise ${guild.owner}(${guild.ownerID}) `);
 
});



client.on('message',async message => {
if (message.content === '<@501445677092569124>') {
  let p = await db.fetch(`prefix_${message.guild.id}`);
    message.channel.send(`:no_entry: Bu sunucuda prefix ``v?`` olarak ayarlanmıştır, komutları kullanırken başına ayarlanan ön-ek'i kullanınız.`)
}
});

client.on('message', message => {
if (message.channel.type === 'dm') {
  if (message.author.bot) return;
  const embed = new Discord.RichEmbed()
    .setColor(0xffa300)
    .setAuthor(`${message.author.username} kullanıcısı bota mesaj attı.`, message.author.avatarURL)
    .addField("Mesaj içeriği", '```' + message.content + '```')
    .setFooter(`Kanal: DM | Kullanıcı: ${message.author.tag}`, client.user.avatarURL)
    .setTimestamp()
  client.channels.get('584729991338524702').send(embed)
}
});
//MÜZİK//
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube('AIzaSyCJrGp1nROqIEp9mDXd1iV-gl5wYXNeDMs');

client.on("message", async message => {
  
  if (!message.guild) return;
 
  
  let prefix = await db.fetch(`prefix_${message.guild.id}`) || "v?";
  
  var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
  var searchString = args.slice(1).join(' ');
  var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  var serverQueue = queue.get(message.guild.id);
  
    switch (args[0].toLowerCase()) {
        
      case "çal":
    var voiceChannel = message.member.voiceChannel;
        
    const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription("Dinlemek istediğin şarkıyı yazmalısın! (Şarkı ismi veya Youtube URLsi)")
    if (!url) return message.channel.send(embed);
        
    const voiceChannelAdd = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Lütfen herhangi bir sesli kanala katılınız.`)
    if (!voiceChannel) return message.channel.send(voiceChannelAdd);
    var permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) {
      const warningErr = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Herhangi bir sesli kanala katılabilmek için yeterli iznim yok.`)
      return message.channel.send(warningErr);
    }
    if (!permissions.has('SPEAK')) {
      const musicErr = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Müzik açamıyorum/şarkı çalamıyorum çünkü kanalda konuşma iznim yok veya mikrofonum kapalı.`)
      return message.channel.send(musicErr);
    }
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      var playlist = await youtube.getPlaylist(url);
      var videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        var video2 = await youtube.getVideoByID(video.id);
        await handleVideo(video2, message, voiceChannel, true);
      }
      const PlayingListAdd = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setDescription(`[${playlist.title}](https://www.youtube.com/watch?v=${playlist.id}) İsimli şarkı oynatma listesine Eklendi.`)
      return message.channel.send(PlayingListAdd);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
      try {
          var videos = await youtube.searchVideos(searchString, 10);
          
          var r = 1
        
          var video = await youtube.getVideoByID(videos[r - 1].id);
        } catch (err) {
          console.error(err);
          const songNope = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setDescription(`Aradığınız isimde bir şarkı bulamadım.`) 
          return message.channel.send(songNope);
        }
      }
      return handleVideo(video, message, voiceChannel);
    }
    break
       case "tekrar":
       const e = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`) 
    if (!message.member.voiceChannel) return message.channel.send(e);
    const p = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(p);
        
    var u = serverQueue.songs[0]
        
    /*var pla = await youtube.getPlaylist(u);
      var v = await pla.getVideos();*/
      var vi2 = await youtube.getVideoByID(u.id);
      await handleVideo(vi2, message, voiceChannel, true);
    const PlayingListAdd = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`[${u.title}](https://www.youtube.com/watch?v=${u.id}) İsimli şarkı bitince tekrar oynatılacak.`)
    return message.channel.send(PlayingListAdd);
        
    break;
      case "geç":
      const err0 = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`) 
    if (!message.member.voiceChannel) return message.channel.send(err0);
    const err05 = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(err05);
    const songSkip = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla geçildi!`)
    serverQueue.connection.dispatcher.end('');
    message.channel.send(songSkip)
    return undefined;
break;
      case "durdur":
    const err1 = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Bir sesli kanalda değilsin.`)  
    if (!message.member.voiceChannel) return message.channel.send(err1);
    const err2 = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(err2);
    serverQueue.songs = [];
    const songEnd = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla durduruldu ve odadan ayrıldım!`)
    serverQueue.connection.dispatcher.end('');
    message.channel.send(songEnd);
    return undefined;
break;
      case "ses":
      const asd1 = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`)  
    if (!message.member.voiceChannel) return message.channel.send(asd1);
    const asd2 = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(asd2);

    if (!args[1]) return message.reply("Ses seviyesi ayarlamak için bir sayı yaz!");
    serverQueue.volume = args[1];
    if (args[1] > 10) return message.channel.send(`Ses seviyesi en fazla \`10\` olarak ayarlanabilir.`)
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    const volumeLevelEdit = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Ayarlanan Ses Seviyesi: **${args[1]}**`)
    return message.channel.send(volumeLevelEdit);
break;
      case "kuyruk":
      var siralama = 0;
        const a = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`)  
    if (!message.member.voiceChannel) return message.channel.send(a);
    const b = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(b);
        
    var k = serverQueue.songs.map(song => `${++siralama} - [${song.title}](https://www.youtube.com/watch?v=${song.id})`).join('\n').replace(serverQueue.songs[0].title, `**${serverQueue.songs[0].title}**`)
        
    const kuyruk = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("Şarkı Kuyruğu", k)
    return message.channel.send(kuyruk)
break;
case "duraklat":
      if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        const asjdhsaasjdha = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla duraklatıldı!`)
      return message.channel.send(asjdhsaasjdha);
    }
    return message.channel.send('Şuanda herhangi bir şarkı çalmıyor.');
break;
      case "devamet":
      if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        const asjdhsaasjdhaadssad = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla devam ettiriliyor...`)
      return message.channel.send(asjdhsaasjdhaadssad);
    }
    return message.channel.send('Şuanda herhangi bir şarkı çalmıyor.');
  

  return undefined;
break;
}
async function handleVideo(video, message, voiceChannel, playlist = false) {
  var serverQueue = queue.get(message.guild.id);
  //console.log(video);
  var song = {
    id: video.id,
    title: video.title,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
		durations: video.duration.seconds,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
    requester: message.author.id,
  };
  if (!serverQueue) {
    var queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 3,
      playing: true
    };
    queue.set(message.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(message.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Ses kanalına giremedim HATA: ${error}`);
      queue.delete(message.guild.id);
      return message.channel.send(`Ses kanalına giremedim HATA: ${error}`);
    }
  } else {
    serverQueue.songs.push(song);
    //console.log(serverQueue.songs);
    if (playlist) return undefined;

    const songListBed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`[${song.title}](https://www.youtube.com/watch?v=${song.id}) isimli şarkı kuyruğa eklendi!`)
    return message.channel.send(songListBed);
  }
  return undefined;
}
  function play(guild, song) {
  var serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  //console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', reason => {
      if (reason === 'İnternetten kaynaklı bir sorun yüzünden şarkılar kapatıldı.');
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  
  const playingBed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Şuanda Oynatılıyor`, "https://davidjhinson.files.wordpress.com/2015/05/youtube-icon.png")
  .setDescription(`[${song.title}](${song.url})`)
  .addField("Şarkı Süresi", `${song.durationm}:${song.durations}`, true)
  .addField("Şarkıyı Açan Kullanıcı", `<@${song.requester}>`, true)
  .setThumbnail(song.thumbnail)
  serverQueue.textChannel.send(playingBed);
}
  

});
const invites = {};
const wait = require('util').promisify(setTimeout);

client.on('ready', async () => {
  wait(1000);
  client.guilds.forEach(g => {
    g.fetchInvites()
    .catch(error => { 
        return console.log("Loxy's Inc.: DiscordAPIError: Missing Permissions")
    })
    .then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

client.on('guildMemberAdd', async member => {
  let davetChannel = await db.fetch(`davetChannel_${member.guild.id}`)
  member.guild.fetchInvites().then(guildInvites => {
    const ei = invites[member.guild.id];
    invites[member.guild.id] = guildInvites;
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    const inviter = client.users.get(invite.inviter.id);
    if (!member.guild.channels.get(davetChannel)) return console.log(`Sanırım bi bok yedik?`)
    else member.guild.channels.get(davetChannel).send(`<a:LOXYsGiris:525006229307785237> \`${member.user.tag}\` adlı kullanıcı sunucuya, ${inviter.tag} tarafından sunucuya davet edildi! [**${invite.uses}** davete sahip!]`)
  });
});

client.on('guildMemberAdd', async (member, guild, message) => {
let role = await  db.fetch(`otorolisim_${member.guild.id}`)
 let otorol = await db.fetch(`autoRole_${member.guild.id}`)
 let i = await db.fetch(`otorolKanal_${member.guild.id}`)
 if (!otorol || otorol.toLowerCase() === 'yok') return;
else {
 try {
  
  if (!i) return 
  member.addRole(member.guild.roles.get(otorol))
  member.guild.channels.get(i).send(`${process.env.basarili} Sunucuya hoşgeldin \`${member.user.tag}\`!  \`${role}\` rolünü başarıyla verdim.`) 
} catch (e) {
 console.log(e)
}
}
});
client.on('raw', event => {
    if (event.t === 'MESSAGE_REACTION_ADD'){
        let channel = client.channels.get(event.d.channel_id);
        let message = channel.fetchMessage(event.d.message_id).then(msg=> {
        let user = msg.guild.members.get(event.d.user_id);
        
          if (db.has(`kayıt_${msg.guild.id}`)) {
            if (user.id != client.user.id){
              let mesaj = db.get(`kayıtmesaj_${msg.guild.id}`)
              let srol = db.get(`kayıtrol_${msg.guild.id}`)
              if (msg.id == mesaj) {
                var roleObj = msg.guild.roles.get(srol);
                var memberObj = msg.guild.members.get(user.id);
                    memberObj.removeRole(roleObj)
                if (db.has(`kayıtotorol_${msg.guild.id}`)) {
                  memberObj.addRole(db.get(`kayıtotorol_${msg.guild.id}`))
                } 
              }
            }
          }
        })
        }
});
client.on("guildMemberAdd", async member => {
  const mkanal = await db.fetch(`mesajk_${member.guild.id}`)
  const mkanal1 = member.guild.channels.find('name', mkanal)
  const girmesaj = await db.fetch(`girismesaj_${member.guild.id}`)
 mkanal1.send(girmesaj ? girmesaj.replace('{kullanıcı}', `${member.user}`) .replace('{sunucu}', `${member.guild.name}`) : `\`${member.user.tag}\` Adlı Kullanıcı Sunucuya Katıldı. (${ayarlar.prefix}giriş-mesaj-ayarla komutu ile değiştirilebilir.)`);
});
client.on("guildMemberRemove", async member => {
  const mkanal = await db.fetch(`mesajk_${member.guild.id}`)
  const mkanal1 = member.guild.channels.find('name', mkanal)
  const cikmesaj = await db.fetch(`cikismesaj_${member.guild.id}`)
  mkanal1.send(cikmesaj ? cikmesaj.replace('{kullanıcı}', `${member.user}`) .replace('{sunucu}', `${member.guild.name}`) : ` \`${member.user.tag}\` Adlı Kullanıcı Sunucudan Ayrıldı. (${ayarlar.prefix}çıkış-mesaj-ayarla komutu ile değiştirilebilir.)`);
});
      client.on('channelDelete', async (channel, guild, msg) => {
if (channel.type === "text") {
       let membermodChannel = await db.fetch(`membermodChannel_${channel.guild.id}`)
  if (!channel.guild.channels.get(membermodChannel)) return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] '${guild.name}' adlı sunucuda '${channel.name}' adlı metin kanalı silindi.`)
  else channel.guild.channels.get(membermodChannel).send(`[**${moment().format('HH:mm:ss')}**] :package: **#${channel.name}** adlı metin kanalı silindi.`)};
                      if (channel.type === "voice") {
let membermodChannel = await db.fetch(`membermodChannel_${channel.guild.id}`)
  if (!channel.guild.channels.get(membermodChannel)) return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] '${guild.name}' adlı sunucuda '${channel.name}' adlı ses kanalı silindi.`)
  else channel.guild.channels.get(membermodChannel).send(`[**${moment().format('HH:mm:ss')}**] :package: **#${channel.name}** adlı ses kanalı silindi.`)}      
      })
     client.on('channelCreate', async (channel, guild, msg) => {
                      if (channel.type === "text") {
                               let membermodChannel = await db.fetch(`membermodChannel_${channel.guild.id}`)
  if (!channel.guild.channels.get(membermodChannel)) return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] '${guild.name}' adlı sunucuda '${channel.name}' adlı metin kanalı oluşturuldu.`)
  else channel.guild.channels.get(membermodChannel).send(`[**${moment().format('HH:mm:ss')}**] :package: <#${channel.id}> adlı metin kanalı oluşturuldu.`)};
                      if (channel.type === "voice") {
       let membermodChannel = await db.fetch(`membermodChannel_${channel.guild.id}`)
  if (!channel.guild.channels.get(membermodChannel)) return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] '${guild.name}' adlı sunucuda '${channel.name}' adlı ses kanalı oluşturuldu.`)
  else channel.guild.channels.get(membermodChannel).send(`[**${moment().format('HH:mm:ss')}**] :package: **#${channel.name}** adlı ses kanalı oluşturuldu.`)}
                      })
                      client.on('ready', () => {
                        const moment = require("moment");
                      require("moment-duration-format");
                      
                       setInterval(() => {
                      const calismasure = moment.duration(client.uptime).format(" D [gün], H [saat], m [dakika], s [saniye]");
                      let botdurum = client.channels.find(c => c.id === '584720628247166976')//Botun sürekli mesaj atacağı kanal.
                      const botistatistik = new Discord.RichEmbed()
                          .setColor('ORANGE')
                      .setAuthor(`${client.user.username}`, client.user.avatarURL)
                          .setTitle('Anlık Bot İstatistikleri')
                      .addField(':clipboard: Sunucular:', client.guilds.size,true)
                      .addField(':busts_in_silhouette: Kullanıcılar:', client.guilds.reduce((a, b) => a + b.memberCount, 0),true)
                      .addField(':timer: Gecikme: ', client.ping + 'ms',true)
                      .setTimestamp()
                      .setFooter('Her 60 Dakikada Bir Gönderilir.', 'https://cdn3.iconfinder.com/data/icons/seo-concept-modern/512/Timer_services_flat_icon_seo_pack_web-512.png');
                      botdurum.send(botistatistik);
                             }, 3600000);});


client.login(loglar.token);