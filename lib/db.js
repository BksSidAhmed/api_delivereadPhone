const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'mysql-jonathanjouffroy.alwaysdata.net',
  user: '154728',
  database: 'jonathanjouffroy_deliveread',
  password: 'Deliveread1234'
});
connection.connect();
module.exports = connection;