var seetings = require('../settings.js');

var Db = require('mongodb').Db;

var Connection = require('mongodb').Connection;

var Server = require('mongodb').Server;

module.exports = new Db(seetings.db, new Server(seetings.host, seetings.port), {safe :true});