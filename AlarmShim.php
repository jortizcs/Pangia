<?php
include_once("GetAlarms.php");
$user = $_REQUEST['user'];
$id = $_REQUEST['id'];

if(!empty($user) && !empty($id)){
    $disAlarms = new GetAlarms("localhost", "localhost");
    echo json_decode($disAlarms->getDataAlarms("root", 1));
}
?>
