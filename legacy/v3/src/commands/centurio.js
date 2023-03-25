const { Command } = require('@sapphire/framework');
const fs = require('fs');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');

class CenturioCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'centurio',
			aliases: ['clout', 'prae', 'yeri', 'chunts', 'useless'],
			description: 'Centurio Memes.',
		});
	}

	messageRun(message) {
		const files = fs.readdirSync('images/centuriopics');

		const chosenFile = files[Math.floor(Math.random() * files.length)];

		const image = fs.readFileSync(path.join('images/centuriopics', chosenFile));

		const attachment = new AttachmentBuilder(image, { name: chosenFile });

		message.channel.send({
			files: [attachment],
		});

	}
}

module.exports = {
	CenturioCommand,
};