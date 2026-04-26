
<?php
include("../config/db.php");

$id = $_GET['id'];

$conn->query("DELETE FROM locations WHERE location_id='$id'");

header("Location: ../../frontend/locations.php");
?>

