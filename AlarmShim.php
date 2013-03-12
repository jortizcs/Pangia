<?php
include_once("GetAlarms.php");
$user = $_REQUEST['user'];
$id = $_REQUEST['id'];

#$user = "root";
#$id = 1;

if(!empty($user) && !empty($id)){
    $disAlarms = new GetAlarms("localhost", "166.78.31.162");
    echo json_encode($disAlarms->getDataAlarms($user, $id));
    //print_r($disAlarms->getDataAlarms("root", 1));
}
?>
