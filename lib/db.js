const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b289bb73de2470',
  database: 'heroku_144c10803bbc56c',
  password: 'a374928f'
});
connection.connect();
module.exports = connection;