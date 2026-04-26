
<?php
session_start();
if(!isset($_SESSION['user_id'])){
header("Location: login.php");
exit();
}

include("../backend/config/db.php");

$sql = "
SELECT bins.*, locations.location_name, waste_types.type_name
FROM bins
JOIN locations ON bins.location_id = locations.location_id
JOIN waste_types ON bins.waste_type_id = waste_types.waste_type_id
ORDER BY bin_id ASC
";

$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Manage Bins</title>

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

.box{
background:rgba(255,255,255,.12);
backdrop-filter:blur(12px);
padding:25px;
border-radius:18px;
box-shadow:0 10px 25px rgba(0,0,0,.15);
margin-bottom:25px;
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

<h2>Manage Bins 🗑</h2>
<p>Add / Edit / Delete Bin Information</p>

<div class="box">

<form action="../backend/bins/add.php" method="post" class="row g-3">

<div class="col-md-4">
<input type="number" name="location_id"
class="form-control"
placeholder="Location ID" required>
</div>

<div class="col-md-4">
<input type="number" name="waste_type_id"
class="form-control"
placeholder="Waste Type ID" required>
</div>

<div class="col-md-4">
<input type="number" name="capacity"
class="form-control"
placeholder="Capacity" required>
</div>

<div class="col-12">
<button class="btn btn-success">
+ Add Bin
</button>
</div>

</form>

</div>

<table class="table table-bordered">

<tr>
<th>ID</th>
<th>Location</th>
<th>Type</th>
<th>Capacity</th>
<th>Action</th>
</tr>

<?php while($row=$result->fetch_assoc()): ?>

<tr>
<td><?= $row['bin_id'] ?></td>
<td><?= $row['location_name'] ?></td>
<td><?= $row['type_name'] ?></td>
<td><?= $row['capacity'] ?></td>

<td>

<a href="edit_bin.php?id=<?= $row['bin_id'] ?>"
class="btn btn-warning btn-sm">
Edit
</a>

<a href="../backend/bins/delete.php?id=<?= $row['bin_id'] ?>"
class="btn btn-danger btn-sm"
onclick="return confirm('Delete this bin?')">
Delete
</a>

</td>

</tr>

<?php endwhile; ?>

</table>

</div>

</body>
</html>
