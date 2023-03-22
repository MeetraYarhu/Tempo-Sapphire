const { Command } = require('@sapphire/framework');
const fs = require('fs');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');

class MelonCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'melon',
			description: 'Posts a melon picture.',
		});
	}

	messageRun(message) {
		const files = fs.readdirSync('images/melonpics');

		const chosenFile = files[Math.floor(Math.random() * files.length)];

		const image = fs.readFileSync(path.join('images/melonpics', chosenFile));

		const name = chosenFile.slice(0, -4);

		const attachment = new AttachmentBuilder(image, { name: chosenFile });

		message.channel.send({
			content: name,
			files: [attachment],
		});

	}
}

module.exports = {
	MelonCommand,
};