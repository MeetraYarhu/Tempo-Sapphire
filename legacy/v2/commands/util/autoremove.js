const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const roleColors = require('@util/rolecolors.json');
module.exports = class autoRemoveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'autoremove',
            group: 'util',
            memberName: 'autoremove',
            guildOnly: true,
        });
    }
    run(message) {

        const nitroBoost = '589366331074150405'

        const boosters = this.client.guilds.cache.roles.get(nitroBoost).members.map(m => m.user.id);

        const coloredUsers = [];
        for (let i = 0; i < roleColors.colors.length; i++) {
            coloredUsers.push(this.client.guilds.cache.roles.get(roleColors.colors[i].roleid).members.map(m => m.user.id))
        }

        for (let i = 0; i < coloredUsers.length; i++) {
            if (!coloredUsers[i].roles.cache.some(role => role.id === nitroBoost)) {
                for (let r = 0; r < roleColors.colors.length; r++) {
                    coloredUsers[i].roles.remove(roleColors.colors[r].roleid)
            }}
        }
    }
}