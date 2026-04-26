
<?php
include("../config/db.php");

$id   = $_POST['bin_id'];
$fill = $_POST['fill_level'];
$gas  = $_POST['gas_level'];

$conn->query("
UPDATE bin_status
SET
fill_level='$fill',
gas_level='$gas',
timestamp=NOW()
WHERE bin_id='$id'
");

header("Location: ../../frontend/status.php");
?>

