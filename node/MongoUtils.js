const env = require('../.env.json');
const moment = require('moment');
const path = require('path');

const Remote = require('./Remote');
const Local = require('./Local');

const MongoUtils = {

    async getcolls(collNames, options) {

        let serverName = options.serverName || env.defaults.server;
        let databaseName = options.databaseName || env.defaults.database;
        let server = env.servers[serverName];

        let result = await this.exportCollsRemote(serverName, databaseName, collNames);
        if(result.status != 'success') {
            return result;
        }

        result = await this.downloadExport(serverName, result.exportPath);
        if(result.status != 'success') {
            return result;
        }

        result = await this.restoreCollections(result.localPath);
        if(result.status != 'success') {
            return result;
        }

    },

    async exportCollsRemote(serverName, databaseName, collNames) {
        let server = env.servers[serverName];
        let commands = [];
        let options = {};

        let exportPath;

        // Export File Name
        const datetime = moment().format('YYYY-MM-DD-HHmm');
        let fileName = `mongodb-export-${datetime}.tgz`;

        // cd to tmp directory
        if(env.defaults.tmpdir || server.tmpdir) {
            let tmpdir = env.defaults.tmpdir || server.tmpdir;
            options.cwd = tmpdir;
            exportPath = tmpdir + '/' + fileName;
        }
        else {
            exportPath = fileName;
        }

        // delete existing dump directory
        commands.push('rm -rf dump');

        // export mongodb collections
        for(let collName of collNames) {
            commands.push(`mongodump --db ${databaseName}  --collection ${collName}`);
        }

        // Tar zip file
        commands.push(`tar czf ${fileName} dump`);

        // Run Commands on Remote
        let result = await Remote.runCommands(serverName, commands, options);
        // let result = { status: 'success' };
        result.exportPath = exportPath;
        return result;

    },

    async downloadExport(serverName, exportPath) {
        let fileName = path.basename(exportPath);
        let localPath;
        if(env.local.tmpdir || env.defaults.tmpdir) {
            let tmpdir = env.local.tmpdir || env.defaults.tmpdir;
            localPath = tmpdir + '/' + fileName;
        }
        else {
            localPath = fileName;
        }
        let result = await Remote.downloadFile(serverName, exportPath, localPath);
        result.localPath = localPath;
        return result;
    },

    async restoreCollections(localPath) {
        let localDir = path.dirname(localPath);
        let fileName = path.basename(localPath);
        let commands = [];

        // Extract export file
        commands.push(`tar xf ${fileName}`);

        // Restore exrpot
        commands.push('mongorestore --drop');

        let result = await Local.runCommands(commands, { cwd: localDir });
        return result;
    },


}

module.exports = MongoUtils;


