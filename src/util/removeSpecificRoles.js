const client = require('@root/src/index.js');
const { getLogger } = require('@util/logger.js');
	const log = getLogger(__filename);

async function removeSpecificRoles(guildId, memberId, roleToRemove) {

// 3/29/26 - i updated the add roles helper to no longer accept an array. might be worth updating this one as well
// something about patch TOC TOU conditions
// faloop.js and checknitro.js are both using this, so will need to refactor those to not use arrays either
	const guild = await client.guilds.fetch(guildId);
	const member = await guild.members.fetch(memberId);

	log.debug({
		targetUsername: member.user.username, 
		targetId: memberId, 
		roleToRemove
	}, 'removeSpecificRoles started');

	const roleId = roleToRemove;

		if (typeof roleId !== 'string' || !roleId) {
		log.warn({ 
			roleId 
		}, 'Invalid role ID');
		return;
	}

		const role = guild.roles.cache.get(roleId) ??
		await guild.roles.fetch(roleId).catch(() => null);

		const roleName = role?.name ?? 'Unknown Role';

		if (!role) {
			log.warn({ 
				roleId,
				roleName
			}, 'Role not found');
			return;
		}


		if (!member.roles.cache.has(roleId)) {
			log.debug({ 
				roleName,
				roleId 
			}, 'Member does not have role');
			return;
		}

		try {
			await member.roles.remove(roleId);
			log.info({
				memberId,
				roleId,
				roleName,
			}, 'Role removed')
		} catch (error) {
			log.error(error, 'Error removing roles');
		}
}
// example usage: 
// await removeSpecificRoles(guildId, userId, roleId);
module.exports = removeSpecificRoles;