const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meow',
			aliases: ['nyaa', 'nya', 'nya~', 'akemi', 'dumb'],
			group: 'misc',
			memberName: 'meow',
			description: 'Tells you who is a bad cat.',
            guildOnly: true,
		});
	}

    run(message) {
	const attachment = new MessageAttachment('images/spray.png')
    message.say('Akemi is a bad cat.', attachment);
    }
};