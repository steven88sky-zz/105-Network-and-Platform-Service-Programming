var http = require('./modules/server.js');
var router = require('./modules/router.js');
var requestHandlers = require("./modules/requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

http.start(router.route, handle);
