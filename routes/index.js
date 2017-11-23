// routes/index.js
//var qs = require('querystring');

// Use the gravatar module, to turn email addresses into avatar images:
var gravatar = require('gravatar');

module.exports = function(app, Calendar, Book, fs, db, io)
{
	/**********************/
	/*      Calendar      */
	/**********************/
	app.get('/',function(req,res){ 
		Calendar.find(function(err, calendars){
			if(err) return res.status(500).send({error: 'database failure'});

			for(var i=0;i<calendars.length;i++){ 
				calendars[i].id = calendars[i]._id; 
				var allday = calendars[i].allday; 
				
				/*
				if(allday == "Y") {
					start = start.format('YYYY-MM-DD');
					end = end.format('YYYY-MM-DD');
				}
				else {
					start = start.format('YYYY-MM-DD HH:mm:ss');
					end = end.format('YYYY-MM-DD HH:mm:ss');
				}*/

				/*var start = calendars[i].start.split(" ");
				var end = calendars[i].end.split(" ");
				if(start[1] == '00:00:00'){
					start = start[0];
				}else{
					start = calendars[i].start;
				}
				if(end[1] == '00:00:00'){
					end = end[0];
				}else{
					end = calendars[i].end;
				}*/
			}

			res.render('index.html', {  
			 events: calendars 
			})
		})
		
		/*
		var events = []; 
		var ref = db.ref("nodejs"); 

		ref.on("child_added", function(snapshot, prevChildKey) {
		  var newEvent = snapshot.val();
		  console.log("newEvent: " + newEvent); 
		  events.push(newEvent);
		});

        res.render('index.html', {  
			 events: events
		 })*/
     })

	app.post('/edit', function(req, res){
		var obj = {};

		//console.log('params: ' + JSON.stringify(req.params));
		//console.log('body: ' + JSON.stringify(req.body));
		//console.log('query: ' + JSON.stringify(req.query));
		
		var calendar = new Calendar(); 
		calendar.tType = req.body.tType; 
		calendar.title = req.body.title;
		calendar.start = req.body.start;
		calendar.end = req.body.end;
		calendar.descr = req.body.descr;
		calendar.color = req.body.color;
		calendar.id = req.body.id;
		calendar.del = req.body.del; 
		calendar.allday = req.body.allday; 

		console.log(req.body.allday);

/*
		console.log('params: ' + JSON.stringify(req.params));
		console.log('body: ' + JSON.stringify(req.body));
		console.log('query: ' + JSON.stringify(req.query));
	
		res.header('Content-type','application/json');
		res.header('Charset','utf8');
		res.send(req.query.callback + '('+ JSON.stringify(obj) + ');');
		*/
		
		if(calendar.tType == "add") { 
			calendar.save(function(err, result){
				if(err){
					console.error(err);
					res.json({result: 0});
					return;
				}
				
				calendar.id = result._id; 
				console.log(calendar.id);
				res.json(calendar);
				
			});
		} 
		else if(calendar.tType == "update") 
		{
			Calendar.findById(calendar.id, function(err, event){
				if(err) return res.status(500).json({ error: 'database failure' });
				if(!event) return res.status(404).json({ error: 'calendar not found' });

				if(calendar.start) event.start = calendar.start;
				if(calendar.end) event.end = calendar.end; 

				event.save(function(err){
					if(err) res.status(500).json({error: 'failed to update'});
					res.json({message: 'calendar updated'});
				});
			});
		}
		else if(calendar.tType == "editTitle") {
			if(calendar.del == "Y") {
				Calendar.remove({ _id: calendar.id }, function(err, output){
					if(err) return res.status(500).json({ error: "database failure" });

					/* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
					if(!output.result.n) return res.status(404).json({ error: "calendar not found" });
					res.json({ message: "calendar deleted" });
					*/

					res.status(204).end();
				})
			}
			else {
				Calendar.findById(calendar.id, function(err, event){
					if(err) return res.status(500).json({ error: 'database failure' });
					if(!event) return res.status(404).json({ error: 'calendar not found' });

					if(calendar.title) event.title = calendar.title;
					if(calendar.color) event.color = calendar.color;
					if(calendar.descr) event.descr = calendar.descr; 
					if(calendar.start) event.start = calendar.start; 
					if(calendar.end) event.end = calendar.end; 
					if(calendar.allday) event.allday = calendar.allday; 

					event.save(function(err){
						if(err) res.status(500).json({error: 'failed to update'});
						res.json({message: 'calendar updated'});
					});
				});
			}
		}

	});
	

	/**********************/
	/*      Board      */
	/**********************/
	app.get('/board',function(req,res){ 
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
		
		res.render('board.html', {
		})
	});
	

	/**********************/
	/*        Memo        */
	/**********************/
	app.get('/memo',function(req,res){
		res.render('memo.html', {
		})
	});

	
	/**********************/
	/*        Chat        */
	/**********************/
	
	app.get('/chat/home', function(req, res){

		// Render views/home.html
		res.render('chat/home.html');
	});

	app.get('/chat/create', function(req,res){

		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));

		// Redirect to the random room
		res.redirect('/chat/'+id);
	});

	app.get('/chat/:id', function(req,res){
		
		// Render the chant.html view
		res.render('chat/chat.html');
	}); 
	
	app.get('/chatlist', function(req, res){  
		//List 
		//socket.emit('showchatlist', {link: 0}); 

		console.log('list');
		res.render('chat/list.html');
	});

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {

		// When the client emits the 'load' event, reply with the 
		// number of people in this chat room
		socket.on('load',function(data){ 
			console.log(data); 

			var room = findClientsSocket(io,data);
			if(room.length === 0 ) {

				socket.emit('peopleinchat', {number: 0}); 
			}
			else if(room.length === 1) {

				socket.emit('peopleinchat', {
					number: 1,
					user: room[0].username,
					avatar: room[0].avatar,
					id: data
				}); 
			}
			else if(room.length >= 2) {

				chat.emit('tooMany', {boolean: true});
			}
		});

		// When the client emits 'login', save his name and avatar,
		// and add them to the room
		socket.on('login', function(data) {

			var room = findClientsSocket(io, data.id);
			// Only two people per room are allowed
			if (room.length < 2) {

				// Use the socket object to store data. Each client gets
				// their own unique socket object

				socket.username = data.user;
				socket.room = data.id;
				socket.avatar = gravatar.url(data.avatar, {s: '140', r: 'x', d: 'mm'});

				// Tell the person what he should use for an avatar
				socket.emit('img', socket.avatar);


				// Add the client to the room
				socket.join(data.id);

				if (room.length == 1) {

					var usernames = [],
						avatars = [];

					usernames.push(room[0].username);
					usernames.push(socket.username);

					avatars.push(room[0].avatar);
					avatars.push(socket.avatar);

					// Send the startChat event to all the people in the
					// room, along with a list of people that are in it.

					chat.in(data.id).emit('startChat', {
						boolean: true,
						id: data.id,
						users: usernames,
						avatars: avatars
					});
				}
			}
			else {
				socket.emit('tooMany', {boolean: true});
			}
		});

		// Somebody left the chat
		socket.on('disconnect', function() {

			// Notify the other person in the chat room
			// that his partner has left

			socket.broadcast.to(this.room).emit('leave', {
				boolean: true,
				room: this.room,
				user: this.username,
				avatar: this.avatar
			});

			// leave the room
			socket.leave(socket.room);
		});


		// Handle the sending of messages
		socket.on('msg', function(data){

			// When the server receives a message, it sends it to the other person in the room.
			socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
		});

	});
	
	
	/**********************/
	/*        Login        */
	/**********************/
	app.get('/login',function(req,res){
		res.render('login.html', {
		})
	});



	/**********************/
	/*         Etc        */
	/**********************/
	app.get('/dung',function(req,res){
		res.render('dung/dung.html', {
		})
	});

	app.get('/test',function(req,res){
        res.render('test.html', {
			 title: "MY HOMEPAGE",
			 length: 5
		 })
     });

	app.get('/market',function(req,res){
        res.render('market.html', {
		 })
     });

     app.get('/about',function(req,res){
        res.render('about.html');
    });

    // GET ALL BOOKS
    app.get('/api/books', function(req,res){
		Book.find(function(err, books){
			if(err) return res.status(500).send({error: 'database failure'});
			res.json(books);
		})
	});

    // GET SINGLE BOOK
    app.get('/api/books/:book_id', function(req, res){
		Book.findOne({_id: req.params.book_id}, function(err, book){
			if(err) return res.status(500).json({error: err});
			if(!book) return res.status(404).json({error: 'book not found'});
			res.json(book);
		})
	});

    // GET BOOK BY AUTHOR
    app.get('/api/books/author/:author', function(req, res){
		Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  function(err, books){
			if(err) return res.status(500).json({error: err});
			if(books.length === 0) return res.status(404).json({error: 'book not found'});
			res.json(books);
		})
	});

    // CREATE BOOK
    app.post('/api/books', function(req, res){
		var book = new Book();
		book.title = req.body.title;
		book.author = req.body.author;
		book.published_date = new Date(req.body.published_date);

		book.save(function(err){
			if(err){
				console.error(err);
				res.json({result: 0});
				return;
			}

			res.json({result: 1});
		});

		/*POST
		{
			"title": "Mongod", 
			"author": "smwoo", 
			"published_date": "2017-02-21" 
		}
		*/
	});

    // UPDATE THE BOOK
    app.put('/api/books/:book_id', function(req, res){
		Book.findById(req.params.book_id, function(err, book){
			if(err) return res.status(500).json({ error: 'database failure' });
			if(!book) return res.status(404).json({ error: 'book not found' });

			if(req.body.title) book.title = req.body.title;
			if(req.body.author) book.author = req.body.author;
			if(req.body.published_date) book.published_date = req.body.published_date;

			book.save(function(err){
				if(err) res.status(500).json({error: 'failed to update'});
				res.json({message: 'book updated'});
			});

		});

	});

    // DELETE BOOK
    app.delete('/api/books/:book_id', function(req, res){
		Book.remove({ _id: req.params.book_id }, function(err, output){
			if(err) return res.status(500).json({ error: "database failure" });

			/* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
			if(!output.result.n) return res.status(404).json({ error: "book not found" });
			res.json({ message: "book deleted" });
			*/

			res.status(204).end();
		})
	});

	//firebase
	/*app.get('/',function(req,res){ 
		var events = []; 
		var ref = db.ref("nodejs"); 

		ref.on("child_added", function(snapshot, prevChildKey) {
		  var newEvent = snapshot.val();
		  console.log("newEvent: " + newEvent); 
		  events.push(newEvent);
		});

        res.render('index.html', {  
			 events: events
		 })
     });*/

	/*[
				{
					title: '1All Day Event',
					start: '2017-04-01'
				},
				{
					title: 'Long Event',
					start: '2017-04-07',
					end: '2017-04-10'
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: '2017-04-09T16:00:00'
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: '2017-04-16T16:00:00'
				},
				{
					title: 'Conference',
					start: '2017-04-11',
					end: '2017-04-13'
				},
				{
					title: 'Meeting',
					start: '2017-04-12T10:30:00',
					end: '2017-04-12T12:30:00'
				},
				{
					title: 'Lunch',
					start: '2017-04-12T12:00:00'
				},
				{
					title: 'Meeting',
					start: '2017-04-12T14:30:00'
				},
				{
					title: 'Happy Hour',
					start: '2017-04-12T17:30:00'
				},
				{
					title: 'Dinner',
					start: '2017-04-12T20:00:00'
				},
				{
					title: 'Birthday Party',
					start: '2017-04-13T07:00:00'
				},
				{
					title: 'Click for Google',
					url: 'http://google.com/',
					start: '2017-04-28'
				}
			]*/
}; 


function findClientsSocket(io,roomId, namespace) {
	var res = [],
		ns = io.of(namespace ||"/");    // the default namespace is "/"

	if (ns) {
		for (var id in ns.connected) {
			if(roomId) {
				var index = ns.connected[id].rooms.indexOf(roomId) ;
				if(index !== -1) {
					res.push(ns.connected[id]);
				}
			}
			else {
				res.push(ns.connected[id]);
			}
		}
	}
	return res;
}
