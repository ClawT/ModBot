const commando = require('discord.js-commando');
const discord = require('discord.js');
const sqlite = require('sqlite');

class banCommand extends commando.Command {
    constructor(client) {
            super(client, {
                name: "ban",
                group: "moderation",
                memberName: "ban",
                description: "bans the first mentioned user",
                throttling: {
				        usages: 2,
				        duration: 5
			},
            });
    }

    async run(message, args) {

        sqlite.open(`./modlogs/${message.guild.id}.sqlite`)

  let warn1 = message.content.split(' ').slice(2);
  var warn2 = warn1.join(' ');

  if (message.guild == null) {
          return message.reply("this command can not be used in a PM").catch(console.error);
  }
  if (!message.guild.member(message.author).hasPermission('BAN_MEMBERS')) {
    return message.reply('you do not have permission to use this command').catch(console.error);
  }
  if (message.mentions.users.size === 0) {
          return message.reply("Please Mention a user").catch(console.error);
  }
  var banMember = message.guild.member(message.mentions.users.last());
  if (!banMember) {
          return message.reply("please tag a valid user").catch(console.error);
  }
  if (!banMember.bannable) {
        return message.reply(`**${banMember.user.tag}** is not Bannable!`)
  }
  if (!message.guild.member(this.client.user).hasPermission("BAN_MEMBERS")) {
          return message.reply("I do not have the permissions to ban a user, please enable that in my role under the role settings of this discord").catch(console.error);
  }
  if (!warn2) {
    var warn2 = "no Reason"
}
  banMember.send(`You have been Banned from: **${message.guild.name}**\nReason: ${warn2}`).then(message =>   banMember.ban())


  sqlite.get(`SELECT * FROM logs WHERE userId ='${banMember.id}'`).then(row => {
    if (!row) {
      sqlite.run('INSERT INTO logs (userId, kicks, warns, bans) VALUES (?, ?, ?, ?)', [banMember.id, 0, 0, 1]);
    } else {
      sqlite.run(`UPDATE logs SET bans = ${row.bans + 1} WHERE userId = ${banMember.id}`);
    }
  }).catch(() => {
    console.error;
    sqlite.run(`CREATE TABLE IF NOT EXISTS logs (userId TEXT, kicks INTEGER, warns INTEGER, bans INTEGER)`).then(() => {
      sqlite.run(`INSERT INTO logs (userId, kicks, warns, bans) VALUES (?, ?, ?, ?)`, [banMember.id, 0, 0, 1]);
    });
  });


        const klogs = new discord.RichEmbed()
  		.setTitle('Mod Log')
  		.setColor(0xF4D03F)
  		.setDescription('Kick Command Used')
  		.addField('Staff', `${message.author.username}#${message.author.discriminator}`, true)
  		.addField('Time', `${message.createdAt}`, true)
        .addField('User Kicked', `${banMember.user.username} **||** ${banMember.id}`, true)
        .addField('Reason', `${warn2}`)  



    if (!message.guild.channels.find(channel => channel.name === 'mod-logs')) {
    return;
  } else
{
  message.guild.channels.find(channel => channel.name === 'mod-logs').send("", 
  {
      embed: klogs
  }).catch(console.error);
}
        };
    };

module.exports = banCommand;