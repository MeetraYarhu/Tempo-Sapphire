const {
    Command
} = require('discord.js-commando');

module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meow',
			aliases: ['nyaa', 'nya', 'nya~', 'akemi'],
			group: 'misc',
			memberName: 'meow',
			description: 'Tells you who is a bad cat.',
            guildOnly: true,
		});
	}

    run(message) {
    message.say('Akemi is a bad cat.');
	message.say(':spraygun: :akemisquint:')
    }
};