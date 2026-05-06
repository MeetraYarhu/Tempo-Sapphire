const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const fs = require('fs');
const path = require('path');
const { AttachmentBuilder, MessageFlags  } = require('discord.js');
const melonCount = require('../util/melonCount.json');
const filePath = path.join(__dirname, '../util/melonCount.json');
const imageDir = path.join(__dirname, '../../images/melonpics');

class MelonCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'melon',
			description: 'Posts a melon picture.',
			runIn: CommandOptionsRunTypeEnum.GuildAny,
		});
	}

	async messageRun(message) {
		const files = fs.readdirSync(imageDir);

		const chosenFile = files[Math.floor(Math.random() * files.length)];

        const imagePath = path.join(imageDir, chosenFile);
        const stats = fs.statSync(imagePath);


		// console.log(`image path: ${imagePath}`);
        // console.log(`image size MB: ${(stats.size / 1024 / 1024).toFixed(2)}`);
       
		const attachment = new AttachmentBuilder(imagePath, { name: chosenFile });


		// Passed in message as text
		const name = chosenFile.slice(0, -4);
		// console.log(`image name: ${name}`);

		// find user
		const countUser = melonCount.find((list) => list.id === message.author.id);

		// if user exists, increment, if not, create
		if (countUser) {
			countUser.count++;
			if (!countUser.names.includes(message.author.username)) {
				countUser.names.push(message.author.username);
			}
		} else {
			melonCount.push({ 
				id: message.author.id, 
				names: [message.author.username], 
				count: 1 });
		} 


		const stringy = JSON.stringify(melonCount, null, 2);
		fs.writeFileSync(filePath, stringy);

		message.channel.send({
			content: name,
			files: [attachment],
		});

	}
}

module.exports = {
	MelonCommand,
};