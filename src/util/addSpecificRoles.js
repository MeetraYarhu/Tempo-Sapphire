const client = require('@root/src/index.js');
const { getLogger } = require('@util/logger.js');
	const log = getLogger(__filename);

async function addSpecificRoles(guildId, memberId, rolesToAdd) {


	if (!Array.isArray(rolesToAdd)) throw new Error('rolesToAdd must be an array');

	const results = { added: [], alreadyHad: [], failed: [] };

	const guild = await client.guilds.fetch(guildId);
	const member = await guild.members.fetch(memberId);

	log.debug({ memberId, rolesToAdd }, 'addSpecificRoles started');

	const toAdd = [];

	for (const roleId of rolesToAdd) {
		if (typeof roleId !== 'string' || !roleId) {
			results.failed.push({ roleId, reason: 'Invalid role ID' });
			log.warn({ roleId }, 'Invalid role ID');
			continue;
		}

		const role = guild.roles.cache.get(roleId) ??
		await guild.roles.fetch(roleId).catch(() => null); 

		const roleName = role?.name ?? 'Unknown Role';

		if (!role) {
			results.failed.push({ roleId, roleName, reason: 'Role not found' }); 
			log.warn({ roleId, roleName }, 'Role not found');
			continue;
		}

		if (member.roles.cache.has(roleId)) {
			results.alreadyHad.push({ roleId, roleName });
			log.debug({ roleId, roleName }, 'Member already has role');
			continue;
		}

		toAdd.push(roleId);
		results.added.push({ roleId, roleName });
	}

	try {
		if (toAdd.length) {
		await member.roles.add(toAdd);
		log.info({ memberId, roleIds: toAdd }, 'Roles added');
	}} catch (error) {
		log.error({ error }, 'Error adding roles to member');
		results.failed.push(...toAdd.map(roleId => ({ roleId, reason: 'Error adding role', error })));
	}
return results;

}
// example usage: 
// await addSpecificRoles(guildId, userId, [roleId1, roleId2]);
module.exports = addSpecificRoles;