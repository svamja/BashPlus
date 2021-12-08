const env = require('../.env.json');
const homedir = require('os').homedir();
const shell = require('shelljs');

const Local = {

    async runCommands(commands, options) {

        if(options.silent === undefined) {
            options.silent = true;
        }

        console.log('running commands on local');
        console.log(' > ' + commands.join("\n > "));

        for(let command of commands) {
            let result = await shell.exec(command, options);
            let { stdout, stderr, code } = result;
            if(code) {
                return { status: 'error', command, code, stdout, stderr };
            }
        }
        return { status: 'success' };

    },

}

module.exports = Local;
