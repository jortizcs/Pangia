<?php
include_once ("sfslib.php");

$sfs_host = $_REQUEST["sfs_host"];
$sfs_port = $_REQUEST["sfs_port"];
$method=$_REQUEST["method"];

function get_tree(){
	global $sfs_host, $sfs_port;
	#echo "http://".$sfs_host.":".$sfs_port."/admin/listrsrcs/<br>";
	$reply = get("http://".$sfs_host.":".$sfs_port."/admin/listrsrcs/");
	if(!empty($reply) && $reply !=false){
		$reply_json = json_decode($reply, true);
		$keys = array_keys($reply_json);
		$pathToObj = array();

		for($i=0; $i<count($keys); $i++){
			$tkey = trim($keys[$i]);
			$toks = explode("/", $tkey);
			$nodeObj = array();
			if(count($toks)-2>0){
				$nodeObj["data"]=$toks[ count($toks)-2];
				$nodeObj["state"]="closed";
			} else {
				$nodeObj["data"]="/";
				$nodeObj["state"]="open";
			}
			$nodeObj["id"]=$tkey;
			$nodeObj["attr"]=array("id" => $tkey, "type" => $reply_json[$tkey]["type"]);
			$nodeObj["metadata"]=array("id" => $tkey, "type" => $reply_json[$tkey]["type"]);
			$nodeObj["children"]=array();

			#print_r($nodeObj);
			#echo $nodeObj["metadata"]["id"];
			#echo "<br><br>";
			$pathToObj[$tkey]=$nodeObj;
		}

		for($i=0; $i<count($keys); $i++){
			$tkey = trim($keys[$i]);
			$tnode = &$pathToObj[$tkey];
			$toks = explode("/",$tkey);
			$level = count($toks)-2;
			$parent="/";
			if($level>0){
				for($j=1; $j<count($toks)-2; $j++)
					$parent = $parent.$toks[$j]."/";
				$parentObj = &$pathToObj[$parent];
				if(!empty($parentObj))
					array_push($parentObj["children"], &$tnode);
			}
		}
		return json_encode($pathToObj["/"]);
		
	}
	return false;
}

function handleTSQueryResp($ts_query_resp){
	$respObj = json_decode($ts_query_resp, true);
	$respObjP["path"] = $respObj["path"];
	$dataObjs = $respObj["ts_query_results"]["results"];

	$respObjP["data"] = array();
	for($i=0; $i<count($dataObjs); $i++){
		$dataPt = array();
		$dataPt[0] = $dataObjs[$i]["timestamp"];
		$dataPt[1] = $dataObjs[$i]["Reading"];
		$respObjP["data"][$i]= $dataPt;
	}
	return json_encode($respObjP);

}

function handleTSQueryResp2($ts_query_resp){
	$respObj = json_decode($ts_query_resp, true);
	$respObjP["path"] = $respObj["path"];
	$dataObjs = $respObj["ts_query_results"];

	$respObjP["data"] = array();
	for($i=0; $i<count($dataObjs); $i++){
		$dataPt = array();
		$dataPt[0] = $dataObjs[$i]["ts"];
		$dataPt[1] = $dataObjs[$i]["value"];
		$respObjP["data"][$i]= $dataPt;
	}
	return json_encode($respObjP);

}

if(!empty($sfs_host) && !empty($sfs_port) && !empty($method)){
	$sfsconn = new SFSConnection();
	$sfsconn->setStreamFSInfo($sfs_host, $sfs_port);
	//echo "sfs_host=".$sfs_host."<br>sfs_port=".$sfs_port."<br>";

	if(strcmp($method, "get_all_resources")==0){
		echo get_tree();
	} elseif(strcmp($method, "get_path")==0){
		$path = $_REQUEST["path"];
		echo get("http://".$sfs_host.":".$sfs_port.$path);
	} elseif(strcmp($method, "create")==0){
		$parent = $_REQUEST["path"];
		$name  = $_REQUEST["rname"];
		$type = $_REQUEST["ntype"];
		$r=array();
		if(!empty($parent) && !empty($name) && !empty($type)){
			if(strcmp($type, "default")==0){
				$sfsconn->mkrsrc($parent, $name, "default");
				$r["status"]="success";
			} elseif(strcmp($type, "genpub")==0){
				$sfsconn->mkrsrc($parent, $name, "genpub");
				$r["status"]="success";
			} else {
				$r["status"]="false";
			}
			//$r["parent"]=$parent;
			//$r["child"] = $name;
		} else {
			$r["status"]="false";
		}
		sleep(1);
		echo json_encode($r);
	} elseif(strcmp($method, "delete")==0){
		$r = array();
		$path = $_REQUEST["path"];
		if(!empty($path)){
			echo json_encode(delete("http://".$sfs_host.":".$sfs_port.$path));
			//$r["status"]="success";
		} else {
			$r["status"]="fail";
			//sleep(1);
			echo json_encode($r);
		}
	} elseif(strcmp($method, "overwrite_props")==0){
		$path = $_REQUEST["path"];
		$props = $_REQUEST["props"];
		if(!empty($path) && !empty($props)){
			echo json_encode($sfsconn->overwriteProps($path, $props));
		} else {
			$r = array();
			$r["status"]="fail";
			echo json_encode($r);
		}
	} elseif(strcmp($method, "update_props")==0){
		$path = $_REQUEST["path"];
		$props = $_REQUEST["props"];
		if(!empty($path) && !empty($props)){
			echo json_encode($sfsconn->updateProps($path, $props));
		} else {
			$r = array();
			$r["status"]="fail";
			echo json_encode($r);
		}
	} elseif(strcmp($method, "changeHostPort")==0){
		$new_host = $_REQUEST["new_host"];
		$new_port = $_REQUEST["new_port"];
		if(!empty($new_port) && !empty($new_port)){
			$new_hp = array();
			$new_hp["sfs_host"]=$new_host;
			$new_hp["sfs_port"]=$new_port;
			$new_hp_str = json_encode($new_hp);
			file_put_contents("host_setup.json", $new_hp_str);
			$r= array();
			$r["status"] = "success";
			echo json_encode($r);
		} else {
			$r= array();
			$r["status"] = "fail";
			echo json_encode($r);
		}
	} elseif(strcmp($method, "tsquery")==0){
		$path = $_REQUEST["path"];
		$start_time = $_REQUEST["start_ts"];
		$end_time = $_REQUEST["end_ts"];
		$include_lower = $_REQUEST["include_lower"];
		$include_upper = $_REQUEST["include_upper"];

		if(!empty($path) && !empty($start_time) && !empty($end_time)){
			$tsq_resp_str = $sfsconn->tsRangeQuery($path, $start_time, true, $end_time, true);
			if(strlen($tsq_resp_str)>0){
				echo handleTSQueryResp2($tsq_resp_str);
			} else {
				$r = array();
				$r["status"]="fail";
				echo json_encode($r);
			}
		} else {
			$r = array();
			$r["status"] = "fail";
			echo json_encode($r);
		}
	}  elseif(strcmp($method, "create_symlink")==0){
		$path = $_REQUEST["path"];
		$target = $_REQUEST["target"];
		$linkname = $_REQUEST["linkname"];
		$r = array();
		if(!empty($path) && !empty($target) && !empty($linkname)){
			$slreply = $sfsconn->mksymlink($path, $target, $linkname);
			$r["status"]="success";
			echo json_encode($r);
		} else {
			$r["status"] = "fail";
			echo json_encode($r);
		}
	} elseif(strcmp($method, "create_sub")==0){
		$source_path = $_REQUEST["path"];
		$target = $_REQUEST["target"];
		$r = array();
		if(!empty($source_path) && !empty($target)){
			$sfsconn->createSubscription($source_path, $target);
			$r["status"]="success";
			echo json_encode($r);
		} else {
			$r["status"] = "fail";
			echo json_encode($r);
		}
	} elseif(strcmp($method, "test")==0){
		$r = array();
		$r["status"]="success";
		echo json_encode($r);
	}
}


?>
