<?php
require('includes/db.php');
$query = "SELECT price, name FROM domain ORDER BY RAND() LIMIT 1 ";
$result = mysqli_query($connection, $query);

echo "<pre>";
    while ($row = mysqli_fetch_row($result)) {
      var_dump($row);
      echo "<hr>";
    }
echo "</pre>";

mysqli_free_result($result);
mysqli_close($connection);
?>