
<?php
include("../config/db.php");

$id = $_POST['bin_id'];
$location = $_POST['location_id'];
$type = $_POST['waste_type_id'];
$capacity = $_POST['capacity'];

$conn->query("
UPDATE bins
SET
location_id='$location',
waste_type_id='$type',
capacity='$capacity'
WHERE bin_id='$id'
");

header("Location: ../../frontend/bins.php");
?>
