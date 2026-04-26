
<?php
include("../config/db.php");

$id = $_GET['id'];

$conn->query("DELETE FROM users WHERE user_id='$id'");

header("Location: ../../frontend/users.php");
?>

