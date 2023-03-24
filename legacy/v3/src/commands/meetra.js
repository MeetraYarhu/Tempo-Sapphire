const { Command } = require('@sapphire/framework');
const fs = require('fs');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');

class MeetraCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'meetra',
			description: 'Posts a Meetra meme.',
		});
	}

	messageRun(message) {
		const files = fs.readdirSync('images/meetrapics');

		const chosenFile = files[Math.floor(Math.random() * files.length)];

		const image = fs.readFileSync(path.join('images/meetrapics', chosenFile));

		const name = chosenFile.slice(0, -4);

		const attachment = new AttachmentBuilder(image, { name: chosenFile });

		message.channel.send({
			content: name,
			files: [attachment],
		});

	}
}

module.exports = {
	MeetraCommand,
};