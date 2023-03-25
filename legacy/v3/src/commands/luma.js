const { Command } = require('@sapphire/framework');
const { AttachmentBuilder } = require('discord.js');

class LumaCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'luma',
			description: 'bugnod',
		});
	}

	messageRun(message) {
		const attachment = new AttachmentBuilder('images/lumabug.gif', { name: 'lumabug.gif' });

		message.channel.send({
			content: 'Lumabug',
			files: [attachment],
		});

	}
}

module.exports = {
	LumaCommand,
};