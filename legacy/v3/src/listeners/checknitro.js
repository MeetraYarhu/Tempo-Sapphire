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
				// const idvars = (idvariables.coeurl);
				const idvars = (idvariables.tempotesting);

				// Coeurl GuildId = 481478007932846100
				// Testing GuildID = 948851726591614986
				const guildId = idvars.guild.id;

				//  Returns members' roles by id and name
				// const roles = await getMemberRoles(guildId, targetId);

				// Returns name and id of the role added/removed
				const [{ id: roleChangedId }] = event.changes[0].new;
				// Coeurl Roles:
				const rolesToRemove = [
					{ id: '823367370780966983', name: 'purple' },
					{ id: '823368359725760552', name: 'white' },
					{ id: '823368119812096021', name: 'green' },
					{ id: '823366921453305876', name: 'orange' },
					{ id: '823365226467950643', name: 'pink' },
				];
				const Nitro = '589366331074150405';

				// Testing Server Roles:
				/* const rolesToRemove = [
					{ id: '1091974696540569641', name: 'purple' },
					{ id: '1091974727721029673', name: 'white' },
					{ id: '1091974745689428019', name: 'green' },
					{ id: '1091974758259752980', name: 'orange' },
					{ id: '1091974772738502746', name: 'pink' },
				];
				const Nitro = '1250572918081982464'; */


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