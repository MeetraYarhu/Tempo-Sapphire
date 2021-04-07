const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const owoSRanks = require('@util/owosrank.json');
module.exports = class srankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'srank',
            aliases: ['swank', 'owosrank'],
            group: 'misc',
            memberName: 'srank',
            description: 'Owofied S-rank',
            guildOnly: true,
        });
    }

    run(message) {

        const chosenRank = owoSRanks.sranks[Math.floor(Math.random() * owoSRanks.sranks.length)].owoname;

        message.say(chosenRank);
    }
}