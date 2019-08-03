"use strict";

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

var server = _http["default"].Server(app);

var io = (0, _socket["default"])(server);
var port = process.env.PORT || 3000;
io.on('connection', function (socket) {
  console.log('user connected');
});
server.listen(port, function () {
  console.log("started on port: ".concat(port));
});