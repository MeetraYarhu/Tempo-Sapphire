const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const fs = require('fs');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');

class MattCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'matt',
			aliases: ['matthew', 'chaser', 'greene'],
			description: 'Posts a Matt meme.',
			runIn: CommandOptionsRunTypeEnum.GuildAny,
		});
	}

	messageRun(message) {
		const files = fs.readdirSync('images/mattpictures');

		const chosenFile = files[Math.floor(Math.random() * files.length)];

		const image = fs.readFileSync(path.join('images/mattpictures', chosenFile));


		const attachment = new AttachmentBuilder(image, { name: chosenFile });

		message.channel.send({
			files: [attachment],
		});

	}
}

module.exports = {
	MattCommand,
};