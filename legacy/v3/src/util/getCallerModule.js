// This function will return the name of a module that it is called in, intended to be used for logging

const path = require('path');

function getCallerModule() {
	const stack = new Error().stack.split('\n');

	// Extract the second stack line, which contains the caller
	const callerLine = stack[3];
	// console.log('Caller Line:', callerLine);

	// Extract file name from the caller line
	const match = callerLine.match(/at .* \((.*):\d+:\d+\)|at (.*):\d+:\d+/);

	if (match && (match[1] || match[2])) {
		const fullPath = match[1] || match[2];
		return path.basename(fullPath);
	}
	return 'unknown';
}

module.exports = getCallerModule;