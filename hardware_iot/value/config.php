<?php 


define('DB_HOST'    , 'localhost'); 
define('DB_USERNAME', 'blood33a_access'); 
define('DB_PASSWORD', 'access12345'); 
define('DB_NAME'    , 'blood33a_access');

define('POST_DATA_URL', 'https://bloodanytime.com/value/sensordata.php');

//PROJECT_API_KEY is the exact duplicate of, PROJECT_API_KEY in NodeMCU sketch file
//Both values must be same
define('PROJECT_API_KEY', 'value');


//set time zone for your country
date_default_timezone_set('Asia/Karachi');

// Connect with the database 
$db = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME); 
 
// Display error if failed to connect 
if ($db->connect_errno) { 
    echo "Connection to database is failed: ".$db->connect_error;
    exit();
}
