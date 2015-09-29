/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

// UAVCS - START

//var sys = require('sys');
//var mqtt = require('mqtt');
//// var io = require('socket.io').listen(5000);
//
//var client = mqtt.connect({
//	host : 'ec2-54-186-38-68.us-west-2.compute.amazonaws.com',
//	port : 1884
//});

// io.sockets.on('connection', function(socket) {
// // socket.on('subscribe', function(data) {
// // console.log('Subscribing to ' + data.topic);
// // client.subscribe(data.topic);
// // });
// });

// io.on('connection', function(socket) {
// fs.readFile('/path/to/image.png', function(err, buffer) {
// socket.emit('image', {
// buffer : buffer
// });
// });
// });
//client.on('connect', function() {
//	client.subscribe('uavcs/mav01/imagestream');
//	client.publish('uavcs/node', 'nodejs initiated image stream');
//	console.log('** Session Opened **');
//});
//var count = 0;
//client.on('message', function(topic, message) {
//	// message is Buffer
//	count++;
//	console.log("Count from NODE: "+ count);
//
//});

// client.addListener('mqttData', function(topic, payload) {
// sys.puts(topic + '=' + payload);
//	
// console.log('Payload : ' + payload);
// // io.sockets.emit('mqtt', {
// // 'topic' : String(topic),
// // 'payload' : String(payload)
// // });
// });

// FFMPEG - START
// var ffmpeg = require('ffmpeg');

