const querystring = require("querystring");
const http = require("http");

function PostCode(){
  var postData = querystring.stringify({
    'author':'robot',
    'text':'This is robot typing'
  });
  
  var post_options = {
    host:'localhost',
    port:'1228',
    path:'/upload',
    method:'POST',
    headers:{
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' : Buffer.byteLength(postData)
    }
  };

  var post_req = http.request(post_options, function(res){
    res.setEncoding('utf8');
    res.on('data', function(chunk){
      console.log('Response: ' + chunk);
    });
  });
  
  post_req.write(postData);
  post_req.end();
}

PostCode();
