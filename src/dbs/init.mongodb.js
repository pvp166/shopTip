const mongoose = require('mongoose');
const {db: {host, port, name}} = require('@src/configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`;
const { countConnect } = require('@src/helpers/check.connect');

class Database {
    constructor() {
        this.connect()
    }
    connect(type = 'mongodb') {

        if (1 === 1) {
            mongoose.set('debug', true);
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).
            then(_ => console.log(`Connected Mongodb Success`, countConnect())).
            catch(err => console.log('Error Connect!'));
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;