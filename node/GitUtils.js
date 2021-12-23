const env = require('../.env.json');
const shell = require('shelljs');

const Remote = require('./Remote');
const Local = require('./Local');

const GitUtils = {

    git_changed(commit) {
        let command;
        if(!commit) {
            command = 'git diff --name-only --ignore-submodules';
        }
        else if(commit == 'head') {
            command = 'git diff --name-only --ignore-submodules HEAD~1 HEAD';
        }
        else {
            command = 'git diff --name-only --ignore-submodules ' + commit;
        }
        let { stdout, stderr, code } = shell.exec(command, { silent: true });
        if(code) {
            return { 'status': 'error', 'message': 'git diff failed' };
        }
        let files = stdout.trim().split(/\r?\n/).filter(x => x);
        return files;
    },

    async gitcopy() {

        let currDir = process.cwd();

        let map;
        for(let doc of env.gitcopies) {
            if(doc.from == currDir) {
                map = doc;
                break;
            }
        }
        if(!map) {
            console.log('no map found for', currDir);
            return;
        }

        let files = this.git_changed();
        console.log(files);

        if(!files.length) {
            console.log('no files changed!');
            return;
        }
        let result = await Remote.uploadFiles(map.server, files);
        console.log('done');

    }


}

module.exports = GitUtils;


