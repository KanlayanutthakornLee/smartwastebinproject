
<?php
session_start();
include("../config/db.php");

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT users.*, roles.role_name
FROM users
JOIN roles ON users.role_id = roles.role_id
WHERE username='$username' AND password_hash='$password'";

$result = $conn->query($sql);

if($result->num_rows > 0){

    $row = $result->fetch_assoc();

    $_SESSION['user_id'] = $row['user_id'];
    $_SESSION['user_name'] = $row['user_name'];
    $_SESSION['role'] = $row['role_name'];

    header("Location: ../../frontend/dashboard.php");

}else{
    header("Location: ../../frontend/login.php?error=1");
}
?>
