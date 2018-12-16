const logger = require('debug');
const debug = logger('joybox:debug');
debug.log = console.log.bind(console);
const error = logger('joybox:error');

module.exports = {
    debug,
    error,
};
