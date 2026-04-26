
<?php
include("../config/db.php");

$id = $_POST['bin_id'];
$capacity = $_POST['capacity'];

$conn->query("
UPDATE bins
SET capacity='$capacity'
WHERE bin_id='$id'
");

header("Location: ../../frontend/bins.php");
?>