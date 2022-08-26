<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-headers: *");
header('Content-Type: application/json; charset=utf-8');

require 'config.php';

$sql = "SELECT temperature,humidity,created_date FROM tbl_temperature";
$result = $db->query($sql);
if (!$result) {
  { echo "Error: " . $sql . "<br>" . $db->error; }
}

$row = $result->fetch_assoc();

//$rows = $result -> fetch_all(MYSQLI_ASSOC);
//print_r($row);

//header('Content-Type: application/json');
 
//$table=array(0=>array('Label','Value'),1=>array('Temperature',$row));


echo json_encode($row);





?>
