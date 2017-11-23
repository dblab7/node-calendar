// app.js

// [LOAD PACKAGES]
var express     = require('express');
var bodyParser  = require('body-parser'); 
var session	    = require('express-session');
var fs			= require("fs")
var mongoose    = require('mongoose'); 
var admin		= require('firebase-admin'); 
var http		= require('http')
var path		= require('path'); 

var app         = express();

// Configure our application
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 80);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.methodOverride());
//app.use(express.errorHandler());


// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 80;

// [RUN SERVER]
//var server = app.listen(port, function(){
// console.log("Express server has started on port " + port)
//}); 

// CONNECT TO MONGODB SERVER
var mongoose    = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

//mongoose.connect('mongodb://localhost/mongodb_tutorial', {
mongoose.connect('mongodb://simter:rkeus1657@ds151973.mlab.com:51973/mongodb_tutorial', {
	useMongoClient: true, 
	/*other option*/
});
//mongoose.connect('mongodb://username:password@host:port/database?options...');

// DEFINE MODEL
var Book = require('./models/book');
var Calendar = require('./models/calendar');

/*******************
firebase connection
*******************/
var admin = require("firebase-admin");
var serviceAccount = require("./calendarapp-45d90-firebase-adminsdk-59c5j-c71aa94d8d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://calendarapp-45d90.firebaseio.com"
});

var db = admin.database();



// Enable Socket.io
var server = http.createServer(app).listen( app.get('port') );
var io = require('socket.io').listen( server );

/*
// A user connects to the server (opens a socket)
io.sockets.on('connection', function (socket) {

  // (2): The server recieves a ping event
  // from the browser on this socket
  socket.on('ping', function ( data ) {
  
    console.log('socket: server recieves ping (2)');

    // (3): Emit a pong event all listening browsers
    // with the data from the ping event
    io.sockets.emit( 'pong', data );   
    
    console.log('socket: server sends pong to all (3)');

  });

  socket.on( 'drawCircle', function( data, session ) {

    console.log( "session " + session + " drew:");
    console.log( data );


    socket.broadcast.emit( 'drawCircle', data );

  });

});
*/

// [CONFIGURE ROUTER] 
require('./routes')(app, Calendar, Book, fs, db, io); 
//var router = require('./routes')(app, Calendar, Book, fs, db)
