const { Command } = require('@sapphire/framework');
const responses = require('../util/8ballresponses.json');

class RandomBallCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: '8ball',
			aliases: ['8ball'],
			description: '8ball responses',
		});
	}

	messageRun(message) {
		const responseArray = responses.responses;
		const selection = responseArray[Math.floor(Math.random() * responseArray.length)];
		message.reply(selection);
	}

}

module.exports = {
	RandomBallCommand,
};