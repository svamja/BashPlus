const env = require('../.env.json');
const moment = require('moment');
const path = require('path');
const { program } = require('commander');

const Remote = require('./Remote');
const Local = require('./Local');
const MongoUtils = require('./MongoUtils');
const GitUtils = require('./GitUtils');

const Commands = {

    async runCommand(commandName) {

        const commandMap = {
            cpfrom: {
                moduleObject: Remote,
                items: [
                    [ 'argument', '<serverName>', 'server name' ],
                    [ 'argument', '<files...>', 'file names' ],
                ]
            },
            cpto: {
                moduleObject: Remote,
                items: [
                    [ 'argument', '<serverName>', 'server name' ],
                    [ 'argument', '<files...>', 'file names' ],
                ]
            },
            getcolls: {
                moduleObject: MongoUtils,
                items: [
                    [ 'argument', '<collections...>', 'collection names' ],
                    [ 'option', '--server <serverName>', 'server name' ],
                    [ 'option', '--db <databaseName>', 'database name' ],
                ]
            },
            putcolls: {
                moduleObject: MongoUtils,
                items: [
                    [ 'argument', '<collections...>', 'collection names' ],
                    [ 'option', '--server <serverName>', 'server name' ],
                    [ 'option', '--db <databaseName>', 'database name' ],
                ]
            },
            gitcopy: {
                moduleObject: GitUtils
            },
        };

        if(!commandMap[commandName]) {
            console.log('error: command map not found!');
            return;
        }

        let items = commandMap[commandName].items;
        let args, options;
        if(items && items.length) {
            for(let item of items) {
                let action = item.shift();
                program[action](item[0], item[1]);
            }
            program.showHelpAfterError();
            program.parse();
            options = program.opts();
            args = program.args;
        }
        let moduleObject = commandMap[commandName].moduleObject || this;
        return await moduleObject[commandName](args, options);

    },

}

module.exports = Commands;
