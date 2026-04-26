
<?php
$conn = new mysqli("localhost", "root", "", "smartwastebin");

if ($conn->connect_error) {
    die("Database Connection Failed");
}
?>

