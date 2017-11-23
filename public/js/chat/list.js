// This file is executed in the browser, when people visit /chat/<random id>

$(function(){

	// getting the id of the room from the url
	//var id = Number(window.location.pathname.match(/\/chat\/(\d+)$/)[1]);
	
	// connect to the socket
	var socket = io();
	
	var list = $("#list"); 
	

	socket.on('showchatlist', function(data){ 
		list.append(data.link + '<BR>'); 
	}); 

	/*socket.on('peopleinchat', function(data){

		if(data.number === 1) {

			showMessage("personinchat",data);

			loginForm.on('submit', function(e){

				e.preventDefault();

				name = $.trim(hisName.val());

				if(name.length < 1){
					alert("Please enter a nick name longer than 1 character!");
					return;
				}

				if(name == data.user){
					alert("There already is a \"" + name + "\" in this room!");
					return;
				}
				email = hisEmail.val();

				if(!isValid(email)){
					alert("Wrong e-mail format!");
				}
				else {
					socket.emit('login', {user: name, avatar: email, id: id});
				}

			});
		}


	});
	*/

	
	/*
	socket.on('toclient',function(data){
		console.log(data.msg);
		$('#msg').append(data.msg+'<BR>');
	});
	*/

});
