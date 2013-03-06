<?php
class GetAlarms{
    //public $mysql_host = "localhost";
    //public $otsdb_host= "localhost";
    public $mysql_host = "localhost";
    public $otsdb_host= "166.78.31.162";
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

        $alarms = $this->getAlarms($user, $id);
        //echo count($alarms);

        $data_alarms = array();

        for($i=0; $i<count($alarms); $i++){
            $start = $alarms[$i]["start"];
            $end = $alarms[$i]["end"];
            #echo "start=$start, end=$end\n";
            $label1 = $alarms[$i]["label01"];
            $label2 = $alarms[$i]["label02"];

            //echo "start=".$start.",end=".$end.",label1=".$label1.",label2=".$label2."\n";
            /*$start_dt = new DateTime($start, new DateTimeZone('America/Los_Angeles'));
            $end_dt = new DateTime($end, new DateTimeZone('America/Los_Angeles'));*/
            $start_dt = DateTime::createFromFormat('Y-m-d H:i:s', $start, new DateTimeZone('America/Los_Angeles'));
            $end_dt = DateTime::createFromFormat('Y-m-d H:i:s', $end, new DateTimeZone('America/Los_Angeles'));

            //for each alarm, extend the start time and end time
            $diff = 2*($end_dt->getTimestamp()-$start_dt->getTimestamp());
            $new_start = $start_dt->getTimestamp() - $diff;
            $new_end = $end_dt->getTimestamp() + $diff;

            //echo "new_start=".$new_start.",new_end=".$new_end."\n";
            
            //fetch the data for the new alarm time and end time
            $data4_label1 = $this->getTsData($user, $id, $new_start, $new_end, $label1);
            $data4_label2 = $this->getTsData($user, $id,$new_start, $new_end, $label2);
            //$data4_label1 = [];
            //$data4_label2 = [];

            //populate data and alarms array
            $alarm_set = array();
            $data_array = array();

            $pair = array($start_dt->getTimestamp(), $end_dt->getTimestamp());
            array_push($alarm_set, $pair);

            $data_obj1 = array("label" => $label1, "data" => $data4_label1);
            $data_obj2 = array("label" => $label2, "data" => $data4_label2);

            //add data
            array_push($data_array, $data_obj1);
            array_push($data_array, $data_obj2);

            //add alarms
            array_push($data_array, $alarm_set);

            array_push($data_alarms, $data_array);

        }
        //construct the return json object and return it
        return json_encode($data_alarms);
    }

    function getTsData($user, $id, $st, $et, $label){
        //echo "start=".$st."\tend=".$et."\n";
        //the time zone is ignored
        $st_date = new DateTime("@$st", new DateTimeZone('America/Los_Angeles'));
        $st_format = $st_date->format("Y/m/d H:i:s");
        $st_date2 = new DateTime($st_format, new DateTimeZone('UTC'));
        $st_date2->setTimezone(new DateTimeZone('America/Los_Angeles'));
        $st_format = $st_date2->format("Y/m/d-H:i:s");

        //the time zone is ignored
        $et_date = new DateTime("@$et", new DateTimeZone('America/Los_Angeles'));
        $et_format = $et_date->format("Y/m/d H:i:s");
        $et_date2 = new DateTime($et_format, new DateTimeZone('UTC'));
        $et_date2->setTimezone(new DateTimeZone('America/Los_Angeles'));
        $et_format = $et_date2->format("Y/m/d-H:i:s");


        $url = "http://".$this->otsdb_host.":".$this->ostdb_port."/q?start=".$st_format."&end=".$et_format."&label=".$label."&m=sum:sbs.".$user.".".$id;
        #echo 'url='.$url."\n";
        $tsdata_str = file_get_contents($url);
        //echo $tsdata_str;
        $tsdata = json_decode($tsdata_str);
        return $tsdata;
    }

    function getAlarms($user, $id){
        //query the alarms table
        $query = "select start, end, label01, label02 from alarms where username= :username and id= :id";
        $dsn  = 'mysql:dbname=sbs;host='.$this->mysql_host;

        try {
            $dbh = new PDO($dsn, "root", "root");
            $sth = $dbh->prepare($query);
            if($sth->execute(array(':username'=>$user, ':id'=>$id))){
                $rows = $sth->fetchAll();
                //print_r($rows);
                return $rows;
            }
        } catch(PDOException $e){
            echo 'Connection failed '. $e->getMessage();
        }
    }

    function getAlarms2($user, $id){
        $query = "select start, end, label01, label02 from alarms where username= '%s' and id= %d";
        $conn = mysql_connect("localhost", "root", "root");
        if(!$conn){
            die("Error::".mysql_error()."\n");
        }
        $db_selected=mysql_select_db("sbs", $conn);
        if (!$db_selected) {
            die ('Can\'t use sbs : ' . mysql_error());
        }
    }
}
?>
