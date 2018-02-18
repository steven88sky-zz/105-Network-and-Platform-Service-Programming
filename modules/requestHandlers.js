const fs = require("fs");
const querystring = require("querystring");
const mysql = require('mysql');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const http = require("http");

function start(response, postData){
  console.log("Request handler 'start' was called.");

  var connection = mysql.createConnection({
    host: config.server,
    user: config.login,
    password: config.password,
    database: config.database
  });

  connection.connect();

  connection.query('SELECT * FROM `MessageBoard`',function(err, rows) {
    if (err) throw err;
    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<table border=1>';
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(body);

    for(i = 0; i < rows.length; i++)
    {
      response.write('<tr><th>');
      response.write(`${rows[i].Author}`);
      response.write('</th><th>');
      response.write(`${rows[i].Message}`);
      response.write('</th><th>');
      response.write(`${rows[i].Date}`);
      response.write('</th><tr>');
    }
    body =
    '</table>'+
    '<form action="/upload" method="post">'+
    'Author:<input type = "text" name = "author" maxlength="10"><br>'+
    'Destination:<input type = "text" name = "dest"><br>'+
    '<textarea name="msg" rows="20" cols="60" maxlength="1000"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';
  response.write(body);
  response.end();
  });
}

function upload(response, postData){
  var connection = mysql.createConnection({
    host: config.server,
    user: config.login,
    password: config.password,
    database: config.database
  });

  
  var dest = querystring.parse(postData).dest;
  var author = querystring.parse(postData).author.replace(/\n|\r\n|\r/g, "<br>");
  var text = querystring.parse(postData).msg.replace(/\n|\r\n|\r/g, "<br>");
  newdest = dest.toString().split(":");
  var host = newdest[0];
  var port = newdest[1];
  var msg = text;
  var post = 
  {
     Author:author,
     Message:msg,
     Date:new Date(),
  };
  
  if(host === "localhost" || host === "")
  {
    connection.connect();
    connection.query("INSERT INTO MessageBoard SET ?", post, function(err, rows)
    {
       if(err) throw err; 
    });
  }else{
    var newpostData = querystring.stringify({
    'author':author,
    'msg':text,
    'dest':'localhost'
    });
  
    var post_options = {
    host:host,
    port:port,
    path:'/upload',
    method:'POST',
    headers:{
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' : Buffer.byteLength(newpostData)
      }
    };

    var post_req = http.request(post_options, function(res){
    res.setEncoding('utf8');
    res.on('data', function(chunk){
        console.log('Response: ' + chunk);
      });
    });
  
    post_req.write(newpostData);
    post_req.end();
  }
  

  
  console.log("Request handler 'upload' was called");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<meta content='5; url=http://140.127.198.24:1228/' http-equiv='refresh'>");
  response.write("You've sent: " + 
  querystring.parse(postData).msg);
  response.end();
}

exports.start = start;
exports.upload = upload;
