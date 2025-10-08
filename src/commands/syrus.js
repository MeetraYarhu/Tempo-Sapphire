const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const { AttachmentBuilder } = require('discord.js');

class SyrusCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'syrus',
			description: 'yeehaw',
			runIn: CommandOptionsRunTypeEnum.GuildAny,
		});
	}

	messageRun(message) {
		const attachment = new AttachmentBuilder('audio/omae_wa_mou_shindeiru.mp3', { name: 'omae_wa_mou_shindeiru.mp3' });

		message.channel.send({
			content: 'お前はもう死んでいる。<:yeehaw:819921660375334912>',
			files: [attachment],
		});

	}
}

module.exports = {
	SyrusCommand,
};