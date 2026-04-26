
<?php
session_start();
include("../config/db.php");

$bin_id = $_GET['bin_id'];

/* user ที่กดเก็บ */
$user_id = $_SESSION['user_id'];

/* 1. บันทึกประวัติ */
$conn->query("
INSERT INTO collection_history
(bin_id, collected_by, collection_time)
VALUES
('$bin_id', '$user_id', NOW())
");

/* 2. รีเซตถัง */
$conn->query("
UPDATE bin_status
SET
fill_level = 0,
gas_level = 0,
timestamp = NOW()
WHERE bin_id = '$bin_id'
");

/* กลับหน้า status */
header("Location: ../../frontend/status.php");
exit();
?>
