const { Precondition } = require('@sapphire/framework');
const config = require('@config');

class OwnerOnlyPrecondition extends Precondition {

	async messageRun(message) {
		// for Message Commands
		return this.checkOwner(message.author.id);
	}

	async chatInputRun(interaction) {
		// for Slash Commands
		return this.checkOwner(interaction.user.id);
	}

	async contextMenuRun(interaction) {
		// for Context Menu Commands
		return this.checkOwner(interaction.user.id);
	}

	// Ternary function. If config.ownerid === userId, uses '?' otherwise ':'.
	async checkOwner(userId) {
		return config.ownerid === userId
			? this.ok()
			: this.error({ message: 'Command restricted to bot owner only!' });
	}
}

module.exports = {
	OwnerOnlyPrecondition,
};