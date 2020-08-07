// utility class ripped from Patrick Hill

const MongoClient = require("mongodb").MongoClient;

const fs = require("fs").promises;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    let connectionDataStr = await fs.readFile("dbConnection.json");
    let connectionData = JSON.parse(connectionDataStr);
    _connection = await MongoClient.connect(connectionData.serverUrl);
    _db = await _connection.db(connectionData.database);
  }

  return _db;
};
