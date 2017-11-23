isNull = function(object) {
    try {
    	
    	if (typeof object == "boolean"){
    		return false;
    	} else {
            return (object == null || typeof object == "undefined" || object === "" || object == "undefined");    		
    	}
    	    	
    } catch (e) {
        alert("common.isNull: " + object +"::"+ e.message);
        WebSquare.exception.printStackTrace(e);
    }
};