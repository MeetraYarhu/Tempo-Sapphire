const { Listener } = require('@sapphire/framework');

class ReportsListener extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'reports',
			once: true,
			requiredClientPermissions: ['ReadMessageHistory', 'ManageMessages'],
			event: 'report',
		});
	}

	run(message) {

	}

}

module.exports = {
	ReportsListener,
};