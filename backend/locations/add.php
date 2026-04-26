
<?php
include("../config/db.php");

$name = $_POST['location_name'];
$zone = $_POST['zone'];

$conn->query("
INSERT INTO locations(location_name,zone)
VALUES('$name','$zone')
");

header("Location: ../../frontend/locations.php");
?>
