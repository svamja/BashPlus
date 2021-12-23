const env = require('../.env.json');
const { NodeSSH } = require('node-ssh');
const path = require('path');
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

    getmap(serverName) {
        let currDir = process.cwd();
        for(let doc of env.gitcopies) {
            if(serverName && serverName != doc.server) {
                continue;
            }
            if(doc.from == currDir) {
                return doc;
            }
        }
    },

    // cpfrom utility
    async cpfrom(args, options) {
        let serverName = args.shift();
        let files = args;
        return await this.downloadFiles(serverName, files);
    },

    async downloadFiles(serverName, files) {

        console.log('downloading files from', serverName);
        console.log(' > ' + files.join("\n > "));

        const ssh = await this.connect(serverName);

        // Build local and remote maps
        let map = this.getmap(serverName);
        let docs = [];
        for(let file of files) {
            let local = file;
            let remote = file;
            if(file[0] == '/') {
                local = path.basename(file);
            }
            else {
                if(map) {
                    remote = map.to + '/' + file;
                }
                else {
                    remote = process.cwd() + '/' + file;
                }
            }
            docs.push({ local, remote });
        }

        try {
            for(let doc of docs) {
                await ssh.getFile(doc.local, doc.remote);
            }
        }
        catch(exception) {
            console.log(exception);
        }
        ssh.dispose();

    },

    // cpto utility
    async cpto(args, options) {
        let serverName = args.shift();
        let files = args;
        return await this.uploadFiles(serverName, files);
    },

    async uploadFiles(serverName, files) {

        console.log('uploading files to', serverName);
        console.log(' > ' + files.join("\n > "));

        const ssh = await this.connect(serverName);

        // Build local and remote maps
        let map = this.getmap(serverName);
        let defaultDir = env.servers[serverName].chdir || env.defaults.chdir;
        let docs = [];
        for(let file of files) {
            let local = file;
            let remote = file;
            if(file[0] == '/') {
                remote = defaultDir + '/' + path.basename(file);
            }
            else {
                if(map) {
                    remote = map.to + '/' + file;
                }
                else {
                    remote = defaultDir + '/' + path.basename(file);
                }
            }
            docs.push({ local, remote });
        }
        // let docs = [];
        // for(let file of files) {
        //     docs.push({ local: file, remote: remoteDir + '/' + file });
        // }

        try {
            await ssh.putFiles(docs);
        }
        catch(exception) {
            console.log(exception);
        }
        ssh.dispose();

    },


}

module.exports = Remote;
