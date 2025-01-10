const { Listener } = require('@sapphire/framework');
// const idvariables = require('../util/idVariables.json');
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

				// Coeurl GuildId = 481478007932846100
				const guildId = '481478007932846100';

				//  Returns members' roles by id and name
				// const roles = await getMemberRoles(guildId, targetId);

				// Returns name and id of the role added/removed
				const [{ id: roleChangedId }] = event.changes[0].new;
				const rolesToRemove = [
					{ id: '827108756893990932', name: 'train' },
					{ id: '864557267265257503', name: 'reporter' },
					{ id: '823367370780966983', name: 'purple' },
					{ id: '823368359725760552', name: 'white' },
					{ id: '823368119812096021', name: 'green' },
					{ id: '823366921453305876', name: 'orange' },
					{ id: '823365226467950643', name: 'pink' },
				];
				const Nitro = '589366331074150405';

				if ((event.action === 25) && (key === '$remove') && (roleChangedId === Nitro)) {
					console.log(`${event.target.username}'s Nitro boost has expired.`);
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