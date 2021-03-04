const Discord = require('discord.js');
const fs = require('fs');
const mongo = require('./mongo');
const {
    prefix,
    token,
} = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity('Ok\'Zundu');
});
// testing mongo functionality
const connectToMongoDB = async () => {
    await mongo().then(mongoose => {
        try {
            console.log('Connected to MongoDB')
        } finally {
            mongoose.connection.close()
        }
    })
}

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Check for aliases //
    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    // Check for guild or DM's //
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    // Check for member permissions //
    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.client.user);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply('Permissions insufficient.');
        }
    }
    // Check if author has the role listed //
    if (command.roles) {
        const member = message.guild.member(message.author);
        const authorRolePerms = member.roles.cache.has(command.roles);
        if (authorRolePerms == false) {
            return message.reply('Bug meetra for roles or something');
        }
    }
    if (command.channel) {
        if (message.channel.id !== (command.channel)) {
            return message.reply('You can\'t use that command in this channel!');
        }
    }
    // Check for arguments if a command has args = true //
    if (command.args && !args.length) {
        let errorReply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            errorReply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(errorReply);
    }
    try {
        command.execute(message, args);
    }
    catch (error) {
        // Do nothing
    }

});

client.login(token);