const commando = require('discord.js-commando');
const discord = require('discord.js');

const sqlite = require('sqlite');

class warnCommand extends commando.Command {
    constructor(client) {
            super(client, {
                name: "warn",
                group: "moderation",
                memberName: "warn",
                description: "warns the first mentioned user",
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
  if (!message.guild.member(message.author).hasPermission('KICK_MEMBERS')) {
    return message.reply('you do not have permission to use this command').catch(console.error);
  }
  if (message.mentions.users.size === 0) {
          return message.reply("Please Mention a user").catch(console.error);
  }
  var warnMember = message.guild.member(message.mentions.users.last());
  if (!warnMember) {
          return message.reply("please tag a valid user").catch(console.error);
  }

  if (!warnMember.kickable) {
    return message.reply(`**${banMember.user.tag}** is not Warnable!`)
}
    if (!warn2) {
    return message.channel.send('Please Re-do command with a reason!')
}
 
 message.delete(3000)

  warnMember.send(`Warn Reason: ${warn2}\nplease keep the rules of the \`${message.guild.name}\` server in mind. For further questions regarding your Warn please PM a staff member.`)


  sqlite.get(`SELECT * FROM logs WHERE userId ='${warnMember.id}'`).then(row => {
    if (!row) {
      sqlite.run('INSERT INTO logs (userId, kicks, warns, bans) VALUES (?, ?, ?, ?)', [warnMember.id, 0, 1, 0]);
    } else {
      sqlite.run(`UPDATE logs SET warns = ${row.warns + 1} WHERE userId = ${warnMember.id}`);
    }
  }).catch(() => {
    console.error;
    sqlite.run('CREATE TABLE IF NOT EXISTS logs (userId TEXT, kicks INTEGER, warns INTEGER, bans INTEGER)').then(() => {
      sqlite.run('INSERT INTO logs (userId, kicks, warns, bans) VALUES (?, ?, ?, ?)', [warnMember.id, 0, 1, 0]);
    });
  });


        const klogs = new discord.RichEmbed()
  		.setTitle('Mod Log')
  		.setColor(0xF4D03F)
  		.setDescription('Warn Command Used')
  		.addField('Staff', `${message.author.username}#${message.author.discriminator}`, true)
  		.addField('Time', `${message.createdAt}`, true)
  		.addField('User Warnned', `${warnMember.user.username}`, true)
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

module.exports = warnCommand;