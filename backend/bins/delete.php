
<?php
include("../config/db.php");

$id = $_GET['id'];

/* ลบ status */
$conn->query("
DELETE FROM bin_status
WHERE bin_id='$id'
");

/* ลบถัง */
$conn->query("
DELETE FROM bins
WHERE bin_id='$id'
");

header("Location: ../../frontend/bins.php");
?>

