
<?php
include("../config/db.php");

$id = $_GET['id'];

$conn->query("DELETE FROM waste_types WHERE waste_type_id='$id'");

header("Location: ../../frontend/waste_types.php");
?>