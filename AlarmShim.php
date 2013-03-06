<?php
include_once("GetAlarms.php");
$user = $_REQUEST['user'];
$id = $_REQUEST['id'];

if(!empty($user) && !empty($id)){
    $disAlarms = new GetAlarms("localhost", "localhost");
    echo json_encode($disAlarms->getDataAlarms($user, $id));
    //print_r($disAlarms->getDataAlarms("root", 1));
}
?>
