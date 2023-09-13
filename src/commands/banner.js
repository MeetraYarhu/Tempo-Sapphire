const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const fs = require('fs');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');

class BannerCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'banner',
			description: 'Posts a banner picture.',
			runIn: CommandOptionsRunTypeEnum.GuildAny,
		});
	}

	messageRun(message) {
		const files = fs.readdirSync('images/banners');

		const chosenFile = files[Math.floor(Math.random() * files.length)];

		const image = fs.readFileSync(path.join('images/banners', chosenFile));

		const attachment = new AttachmentBuilder(image, { name: chosenFile });

		message.channel.send({
			files: [attachment],
		});

	}
}

module.exports = {
	BannerCommand,
};