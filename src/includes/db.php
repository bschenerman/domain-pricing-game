<?php
    require('_secret.php');

    $checkHost = $_SERVER['HTTP_HOST'];
    if($checkHost == 'localhost:8080'){
      $dbhost = "localhost";
      $dbuser = "root";
      $dbpass = "";
      $dbname = "a11y";
    }else{
      $dbhost = $dbhostRemote;
      $dbuser = $dbuserRemote;
      $dbpass = $dbpassRemote;
      $dbname = $dbnameRemote;
    }
    
    
    $connection = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
  
    if (mysqli_connect_errno()) {
        die("Database connection failed: " .
          mysqli_connect_error() .
          " (" . mysqli_connect_errno() . ")"
        );
    }
  
    mysqli_query($connection, "SET NAMES 'utf8'");
?>