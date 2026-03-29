const client = require('@root/src/index.js');
const { getLogger } = require('@util/logger.js');
	const log = getLogger(__filename);

async function addSpecificRoles(guildId, memberId, roleToAdd) {

	const guild = await client.guilds.fetch(guildId);
	const member = await guild.members.fetch(memberId);

	log.debug({
		targetUsername: member.user.username, 
		targetId: memberId, 
		roleToAdd 
	}, 'addSpecificRoles started');

		const roleId = roleToAdd;

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

		if (member.roles.cache.has(roleId)) {
			log.debug({ 
				roleName, 
				roleId 
			}, 'Member already has role');
			return;
		}

		// might want to try adding rolename to this log as well
	try {
		await member.roles.add(roleToAdd);
		log.info({ 
			memberId, 
			roleId,
			roleName,
		}, 'Role added');
	} catch (error) {
			log.error(error, 'Error adding roles');
		}
}
// example usage: 
// await addSpecificRoles(guildId, userId, roleId);
module.exports = addSpecificRoles;