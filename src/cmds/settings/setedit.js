const commando = require('discord.js-commando');
const sql = require('sqlite');


module.exports = class setedit extends commando.Command {
	constructor(client) {
		super(client, {
            name: 'setedit',
            aliases: ["se"],
			group: 'settings',
			memberName: 'setedit',
            description: 'sets the edited messages channel',
            guildOnly: true,
			throttling: {
				usages: 1,
				duration: 60
			},

			args: [
				{
					key: 'channel',
					prompt: 'What channel would you like to set as the edited messages channel\n',
					type: 'channel'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author) || msg.member.hasPermission("ADMINISTRATOR");
	}

	async run(msg, args) {

        const channel = args.channel;       

        sql.get(`SELECT * FROM channels WHERE guildid ='${msg.guild.id}'`).then(row => {
            if (!row) {
              sql.run('INSERT INTO channels (guildid, editid, deleteid) VALUES ( ?, ?, ?)', [msg.guild.id, channel.id, null]);
            } else {
              sql.run(`UPDATE channels SET editid = ${channel.id} WHERE guildid = ${msg.guild.id}`);
            }
          }).catch(() => {
            console.error;
            sql.run('CREATE TABLE IF NOT EXISTS channels (guildid TEXT, editid TEXT, deleteid TEXT)').then(() => {
              sql.run('INSERT INTO channels (guildid, editid, deleteid) VALUES (?, ?, ?)', [msg.guild.id, channel.id, null]);
            });
          });

          msg.say(`${channel} is now the edited messages channel`)
	}
};