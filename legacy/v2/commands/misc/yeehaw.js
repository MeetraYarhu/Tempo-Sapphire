const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
module.exports = class yeehawCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yeehaw',
			aliases: ['yee-haw', 'yee', 'haw', 'howdy', 'syrus'],
			group: 'misc',
			memberName: 'yeehaw',
			description: 'お前はもう死んでいる。',
            guildOnly: true,
		});
	}
    run(message) {
	const attachment = new MessageAttachment('audio/omae_wa_mou_shindeiru.mp3')
    message.say('お前はもう死んでいる。<:yeehaw:819921660375334912>', attachment);
    }
};