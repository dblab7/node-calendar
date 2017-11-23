'use strict';

/*note*/
var Notes = {

    "load": function(){

        var notes;

        if (localStorage['notes'] && localStorage['notes'].length > 2) {

            notes = localStorage['notes'];

        } else {

            notes = JSON.stringify([
                {"title":"A","text":"This is a note.  You can edit it, you can drag it around and you can shift-click to delete it.","x":23,"y":113},
                {"title":"B","text":"Click any empty spot to create a new note.","x":137,"y":234},
                {"title":"C","text":"Notes are automatically preserved for you between page visits.","x":320,"y":284},
            ]);

            localStorage['deleted'] = "[]";
            Notes.updateUndo();

        };

        $(".note").remove();

        if (typeof notes === "string") {
            notes = JSON.parse(notes) 
        }

        notes.forEach(function(note){
            Notes.add(note);
        }); 
	
	    $(".note-body").mCustomScrollbar({
			axis:"y", // vertical and horizontal scrollbar
			setHeight: $(".note-body").height() - 5  
		    //theme:"minimal" 
			//mouseWheel:{ scrollAmount: 500 } 
		});
    },

    "add": function(options){
        if (typeof options === 'string') { options = JSON.parse(options) };

        var note = $(document.createElement("div")).
            addClass("note").
            css("left", options.x + "px").
            css("top", options.y + "px"); 

		var noteHeader = $(document.createElement("div")).
			addClass("note-header"). 
			css("left", options.x + "px").
            css("top", options.y + "px"). 
			attr("contentEditable", "true").
            text(options.title); 
			note.append(noteHeader); 

		var noteBody = $(document.createElement("div")).
			addClass("note-body"). 
			css("left", options.x + "px").
            css("top", options.y + "px"). 
			attr("contentEditable", "true"). 
            text(options.text); 
			note.append(noteBody); 

		var close = $(document.createElement("div")). 
			addClass("close-thik"); 
			note.append(close); 
		
		var pin = $(document.createElement("div")). 
			addClass("pin"); 
			note.append(pin); 

            $("#board").append(note);

			noteBody.css("height", note.outerHeight() - noteHeader.outerHeight() + "px"); 

            note.draggable();
            note.focus(); 

        return note;
    },

    "save": function(){
        var notes = [];
        $(".note").each(function(i, note){ 
            notes.push({ 
				title: $(note).find(".note-header").text(), 
                text: $(note).find(".note-body").text(),
                x: parseInt($(note).css("left")),
                y: parseInt($(note).css("top"))
            });
        });

        localStorage["notes"] = JSON.stringify(notes);
    },

    "destroy": function(element){
        var deletedNotes = JSON.parse(localStorage['deleted']);

        deletedNotes.push({
            x: parseInt($(element).css("left")),
            y: parseInt($(element).css("top")), 
			title: $(element).find(".note-header").text(), 
            text: $(element).find(".note-body").text() 
        });

        $(element).remove();

        localStorage['deleted'] = JSON.stringify(deletedNotes);

        Notes.updateUndo();
    },

    "recover": function(){
        var deletedNotes = JSON.parse(localStorage['deleted']);
        Notes.add(deletedNotes.pop());
        localStorage['deleted'] = JSON.stringify(deletedNotes);

        Notes.updateUndo();
    },

    "updateUndo": function(){
        document.querySelector("button#undo").disabled =
            (localStorage['deleted'] && localStorage['deleted'].length > 2) ?
            false :
            true;
    },

    "reset": function(){
        localStorage.clear();
        Notes.autoSave("off");
    },

    "autoSave": function(deactivateAutoSave){
        if (deactivateAutoSave) {
            console.log("Autosave: OFF");
            clearInterval(window.autosave);
            delete window.autosave;
        } else {
            window.autosave = setInterval(function(){ Notes.save() }, 500);
        }
    }

}


/*board*/
function setHeight(){
    $('#board').css("height", (window.innerHeight * 0.8) + "px");
}

$(function(){

    // Clicking makes a new note
    $(document).not(".note").on("click", '#board', function(event){
        Notes.add({x: event.clientX, y: event.clientY});
    });

    // Resize board when window is resized
    $(window).on('resize', function(event){
    });

    // 'Pick up' a note when starting to drag it.
    $(document).on('dragstart', '.note', function(event){
        $(event.target).addClass("raised");
    });

	// Shift-click removes notes
	$(document).on('mousedown', '.close-thik', function(event){ 
		debugger;
		var note = $(event.target).parent(); 
            Notes.destroy(note);
		
		// Regular click moves note to top, and puts the cursor in it.
        $(note).parent().append(note);
        note.focus();
        event.stopPropagation();
    }); 

    // When a note is clicked.. 
	$(document).on('mousedown', '.note-header', function(event){ 
        // Regular click moves note to top, and puts the cursor in it.
        $(event.target).parent().parent().append($(event.target).parent());
        event.target.focus();
        event.stopPropagation();
    }); 

	//body text 
	$(document).on('mousedown', '.note-body .mCSB_container', function(event){ 
		debugger;
        // Regular click moves note to top, and puts the cursor in it.
        $(event.target).parent().parent().parent().parent().append($(event.target).parent().parent().parent());
        $(event.target).parent().parent().focus();
        event.stopPropagation();
    }); 
	
	//body not text 
	$(document).on('mousedown', '.note-body', function(event){ 
		debugger;
        // Regular click moves note to top, and puts the cursor in it.
        $(event.target).parent().parent().parent().append($(event.target).parent().parent());
        $(event.target).parent().focus();
        event.stopPropagation();
    }); 



    /*$(document).on('mousedown', '.note-body', function(event){ 
		debugger;
        // Regular click moves note to top, and puts the cursor in it.
		$(event.target).parent().parent().parent().parent().append($(event.target).parent().parent().parent())
        event.target.focus();
        event.stopPropagation();
    }); 
*/
    // Undo button retrieves deleted notes.
    $(document).on('click', 'button#undo', function(event){
        Notes.recover();
    });

    // Re-initialize notes to the initial default
    $(document).on('click', 'button#reset', function(event){
        Notes.reset();
        location.reload();
    });

    // 'Put down' the note when done dragging it.
    $(document).on('dragstop', '.note', function(event){
        $(event.target).removeClass("raised");
    });

    // Load initial notes (perhaps) saved
    var autoload = setTimeout(function(){ Notes.load() }, 500);
    // Start saving notes
    Notes.autoSave();

    // Set the height initially
    setHeight();

    // Set the undo button status
    Notes.updateUndo();

});
