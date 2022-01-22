"use strict";
process.title = 'node-chat';
var webSocketsServerPort = 1337;
var webSocketServer = require('websocket').server;
var http = require('http');
var clients = [];
var user_id = undefined;
var server = http.createServer(function (request, response) {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});
server.listen(webSocketsServerPort, function () {
  console.log((new Date()) + " Server is listening on port "
    + webSocketsServerPort);
});
var wsServer = new webSocketServer({
  httpServer: server
});
wsServer.on('request', function (request) {
  console.log((new Date()) + ' Connection from origin '
    + request.origin + '.');
  var connection = request.accept(null, request.origin);
  var index = clients.push(connection) - 1;
  console.log((new Date()) + ' Connection accepted.');
  var auth_key = request.resourceURL.query.auth_key;
  
  var req = http.request({
    host: 'localhost',
    port: 80,
    path: '/web_hook/crypt/index.php?action=encrypt&data=' + auth_key,
    method: 'GET'
  }, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      user_id = chunk.split('-')[0];
      send_message(user_id);
    });
  });
  req.write('data\n');
  req.end();
  connection.on('close', function (connection) {
  });
  function send_message(str){
    connection.sendUTF(
      JSON.stringify({ type:'no-thing', data: str }));
  }
});