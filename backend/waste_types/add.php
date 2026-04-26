
<?php
include("../config/db.php");

$type = $_POST['type_name'];

$conn->query("
INSERT INTO waste_types(type_name)
VALUES('$type')
");

header("Location: ../../frontend/waste_types.php");
?>

