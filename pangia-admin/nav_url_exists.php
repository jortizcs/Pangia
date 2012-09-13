<?php
	/* function to ping whether server is up or down */
    function urlExists($url=NULL)  
	{  
	    if($url == NULL) return false;  
	    $ch = curl_init($url);  
	    curl_setopt($ch, CURLOPT_TIMEOUT, 10);  
	    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);  
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  
	    $data = curl_exec($ch);  
	    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);  
	    curl_close($ch);  
	    if($httpcode>=200 && $httpcode<300){  
	        return true;  
	    } else {  
	        return false;  
	    }  
	}
?>