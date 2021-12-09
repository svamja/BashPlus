const env = require('../.env.json');
const { NodeSSH } = require('node-ssh');
const homedir = require('os').homedir();

const Remote = {

    async connect(serverName) {

        let server = env.servers[serverName];
        const ssh = new NodeSSH();

        const host = server.ipaddr;
        const username = server.username || env.defaults.username;
        const privateKey = homedir + '/.ssh/id_rsa';

        await ssh.connect({ host, username, privateKey });

        return ssh;

    },

    async runCommands(serverName, commands, options) {

        console.log('running commands on', serverName);
        console.log(' > ' + commands.join("\n > "));

        const ssh = await this.connect(serverName);

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

        console.log('downloading file', remotePath, localPath);
        const ssh = await this.connect(serverName);

        try {
            await ssh.getFile(localPath, remotePath);
        }
        catch(exception) {
            return { status: 'error', exception };
        }
        ssh.dispose();
        return { status: "success" }

    },

    async uploadFile(serverName, localPath, remotePath) {

        console.log('uploading file', localPath, remotePath);
        const ssh = await this.connect(serverName);

        try {
            await ssh.putFile(localPath, remotePath);
        }
        catch(exception) {
            return { status: 'error', exception };
        }
        ssh.dispose();
        return { status: "success" }

    },

    async uploadFiles(serverName, remoteDir, files) {

        console.log('uploading files to', serverName);
        console.log(' > ' + files.join("\n > "));

        const ssh = await this.connect(serverName);

        // Build local and remote maps
        let docs = [];
        for(let file of files) {
            docs.push({ local: file, remote: remoteDir + '/' + file });
        }

        try {
            await ssh.putFiles(docs);
        }
        catch(exception) {
            return { status: 'error', exception };
        }
        ssh.dispose();
        return { status: "success" }

    },

}

module.exports = Remote;
