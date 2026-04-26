
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
    $where = "WHERE type_name LIKE '%$search%'";
}

$result = $conn->query("
SELECT *
FROM waste_types
$where
ORDER BY waste_type_id ASC
");

/* KPI */
$total = $conn->query("SELECT COUNT(*) c FROM waste_types")->fetch_assoc()['c'];
?>

<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Waste Types</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<style>

body{
margin:0;
font-family:Segoe UI;
background:linear-gradient(135deg,#0f172a,#1e293b,#0ea5e9);
min-height:100vh;
}

.main{
margin-left:260px;
padding:30px;
color:white;
}

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

.btn{
border-radius:10px;
}

input{
border-radius:12px !important;
}

</style>
</head>

<body>

<?php include("includes/sidebar.php"); ?>

<div class="main">

<h1>♻ Waste Types Management</h1>
<p>Manage categories of waste bins</p>

<!-- KPI -->
<div class="row g-4 mt-2">

<div class="col-md-4">
<div class="glass">
<div>Total Waste Types</div>
<div class="num"><?= $total ?></div>
</div>
</div>

</div>

<!-- Add -->
<div class="glass mt-4">

<h4>Add New Waste Type</h4>

<form action="../backend/waste_types/add.php" method="post">

<div class="row g-3">

<div class="col-md-10">
<input type="text"
name="type_name"
class="form-control"
placeholder="Waste Type Name"
required>
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
<input type="text"
name="search"
value="<?= $search ?>"
class="form-control"
placeholder="Search waste type">
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
<th>Waste Type</th>
<th width="220">Action</th>
</tr>
</thead>

<tbody>

<?php while($row = $result->fetch_assoc()): ?>

<tr>

<td><?= $row['waste_type_id'] ?></td>

<td><?= $row['type_name'] ?></td>

<td>

<a href="edit_waste_type.php?id=<?= $row['waste_type_id'] ?>"
class="btn btn-warning btn-sm">
Edit
</a>

<a href="../backend/waste_types/delete.php?id=<?= $row['waste_type_id'] ?>"
class="btn btn-danger btn-sm"
onclick="return confirm('Delete this waste type?')">
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
