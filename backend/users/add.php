
<?php
include("../config/db.php");

$user_name = $_POST['user_name'];
$username = $_POST['username'];
$password = $_POST['password_hash'];
$role_id = $_POST['role_id'];

$conn->query("
INSERT INTO users(user_name,username,password_hash,role_id)
VALUES('$user_name','$username','$password','$role_id')
");

header("Location: ../../frontend/users.php");
?>
