var express = require('express');
var app = express();
var engines = require('consolidate');
var path = require('path');

// Socket.io
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);
console.log('Listening on port 3000');

// Serial Port Setup
var SerialPort = require('serialport').SerialPort
var serialport = new SerialPort('/dev/tty.usbmodemfa131', {
    baudrate: 9600,
    databits: 8,
    stopbits: 1,
});

serialport.on('open', function(){
    console.log('Serial Port Open');
});



// Set up socket.io
io.sockets.on('connection', function(socket){
    socket.emit('news', { hello: 'world'});
});

// Store data until a new line character is found.
var data_buffer = "";

serialport.on('data', function(data){

    data_buffer += data;

    // Check if this ends in a newline
    if(data_buffer.slice(-1) == '\n') {

        // console.log('Data received: ' + String(data_buffer));
        // console.log(typeof String(data_buffer));
        var parts = String(data_buffer).trim().split(" ");

        // Skip partial messages
        if(parts.length == 3) {
            io.sockets.emit('arduino', { pin: parts[0],
                                 val: parts[1],
                                 dir: parts[2],
                                 raw: String(data_buffer) });
        }

        //Reset buffer
        data_buffer = "";
    }
});


app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index');
});
