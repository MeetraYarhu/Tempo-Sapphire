const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
module.exports = class Nyx4headCommand extends Command {
	constructor(client) {
		super(client, {
			name: '4head',
			aliases: ['nyx'],
			group: 'misc',
			memberName: '4head',
			description: 'Is this what the kids do?.',
            guildOnly: true,
		});
	}

    run(message) {
	const attachment = new MessageAttachment('audio/forehead.mp3')
    message.say('<:nyx4head:829219532869599262> *Can I get a 4head in the chat*.', attachment);
    }
};