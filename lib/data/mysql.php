<?php 
	//Getting user name
	global $user, $pass; 
	$user = $_POST['username'];
	$pass = $_POST['password'];
	$host = "166.78.31.162";
	$dbname = "sbs";
	
	 /**
     * Inserts username and filepath into data table on remote database
     * @param string $filepath directory of upload.
     */
	function dataInsert($filepath) {
		try {
			//Setting up PDO connection
			$dbh = new PDO('mysql:host=' . $host . ';dbname=' . $dbname, $user, $pass);	    
		    
		    // query
			$sql = "INSERT INTO data (username,filepath) VALUES (uname,fpath)";
			$q = $dbh->prepare($sql);
			$q->execute(array('uname'=>$user,'fpath'=>$filepath));
			
		    $dbh = null;
			} catch (PDOException $e) {
			    print "Error!: " . $e->getMessage() . "<br/>";
			    die();
			}
		}
	
	 /**
     * Inserts username and filepath into data table on remote database
     * @param int $id id number associated with report.
     */
	function selectAlarms($id) {
		try {
			//Setting up PDO connection
			$dbh = new PDO('mysql:host=' . $host . ';dbname=' . $dbname, $user, $pass);	    

		    // query
			$sql = "SELECT unix_timestamp(start) as ustart, unix_timestamp(end) as uend FROM alarms WHERE username = uname, id = idnumber";
			$q = $dbh->prepare($sql);
			$q->execute(array('uname'=>$user,'idnumber'=>$id));
			
			//returning result as an array
			$result = $q->fetchAll();
			return $result;
			
		    $dbh = null;
			} catch (PDOException $e) {
			    print "Error!: " . $e->getMessage() . "<br/>";
			    die();
			}
		}
?>