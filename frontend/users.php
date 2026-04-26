
<?php
session_start();
if(!isset($_SESSION['user_id'])){
header("Location: login.php");
exit();
}

include("../backend/config/db.php");

$sql = "
SELECT users.*, roles.role_name
FROM users
JOIN roles ON users.role_id = roles.role_id
ORDER BY user_id ASC
";

$result = $conn->query($sql);

/* KPI */
$total = $conn->query("
SELECT COUNT(*) c FROM users
")->fetch_assoc()['c'];

$admin = $conn->query("
SELECT COUNT(*) c FROM users
WHERE role_id = 1
")->fetch_assoc()['c'];

$staff = $total - $admin;
?>

<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="20">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Users</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<style>

body{
margin:0;
font-family:Segoe UI;
background:linear-gradient(135deg,#0f172a,#1e293b,#0ea5e9);
min-height:100vh;
}

.sidebar{
width:250px;
height:100vh;
position:fixed;
left:0;
top:0;
padding:25px;
background:rgba(255,255,255,.08);
backdrop-filter:blur(14px);
}

.sidebar h3{
color:white;
text-align:center;
margin-bottom:30px;
font-weight:700;
}

.sidebar a{
display:block;
color:white;
text-decoration:none;
padding:12px;
margin-bottom:8px;
border-radius:12px;
}

.sidebar a:hover{
background:rgba(255,255,255,.15);
}

.main{
margin-left:260px;
padding:30px;
color:white;
}

.card-box{
background:rgba(255,255,255,.12);
backdrop-filter:blur(12px);
padding:22px;
border-radius:18px;
box-shadow:0 10px 25px rgba(0,0,0,.15);
}

.number{
font-size:32px;
font-weight:800;
}

.form-box{
background:rgba(255,255,255,.12);
padding:22px;
border-radius:18px;
margin-top:20px;
}

.table{
background:white;
border-radius:15px;
overflow:hidden;
}

.table th{
background:#0f172a;
color:white;
}

</style>

</head>
<body>

<?php include("includes/sidebar.php"); ?>

<div class="main">

<h2>👤 User Management</h2>
<p>Manage System Accounts & Permissions</p>

<div class="row g-4 mt-2">

<div class="col-md-4">
<div class="card-box">
<div>Total Users</div>
<div class="number"><?= $total ?></div>
</div>
</div>

<div class="col-md-4">
<div class="card-box">
<div>Admins</div>
<div class="number text-warning"><?= $admin ?></div>
</div>
</div>

<div class="col-md-4">
<div class="card-box">
<div>Staff</div>
<div class="number text-success"><?= $staff ?></div>
</div>
</div>

</div>

<div class="form-box">

<h5>Add New User</h5>

<form action="../backend/users/add.php" method="post" class="row g-3 mt-1">

<div class="col-md-3">
<input type="text" name="user_name" class="form-control" placeholder="Full Name" required>
</div>

<div class="col-md-3">
<input type="text" name="username" class="form-control" placeholder="Username" required>
</div>

<div class="col-md-3">
<input type="text" name="password_hash" class="form-control" placeholder="Password" required>
</div>

<div class="col-md-2">
<select name="role_id" class="form-control">
<option value="1">Admin</option>
<option value="2">Staff</option>
</select>
</div>

<div class="col-md-1">
<button class="btn btn-success w-100">+</button>
</div>

</form>

</div>

<table class="table table-bordered mt-4">

<tr>
<th>ID</th>
<th>Name</th>
<th>Username</th>
<th>Role</th>
<th>Action</th>
</tr>

<?php while($row=$result->fetch_assoc()): ?>

<tr>

<td><?= $row['user_id'] ?></td>
<td><?= $row['user_name'] ?></td>
<td><?= $row['username'] ?></td>

<td>
<?php if($row['role_name']=="Admin"): ?>
<span class="badge bg-warning text-dark">Admin</span>
<?php else: ?>
<span class="badge bg-success">Staff</span>
<?php endif; ?>
</td>

<td>

<a href="edit_user.php?id=<?= $row['user_id'] ?>"
class="btn btn-warning btn-sm">
Edit
</a>

<a href="../backend/users/delete.php?id=<?= $row['user_id'] ?>"
class="btn btn-danger btn-sm"
onclick="return confirm('Delete this user?')">
Delete
</a>

</td>

</tr>

<?php endwhile; ?>

</table>

</div>
</body>
</html>
