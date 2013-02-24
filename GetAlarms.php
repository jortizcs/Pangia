<?php
class GetAlarms{
    public $mysql_host = "localhost";
    public $otsdb_host= "localhost";
    public $otsdb_port = 1338;

    function __construct($mysql, $otsdb){
        if(!empty($mysql)){
            $this->mysql_host = $mysql;
        }

        if(!empty($otsdb)){
            $this->otsdb_host = $otsdb;
        }

        $this->ostdb_port = 1338;
    }

    function getDataAlarms($user, $id){

        $alarms = getAlarms($user, $id);

        for($i=0; $i<count($alarms); $i++){
            $start = $alarms[$i]["start"];
            $end = $alarms[$i]["end"];
            $label1 = $alarms[$i]["label01"];
            $label2 = $alarms[$i]["label02"];

            //for each alarm, extend the start time and end time
            $new_start = $start - 2*($end-$start);
            $new_end = $end + 2*($ned-$start);
            
            //fetch the data for the new alarm time and end time
            $data4_label1 = getTsData($new_start, $new_end, $label1);
            $data4_label2 = getTsData($new_start, $new_end, $label2);

            //populate data and alarms array
            $alarm_set = array();
            $data_array = array();

            $pair = array($start, $end);;
            array_push($alarm_set, $pair);

            $data_obj1 = array("label" => $label1, "data" => $data4_label1);
            $data_obj2 = array("label" => $label2, "data" => $data4_label2);

            //add data
            array_push($data_array, $data_obj1);
            array_push($data_array, $data_obj2);

            //add alarms
            array_push($data_array, $alarm_set);

            //construct the return json object and return it
            return json_encode($data_array);
        }
    }

    function getTsData($st, $et, $label){
        $st_date = new DateTime("@$st", new DateTimeZone('America/Los_Angeles'));
        $st_format = $st_date->format("Y/m/d-H:i:s");

        $et_date = new DateTime("@$et", new DateTimeZone('America/Los_Angeles'));
        $et_format = $et_date->format("Y/m/d-H:i:s");
        $url = "http://".$this->otsdb_host.":".$this->ostdb_port."/q?start=".$st_format."&end=".$et_format."&label=".$label;
        //echo 'url='.$url."\n";
        $tsdata_str = file_get_contents($url);
        $tsdata = json_decode($tsdata_str);
        return $tsdata;
    }

    function getAlarms($user, $id){
        //query the alarms table
        $query = "select start, end, label01, label02 from alarms where username= :username and id= :id";
        $dsn  = 'mysql:dbname=sbs;host='.$mysql_host;

        try {
            $dbh = new PDO($dsn, "root", "root");
            $sth = $dbh->prepare($query);
            if($sth->execute(array(':username'=>$user, ':id'=>$id))){
                $rows = $sth->fetchAll();
                print_r($rows);
                return $rows;
            }
        } catch(PDOException $e){
            echo 'Connection failed '. $e->getMessage();
        }
    }
}
?>
