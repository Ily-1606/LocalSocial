"use strict";
process.title = 'node-chat';
var webSocketsServerPort = 1338;
var webSocketServer = require('websocket').server;
const express = require('express');
var http = require('http');
var clients = {};
var user_id = undefined;
var wsServer;
var connection;
//
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
    if (request.url == "/push") {
        var body = "";
        request.on('readable', function() {
            var t = request.read();
            if (t != null) {
                body += t;
            }
        });
        request.on('end', function() {
            response.end();
            body = JSON.parse(body);
            if (body.type == 'typing') {
                for (var i = 0; i < body.send_to_user.length; i++) {
                    var user_id = body.send_to_user[i];
                    if (body.info_user.user_id != user_id) {
                        send_message(clients[user_id], body);
                    }
                }
            } else {
                for (var i = 0; i < body.send_to_user.length; i++) {
                    var user_id = body.send_to_user[i];
                    send_message(clients[user_id], body);
                }
            }
        });
    }
});

server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " +
        webSocketsServerPort);
});
wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' +
        request.origin + '.');
    console.log((new Date()) + ' Connection accepted.');
    var auth_key = request.resourceURL.query.auth_key;
    var req = http.request({
        host: 'localhost',
        port: 80,
        path: '/moddle/hash.php?action=decrypt&text=' + auth_key,
        method: 'GET'
    }, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            user_id = chunk.split('-')[0];
            connection = request.accept(null, request.origin);
            clients[user_id] = connection;
            connection.on('close', function(connection) {});
            send_message(clients[user_id], { type: "no-thing", message: user_id });
        });
    });
    req.write('data\n');
    req.end();
});

function send_message(conn, msg) {
    if (conn != undefined) {
        conn.sendUTF(
            JSON.stringify(msg));
    }
}