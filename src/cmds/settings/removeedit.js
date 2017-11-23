const commando = require('discord.js-commando');
const sql = require('sqlite');


module.exports = class removeedit extends commando.Command {
	constructor(client) {
		super(client, {
            name: 'removeedit',
            aliases: ["re"],
			group: 'settings',
			memberName: 'removeedit',
            description: 'removes the edited messages channel',
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

     
        sql.get(`SELECT * FROM channels WHERE guildid ='${msg.guild.id}'`).then(row => {
            if (!row) {
              sql.run('INSERT INTO channels (guildid, editid, deleteid) VALUES (?, ?, ?)', [msg.guild.id, null, null]);
            } else {
              sql.run(`UPDATE channels SET editid = ${null} WHERE guildid = ${msg.guild.id}`);
            }
          }).catch(() => {
            console.error;
            sql.run('CREATE TABLE IF NOT EXISTS channels (guildid TEXT, editid TEXT, deleteid TEXT)').then(() => {
              sql.run('INSERT INTO channels (guildid, logsid, editid, deleteid)) VALUES (?, ?, ?)', [msg.guild.id, null, null]);
            });
          });

          msg.say(`you have removed the edited messages channel, edited messages now disabled`)
	}
};