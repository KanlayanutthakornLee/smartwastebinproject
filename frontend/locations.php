
<?php
session_start();
if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

include("../backend/config/db.php");

/* search */
$search = $_GET['search'] ?? '';

$where = "";
if($search != ''){
    $where = "WHERE location_name LIKE '%$search%' OR zone LIKE '%$search%'";
}

/* data */
$result = $conn->query("
SELECT *
FROM locations
$where
ORDER BY location_id ASC
");

/* KPI */
$total = $conn->query("SELECT COUNT(*) c FROM locations")->fetch_assoc()['c'];
$zoneA = $conn->query("SELECT COUNT(*) c FROM locations WHERE zone='A'")->fetch_assoc()['c'];
$zoneB = $conn->query("SELECT COUNT(*) c FROM locations WHERE zone='B'")->fetch_assoc()['c'];
$other = $total - $zoneA - $zoneB;
?>

<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Locations</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<style>

body{
margin:0;
font-family:Segoe UI;
background:linear-gradient(135deg,#0f172a,#1e293b,#0ea5e9);
min-height:100vh;
}

/* Main */
.main{
margin-left:260px;
padding:30px;
color:white;
}

/* Cards */
.glass{
background:rgba(255,255,255,.12);
backdrop-filter:blur(12px);
padding:22px;
border-radius:18px;
box-shadow:0 10px 25px rgba(0,0,0,.15);
}

.num{
font-size:34px;
font-weight:800;
}

/* Table */
.table-box{
background:white;
border-radius:18px;
overflow:hidden;
box-shadow:0 10px 20px rgba(0,0,0,.08);
}

.table thead{
background:#0f172a;
color:white;
}

.table td, .table th{
vertical-align:middle;
}

input,select{
border-radius:12px !important;
}

.btn{
border-radius:10px;
}

</style>
</head>

<body>

<?php include("includes/sidebar.php"); ?>

<div class="main">

<h1>📍 Locations Management</h1>
<p>Manage bin placement areas</p>

<!-- KPI -->
<div class="row g-4 mt-2">

<div class="col-md-3">
<div class="glass">
<div>Total Locations</div>
<div class="num"><?= $total ?></div>
</div>
</div>

<div class="col-md-3">
<div class="glass">
<div>Zone A</div>
<div class="num text-success"><?= $zoneA ?></div>
</div>
</div>

<div class="col-md-3">
<div class="glass">
<div>Zone B</div>
<div class="num text-warning"><?= $zoneB ?></div>
</div>
</div>

<div class="col-md-3">
<div class="glass">
<div>Other</div>
<div class="num text-info"><?= $other ?></div>
</div>
</div>

</div>

<!-- Add Form -->
<div class="glass mt-4">

<h4>Add New Location</h4>

<form action="../backend/locations/add.php" method="post">

<div class="row g-3">

<div class="col-md-7">
<input type="text" name="location_name" class="form-control"
placeholder="Location Name" required>
</div>

<div class="col-md-3">
<input type="text" name="zone" class="form-control"
placeholder="Zone" required>
</div>

<div class="col-md-2 d-grid">
<button class="btn btn-success">＋ Add</button>
</div>

</div>
</form>

</div>

<!-- Search -->
<div class="glass mt-4">

<form method="get">
<div class="row g-3">

<div class="col-md-10">
<input type="text" name="search"
value="<?= $search ?>"
class="form-control"
placeholder="Search location / zone">
</div>

<div class="col-md-2 d-grid">
<button class="btn btn-primary">Search</button>
</div>

</div>
</form>

</div>

<!-- Table -->
<div class="table-box mt-4">

<table class="table table-hover mb-0">

<thead>
<tr>
<th>ID</th>
<th>Location Name</th>
<th>Zone</th>
<th width="220">Action</th>
</tr>
</thead>

<tbody>

<?php while($row = $result->fetch_assoc()): ?>

<tr>

<td><?= $row['location_id'] ?></td>

<td><?= $row['location_name'] ?></td>

<td>
<span class="badge bg-primary">
<?= $row['zone'] ?>
</span>
</td>

<td>

<a href="edit_location.php?id=<?= $row['location_id'] ?>"
class="btn btn-warning btn-sm">
Edit
</a>

<a href="../backend/locations/delete.php?id=<?= $row['location_id'] ?>"
class="btn btn-danger btn-sm"
onclick="return confirm('Delete this location?')">
Delete
</a>

</td>

</tr>

<?php endwhile; ?>

</tbody>
</table>

</div>

</div>
</body>
</html>
