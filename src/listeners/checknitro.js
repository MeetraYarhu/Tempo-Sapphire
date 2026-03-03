const { Listener } = require('@sapphire/framework');
const idvariables = require('../util/idVariables.json');

const getMemberRoles = require('../util/getMemberRoles.js');
const removeSpecificRoles = require('../util/removeSpecificRoles.js');

// Define each guild as it's own object
// const idvars = (idvariables.coeurl);
const idvars = (idvariables.tempotesting);

class NitroListener extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			once: false,
			requiredClientPermissions: ['ViewAuditLog', 'ManageRoles'],
			event: 'guildMemberUpdate',
		});
	}

	async run(oldMember, newMember) {
		try {
			// check first and exit
			const boosterRoleId = idvars?.roles?.nitro;
			if (!boosterRoleId) return;

  			// Fastest possible early exit for 99%+ events
 			const oldHadBooster = oldMember.roles.cache.has(boosterRoleId);
 			const newHasBooster = newMember.roles.cache.has(boosterRoleId);
  			if (!(oldHadBooster && !newHasBooster)) return;


			const guildId = idvars?.guild?.id;
  			const nitroColorsObj = idvars?.nitrocolors;
 			if (!guildId || !nitroColorsObj) return;

			const userId = newMember.id;
			if (!userId) return;

			const nitroColorRoleIds = new Set(Object.values(nitroColorsObj));

			const rolesToRemove = [];

			for (const role of newMember.roles.cache.values()) {
				if (nitroColorRoleIds.has(role.id)) {
					rolesToRemove.push({ id: role.id, name: role.name});
				}
			}

			for (const roleObj of rolesToRemove) {
				try {
					await removeSpecificRoles(guildId, userId, [roleObj]);
				} catch (error) {
					console.error('removeSpecificRoles failed:', { roleId: roleObj.id, error });
				}
			}
		} catch (error) {
			console.error('checknitro.js Error:', error);
		}
	} 

}
module.exports = {
	NitroListener,
};