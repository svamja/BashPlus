# BashPlus

Simple bash profile and command line utilities using Bash and NodeJS

* `cd --` - switch to recent directory
* `getcolls` - download and restore mongodb collections
* `ts` - convert unix or JS timestamp to formatted date
* `getts` - read ISO date input to JS timestamp
* `gitcopy` - copy uncommitted files to remote server

### Usage

Clone the repository and source the "profile.sh" at the end of ".profile" file

    cd /var/www
    git clone https://github.com/svamja/BashPlus.git
    echo ". /var/www/BashPlus/profile.sh" >> ~/.profile

If you change the clone path, please update the same above.


### env file format

File name: `.env.json`

Sample format:

    {
        "servers": {
            "server01": {
                "ipaddr": "1.2.3.4",
                "username": "ubuntu"
            }
        },
        "gitcopies": [
            {
                "server": "server01"
                "from": "/local/path/to/project1",
                "to": "/remote/path/to/project1",
            }
        ],
        "local": {
            "tmpdir": "/users/admin/tmp"
        },
        "defaults": {
            "tmpdir": "/tmp",
            "server": "server01",
            "username": "admin",
            "database": "my_mongodb_database"
        }
    }

### Commands

    getcolls collection1 collection2 ..
    getcolls --server server01 --db testdb collection1 collection2 ..

This will export the collections from given server and restore the same on local mongodb database. If omitted, `server` and `database` are taken from `defaults` of `.env.json` file.

    ts 1635766500000

Prints formatted date for the given timestamp

    getts 2021-01-01
    getts 2021-01-01 17:05:05

Prints Javascript timestamp (milliseconds since epoch) for a given date

    gitcopy

Copies (uploads) the uncommitted changed files to remote server, based on the current directory.
The current directory must match the `from` argument in the `gitcopies`.


