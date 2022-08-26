<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$mysqli = new mysqli("localhost","blood33a_access","access12345","blood33a_access");

if ($mysqli -> connect_errno) {
  echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
  exit();
}

$sql = "SELECT created_date FROM tbl_temperature";

if ($result = $mysqli -> query($sql)) {
  while ($row = $result -> fetch_row()) {
    printf ("%s (%s)\n", $row[0], $row[1]);
  }
  $result -> free_result();
}

$mysqli -> close();


?>



