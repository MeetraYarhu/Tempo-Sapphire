const client = require('@root/src/index.js');
const { getLogger } = require('@util/logger.js');
	const log = getLogger(__filename);

async function removeSpecificRoles(guildId, memberId, rolesToRemove) {


	if (!Array.isArray(rolesToRemove)) throw new Error('rolesToRemove must be an array');

	try {
		const guild = await client.guilds.fetch(guildId);
		const member = await guild.members.fetch(memberId);

		log.debug({ memberId, rolesToRemove }, 'removeSpecificRoles started');

		for (const roleId of rolesToRemove) {
			if (typeof roleId !== 'string' || !roleId) {
				log.warn({ roleId }, 'Invalid role ID');
				continue;
			}

			const role = guild.roles.cache.get(roleId) ??
			await guild.roles.fetch(roleId).catch(() => null);

			if (!role) {
				log.warn({ roleId }, 'Role not found');
				continue;
			}

			const roleName = role.name;

			if (!member.roles.cache.has(roleId)) {
				log.debug({ roleId, roleName }, 'Member does not have role');
				continue;
			}

			await member.roles.remove(roleId);
			log.info({ roleId, roleName, memberId }, 'Role removed');
		}
	}	catch (error) {
		log.error({ error }, 'Error managing member roles');
	}
}
// example usage: 
// await removeSpecificRoles(guildId, userId, [roleId1, roleId2]);
module.exports = removeSpecificRoles;