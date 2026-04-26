
<?php
include("../config/db.php");

$location_id   = $_POST['location_id'];
$waste_type_id = $_POST['waste_type_id'];
$capacity      = $_POST['capacity'];

/* เพิ่มถัง */
$conn->query("
INSERT INTO bins(location_id,waste_type_id,capacity)
VALUES('$location_id','$waste_type_id','$capacity')
");

/* id ล่าสุด */
$bin_id = $conn->insert_id;

/* สร้าง status เริ่มต้น */
$conn->query("
INSERT INTO bin_status(bin_id,fill_level,gas_level)
VALUES('$bin_id',0,0)
");

header("Location: ../../frontend/bins.php");
?>

