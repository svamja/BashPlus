const env = require('../.env.json');
const { NodeSSH } = require('node-ssh');
const homedir = require('os').homedir();

const Remote = {

    async runCommands(serverName, commands, options) {

        let server = env.servers[serverName];

        console.log('running commands on', serverName);
        console.log(' > ' + commands.join("\n > "));

        const ssh = new NodeSSH();

        const host = server.ipaddr;
        const username = server.username || env.defaults.username;
        const privateKey = homedir + '/.ssh/id_rsa';

        await ssh.connect({ host, username, privateKey });
        for(let command of commands) {
            let result = await ssh.execCommand(command, options);
            let { stdout, stderr, code } = result;
            if(code) {
                return { status: 'error', command, code, stdout, stderr };
            }
        }
        ssh.dispose();
        return { status: "success" }

    },

    async downloadFile(serverName, remotePath, localPath) {

        let server = env.servers[serverName];

        console.log('downloading file', remotePath, localPath);

        const ssh = new NodeSSH();

        const host = server.ipaddr;
        const username = server.username || env.defaults.username;
        const privateKey = homedir + '/.ssh/id_rsa';

        await ssh.connect({ host, username, privateKey });

        try {
            await ssh.getFile(localPath, remotePath);
        }
        catch(exception) {
            return { status: 'error', exception };
        }
        ssh.dispose();
        return { status: "success" }

    },

}

module.exports = Remote;
