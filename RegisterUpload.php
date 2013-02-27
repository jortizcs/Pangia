<?php

function getEntry($username, $filepath){
    $query= "select id from data where `username`=:username and `filepath`=:fpath";
    $dsn  = 'mysql:dbname=sbs;host=localhost';

    try {
        $dbh = new PDO($dsn, "root", "root");
        $sth = $dbh->prepare($query);
        if($sth->execute(array(':username'=>$username, ':fpath'=>$filepath))){
            $rows = $sth->fetchAll();
            if(count($rows)>0)
                return $rows[0]["id"];
            return -1;
        }
    } catch(PDOException $e){
        echo 'Connection failed '. $e->getMessage();
    }
    return -1;
}

function register($username, $filepath){
    $query = "insert into data (`username`, `filepath`) values(:username, :fpath)";
    $dsn  = 'mysql:dbname=sbs;host=localhost';

    $id = getEntry($username, $filepath);
    if($id<0){
        try {
            $dbh = new PDO($dsn, "root", "root");
            $sth = $dbh->prepare($query);
            $sth->execute(array(':username'=>$username, ':fpath'=>$filepath));
            return getEntry($username, $filepath);
        } catch(PDOException $e){
            echo 'Connection failed '. $e->getMessage();
        }
    }
    return $id;
}



$username = $_REQUEST["user"];
$filepath = $_REQUEST["filepath"];

echo getEntry($username, $filepath);
?>
