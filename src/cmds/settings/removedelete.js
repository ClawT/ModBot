const commando = require('discord.js-commando');
const sql = require('sqlite');


module.exports = class removedelete extends commando.Command {
	constructor(client) {
		super(client, {
            name: 'removedelete',
            aliases: ["rd"],
			group: 'settings',
			memberName: 'removedelete',
            description: 'removes the deleted messages channel',
            guildOnly: true,
			throttling: {
				usages: 1,
				duration: 60
			}
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author) || msg.member.hasPermission("ADMINISTRATOR");
	}

	async run(msg, args) {

		const channel = args.channel;

        sql.get(`SELECT * FROM channels WHERE guildid ='${msg.guild.id}'`).then(row => {
            if (!row) {
              sql.run('INSERT INTO channels (guildid, editid, deleteid) VALUES (?, ?, ?)', [msg.guild.id, null, null]);
            } else {
              sql.run(`UPDATE channels SET deleteid = ${null} WHERE guildid = ${msg.guild.id}`);
            }
          }).catch(() => {
            console.error;
            sql.run('CREATE TABLE IF NOT EXISTS channels (guildid TEXT, editid TEXT, deleteid TEXT)').then(() => {
              sql.run('INSERT INTO channels (guildid, logsid, editid, deleteid)) VALUES (?, ?, ?)', [msg.guild.id, null, null]);
            });
          });

          msg.say(`you have removed the deleted messages channel, deleted messages now disabled`)
	}
};