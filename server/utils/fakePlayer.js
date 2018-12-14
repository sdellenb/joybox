const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const BasePlayer = require('./basePlayer');

const _playerBinary = 'sleep';
const _playerDefaultOptions = ['3'];
const _playerSeekOption = ''; // eslint-disable-line no-unused-vars

module.exports = class FakePlayer extends BasePlayer {

    constructor() {
        super();
    }

    // eslint-disable-next-line no-unused-vars
    async startPlayback(filepath, startPos = null) {
        const { error, stdout, stderr } = await execFile(_playerBinary, _playerDefaultOptions);
        if (error) {
            console.log(`FakePlayer finished with stderr: ${stderr}`);
            console.log(error);
        }
        else {
            console.log(`FakePlayer finished with stdout: ${stdout}`);
        }
    }

    async stopPlayback() {
        // Nothing to do here. Sleep cannot be interrupted.
    }
};
