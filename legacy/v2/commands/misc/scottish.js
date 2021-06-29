const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
module.exports = class ScottishCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'scottish',
			aliases: ['karen', 'kkaren', 'kkiba', 'kiba', 'rent-free'],
			group: 'misc',
			memberName: 'scottish',
			description: 'A scottish person doing scottish things.',
            guildOnly: true,
		});
	}

    run(message) {
	const attachment = new MessageAttachment('audio/scottish.mp3')
    message.say('Definitely Scottish.', attachment);
    }
};