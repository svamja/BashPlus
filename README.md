# BashPlus

Simple Bash Profile using Bash and NodeJS

### Usage

Clone the repository and source the "profile.sh" at the end of ".profile" file

    cd /var/www
    git clone https://github.com/svamja/BashPlus.git
    echo ". /var/www/BashPlus/profile.sh" >> ~/.profile

If you change the clone path, please update the same above.


### Env file format

File name: .env.json
Sample format:

    {
        "servers": {
            "server01": {
                "ipaddr": "1.2.3.4",
                "username": "ubuntu"
            }
        },
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

    getcolls --server server01 --db testdb collection1 collection2 ..

this will export the collections on server01 server and restore the same on local mongodb database



