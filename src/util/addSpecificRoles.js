const client = require('@root/src/index.js');
const MODULE = require('path').basename(__filename);
const getCallerModule = require('@util/getCallerModule.js');

async function addSpecificRoles(guildId, memberId, rolesToAdd) {
	const callerModule = getCallerModule()

	if (!Array.isArray(rolesToAdd)) throw new Error('rolesToAdd must be an array');

	const results = { added: [], alreadyHad: [], failed: [] };

	const guild = await client.guilds.fetch(guildId);
	const member = await guild.members.fetch(memberId);

	const toAdd = [];

	for (const roleId of rolesToAdd) {
		if (typeof roleId !== 'string' || !roleId) {
			results.failed.push({ roleId, reason: 'Invalid role ID' });
			continue;
		}

		const role = guild.roles.cache.get(roleId) ??
		await guild.roles.fetch(roleId).catch(() => null); 

		const roleName = role?.name ?? 'Unknown Role';

		if (!role) {
			results.failed.push({ roleId, roleName, reason: 'Role not found' }); 
			console.log(`[${MODULE} -> ${callerModule}] Role not found - ID: ${roleId}`);
			continue;
		}

		if (member.roles.cache.has(roleId)) {
			results.alreadyHad.push({ roleId, roleName });
			console.log(`[${MODULE} -> ${callerModule}]: Member already has role - ${roleName} (ID: ${roleId})`);
			continue;
		}

		toAdd.push(roleId);
		results.added.push({ roleId, roleName });
	}

	if (toAdd.length) {
		await member.roles.add(toAdd);
		for (const r of results.added) {
			console.log(`[${MODULE} -> ${callerModule}]: Added role ${r.roleName} (ID: ${r.roleId}) to member ${member.user.tag} (ID: ${memberId})`);
		}
	}
return results;

}
// example usage: 
// await addSpecificRoles(guildId, userId, [roleId1, roleId2]);
module.exports = addSpecificRoles;