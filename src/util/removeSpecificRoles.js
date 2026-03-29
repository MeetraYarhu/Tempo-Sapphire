const client = require('@root/src/index.js');
const { getLogger } = require('@util/logger.js');
	const log = getLogger(__filename);

async function removeSpecificRoles(guildId, memberId, rolesToRemove) {

// 3/29/26 - i updated the add roles helper to no longer accept an array. might be worth updating this one as well
// something about patch TOC TOU conditions
// faloop.js and checknitro.js are both using this, so will need to refactor those to not use arrays either

	if (!Array.isArray(rolesToRemove)) throw new Error('rolesToRemove must be an array');

	try {
		const guild = await client.guilds.fetch(guildId);
		const member = await guild.members.fetch(memberId);

		log.debug({
			targetUsername: member.user.username, 
			targetId: memberId, 
			rolesToRemove
		}, 'removeSpecificRoles started');

		for (const roleId of rolesToRemove) {
			if (typeof roleId !== 'string' || !roleId) {
				log.warn({ 
					roleId 
				}, 'Invalid role ID');
				continue;
			}

			const role = guild.roles.cache.get(roleId) ??
			await guild.roles.fetch(roleId).catch(() => null);

			if (!role) {
				log.warn({ 
					roleId 
				}, 'Role not found');
				continue;
			}

			const roleName = role.name;

			if (!member.roles.cache.has(roleId)) {
				log.debug({ 
					targetUsername: member.user.username, 
					targetId: memberId, 
					roleName, 
					roleId 
				}, 'Member does not have role');
				continue;
			}

			await member.roles.remove(roleId);
			log.info({ 
				targetUsername: member.user.username, 
				targetId: memberId, 
				roleName, 
				roleId 
			}, 'Role removed');
		}
	}	catch (error) {
			log.error(error, 'Error removing roles');
	}
}
// example usage: 
// await removeSpecificRoles(guildId, userId, [roleId1, roleId2]);
module.exports = removeSpecificRoles;