const { Command } = require('@sapphire/framework');
const responses = require('../util/8ballresponses.json');

class RandomBallCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: '8ball',
			aliases: ['pr8ball'],
			description: '8ball responses',
		});
	}

	messageRun(message) {
		const responseArray = responses.responses;
		const selection = responseArray[Math.floor(Math.random() * responseArray.length)];

		message.reply(selection.charAt(0).toUpperCase() + selection.slice(1));
	}

}

module.exports = {
	RandomBallCommand,
};