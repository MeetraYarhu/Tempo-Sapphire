const client = require('@root/src/index.js');
const MODULE = require('path').basename(__filename);
const getCallerModule = require('@util/getCallerModule.js');

async function removeSpecificRoles(guildId, memberId, rolesToRemove) {
	const callerModule = getCallerModule();

	if (!Array.isArray(rolesToRemove)) throw new Error('rolesToRemove must be an array');

	try {
		const guild = await client.guilds.fetch(guildId);
		const member = await guild.members.fetch(memberId);
		const memberName = member.user.tag;

		for (const roleId of rolesToRemove) {
			if (typeof roleId !== 'string' || !roleId) {
				console.log(`[${MODULE} -> ${callerModule}] Invalid role ID - ${roleId}`);
				continue;
			}

			const role = guild.roles.cache.get(roleId) ??
			await guild.roles.fetch(roleId).catch(() => null);

			if (!role) {
				console.log(`[${MODULE} -> ${callerModule}]: Role not found - ID: ${roleId}`);
				continue;
			}

			const roleName = role.name;

			if (!member.roles.cache.has(roleId)) {
				console.log(`[${MODULE} -> ${callerModule}]: Member does not have role - ${roleName} (ID: ${roleId})`);
				continue;
			}

			await member.roles.remove(roleId);
			console.log(`[${MODULE} -> ${callerModule}]: Removed role ${roleName} (ID: ${roleId}) from member ${memberName} (ID: ${memberId})`);
		}
	}	catch (error) {
		console.error(`[${MODULE} -> ${callerModule}]: Error managing member roles:`, error);
	}
}
// example usage: 
// await removeSpecificRoles(guildId, userId, [roleId1, roleId2]);
module.exports = removeSpecificRoles;