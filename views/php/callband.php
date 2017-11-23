<?	
	$n = $_GET["n"];

	if(isset($_GET["n"])) { 
		echo "<meta http-equiv='refresh' content='0; url=http://band.us/band/$n'>";
	} 
	else {
		echo "<meta http-equiv='refresh' content='0; url=http://band.us/home/'>";
	}
?>