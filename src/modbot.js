const commando = require('discord.js-commando')
const discord = require('discord.js');
const sql = require('sqlite');
const path = require('path');

//gets your token
const { token } = require('./config')

//sets the client and client properties
const client = new commando.Client({
    owner: ['135605110976806914'],
    invite: 'https://discord.gg/mTq4mue',
    unknownCommandResponse: false
});

//sets the default database
client.setProvider(
    sql.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

//registers command groups
client.registry
.registerGroups([
    ['moderation', 'Moderation: `Moderation Commands`'],
    ['settings', 'Settings: Guild Settings']
]);

//regsters the default commands and disable the default ping and help command
client.registry.registerDefaultTypes();
client.registry.registerDefaultGroups()
client.registry.registerDefaultCommands({ping: false, help: false})
client.registry.registerCommandsIn(__dirname + "/cmds");


//Informs you when the client is ready
client.on('ready', () => {
    console.log(`Ready at ${new Date()}`)
    });

//Informs you if your bot is reconnecting to the WebSocket
client.on('reconnecting', () => {
    console.log(`Reconnecting at ${new Date()}`)
    });

//Informs you if your bot has disconnected from the WebSocket and will no longer try to reconnect
client.on('disconnect', () => {
    console.log(`Disconnected at ${new Date()}`)
    });


//sets the settings to default on joined guild
client.on('guildCreate', guild => {
    sql.get(`SELECT * FROM channels WHERE guildid ='${guild.id}'`).then(row => {
      if (!row) {
        sql.run('INSERT INTO channels (guildid TEXT, logsid TEXT, editid TEXT, deleteid TEXT) VALUES (?, ?, ?)', [guild.id, null, null]);
      }
    }).catch(() => {
      console.error;
      sql.run('CREATE TABLE IF NOT EXISTS channels (guildid TEXT, editid TEXT, deleteid TEXT)').then(() => {
        sql.run('INSERT INTO channels (guildid, editid, deleteid) VALUES (?, ?, ?)', [guild.id, null, null]);
      });
    });
    console.log(`New Guild: ${guild.name} : ${guild.id}`)
  });

//Edited messages
  client.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.bot) return;
    if (newMessage.channel.type == 'dm') return;
    if (oldMessage.cleanContent == newMessage.cleanContent) return;
    sql.get(`SELECT * FROM channels WHERE guildid ='${newMessage.guild.id}'`).then(row => {
      let chanid = row.editid
      if (chanid == null) return;
      if(!newMessage.guild.channels.get(chanid)) return;
      if(!newMessage.guild.member(client.user.id).permissionsIn(chanid).hasPermission("READ_MESSAGES")) return;
  
    newMessage.guild.channels.get(chanid).send("", {embed: {
      color: 170,
      title: 'Message Edited',
      url: '',
      description: 'I noticed a message was edited, here is the logs',
      fields: [
       {
          name: 'Channel',
          value: `${newMessage.channel}`
        },
        {
          name: 'Author',
          value: `${newMessage.author.username}#${newMessage.author.discriminator}`
        },
        {
          name: 'Author\'s ID',
          value: `${newMessage.author.id}`
        },
        {
          name: 'Original Message',
          value: `${oldMessage.cleanContent}`
        },
        {
          name: 'New Message',
          value: `${newMessage.cleanContent}`
        },
        {
          name: 'Message was posted at',
          value: `${oldMessage.createdAt}`
        }
      ]
    }}).catch(console.error);
  });
  });

//deleted messages
  client.on('messageDelete', message => {
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    sql.get(`SELECT * FROM channels WHERE guildid ='${message.guild.id}'`).then(row => {
      let chanid = row.deleteid
      if (chanid == null) return;
      if(!message.guild.channels.get(chanid)) return;
      if(!message.guild.member(client.user.id).permissionsIn(chanid).hasPermission("READ_MESSAGES")) return;
  
    message.guild.channels.get(chanid).send("", {embed: {
      color: 170,
      title: 'Message Deleted',
      url: '',
      description: 'I noticed a message was deleted, here is the logs',
      fields: [
       {
          name: 'Channel',
          value: `${message.channel}`
        },
        {
          name: 'Author',
          value: `${message.author.username}#${message.author.discriminator}`
        },
        {
          name: 'Author\'s ID',
          value: `${message.author.id}`
        },
        {
          name: 'Message Details',
          value: `${message.cleanContent}`
        },
        {
          name: 'Message was posted at',
          value: `${message.createdAt}`
        }
      ]
    }}).catch(console.error);
  });
  });

process.on('unhandledRejection', err => {
	console.error(`Uncaught Promise Error: \n${err.stack}`);
});

//Logs into the bot account
client.login(token)