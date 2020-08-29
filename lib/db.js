const mysql = require('mysql');
const connection = mysql.createConnection({
  host: '192.168.56.1',
  user: 'root',
  database: 'deliveread',
  password: ''
});
connection.connect();
module.exports = connection;