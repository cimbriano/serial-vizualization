var express = require('express');
var app = express();
var engines = require('consolidate');
var path = require('path');

// Socket.io
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);
console.log('Listening on port 3000');

// Set up socket.io
io.sockets.on('connection', function(socket){
    socket.emit('news', { hello: 'world'});
});


// Serial Port Setup
var SerialPort = require('serialport').SerialPort
var serialport = new SerialPort('/dev/tty.usbmodemfa131', {
    baudrate: 115200,
    databits: 8,
    stopbits: 1,
});

serialport.on('open', function(){
    console.log('Serial Port Open');

    serialport.on('data', function(data){
        console.log('Data received: ' + data);
    });
});


app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index');
});
