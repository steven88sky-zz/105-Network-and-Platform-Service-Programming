const fs = require('fs');
const mysql = require('mysql');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var connection = mysql.createConnection({
    host: config.server,
    user: config.login,
    password: config.password,
    database: config.database
});
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.query('SELECT * FROM `MessageBoard`', function(err, rows, fields) {
  if (err) throw err;
  rows.forEach(function(row){
    console.log(row.id);
    console.log(row.Author);
    console.log(row.Message);
    console.log(row.Date);    
  });
});

connection.query("INSERT INTO `MessageBoard` (`Author`,`Message`, `Date`) VALUES('testauthor', 'message', NOW())", function(err, rows, fields) {
  if (err) throw err;

//  console.log('The solution is: ', rows[0].solution);
});


connection.end();
