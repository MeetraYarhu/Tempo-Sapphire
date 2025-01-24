const { Listener } = require('@sapphire/framework');
const idvariables = require('../util/idVariables.json');

// const getMemberRoles = require('../util/getMemberRoles.js');
const removeSpecificRoles = require('../util/removeSpecificRoles.js');

class NitroListener extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			once: false,
			requiredClientPermissions: ['ViewAuditLog', 'ManageRoles'],
			event: 'guildAuditLogEntryCreate',
		});
	}

	async run(event) {

		try {

			if (Array.isArray(event.changes) && event.changes.length > 0) {

				// Returns $add or $remove
				const [{ key }] = event.changes;

				// ID of user being changed
				const targetId = event.target.id;

				// Define each guild as it's own object
				// const idvars = await (idvariables.coeurl);
				const idvars = await (idvariables.tempotesting);

				const guildId = await idvars.guild.id;

				//  Returns members' roles by id and name
				// const roles = await getMemberRoles(guildId, targetId);

				// Returns name and id of the role added/removed
				const [{ id: roleChangedId }] = event.changes[0].new;

				// Automatically generate rolesToRemove using the labels and IDs
				const rolesToRemove = Object.keys(idvars.roles)

				// Filter keys that start with "nitro", and excludes the nitro role itself
					.filter((keyrole) => keyrole.startsWith('nitro') && keyrole !== 'nitro')
					.map((keyrole) => ({
						id: idvars.roles[keyrole],
						// Remove "nitro" from the key to get the color
						name: keyrole.replace('nitro', ''),
					}));
				const Nitro = idvars.roles.nitro;

				if ((event.action === 25) && (key === '$remove') && (roleChangedId === Nitro)) {
					console.log(`Checknitro.js: ${event.target.username}'s Nitro boost has expired.`);
					await removeSpecificRoles(guildId, targetId, rolesToRemove);
				}
				else {
					// do nothing
				}
			}
			else {
				// do nothing
			}


		}
		catch (error) {
			console.error('checknitro.js Error:', error);
		}
	}

}
module.exports = {
	NitroListener,
};