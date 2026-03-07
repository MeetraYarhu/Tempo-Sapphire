const pino = require('pino');
const path = require('path');

const base = pino({
	level: process.env.LOG_LEVEL || 'debug',
	transport: process.env.NODE_ENV !== 'production'
		? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
		: undefined
});

function getLogger(file) {
	return base.child({ module: path.basename(file) });
}

module.exports = { getLogger };