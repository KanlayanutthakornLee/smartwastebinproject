
<?php
session_start();
if(!isset($_SESSION['user_id'])){
header("Location: login.php");
exit();
}

include("../backend/config/db.php");

/* ตารางข้อมูล */
$sql = "
SELECT bins.bin_id,
locations.location_name,
bin_status.fill_level,
bin_status.gas_level
FROM bin_status
JOIN bins ON bin_status.bin_id = bins.bin_id
JOIN locations ON bins.location_id = locations.location_id
ORDER BY bins.bin_id ASC
";

$result = $conn->query($sql);

/* KPI */
$total = $conn->query("SELECT COUNT(*) c FROM bins")->fetch_assoc()['c'];

$full = $conn->query("
SELECT COUNT(*) c FROM bin_status
WHERE fill_level >= 80
")->fetch_assoc()['c'];

$warning = $conn->query("
SELECT COUNT(*) c FROM bin_status
WHERE fill_level >=50 AND fill_level <80
")->fetch_assoc()['c'];

$normal = $total - $full - $warning;
?>

<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="10">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Sensor Status</title>

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

.table{
background:white;
border-radius:15px;
overflow:hidden;
}

.table th{
background:#0f172a;
color:white;
}

.blink{
animation:blink .9s infinite;
}

@keyframes blink{
50%{opacity:.35;}
}

</style>

</head>
<body>

<?php include("includes/sidebar.php"); ?>

<div class="main">

<h2>📡 Sensor Control Center</h2>
<p>Live Monitoring Waste Bin Sensors</p>

<div class="row g-4 mt-2">

<div class="col-md-3">
<div class="card-box">
<div>Total Bins</div>
<div class="number"><?= $total ?></div>
</div>
</div>

<div class="col-md-3">
<div class="card-box">
<div>FULL</div>
<div class="number text-danger"><?= $full ?></div>
</div>
</div>

<div class="col-md-3">
<div class="card-box">
<div>Warning</div>
<div class="number text-warning"><?= $warning ?></div>
</div>
</div>

<div class="col-md-3">
<div class="card-box">
<div>Normal</div>
<div class="number text-success"><?= $normal ?></div>
</div>
</div>

</div>

<table class="table table-bordered mt-4">

<tr>
<th>Bin</th>
<th>Location</th>
<th>Fill</th>
<th>Gas</th>
<th>Status</th>
<th>Action</th>
</tr>

<?php while($row=$result->fetch_assoc()): ?>

<?php
if($row['fill_level'] >= 80){
$status = "<span class='badge bg-danger blink'>FULL</span>";
}elseif($row['fill_level'] >= 50){
$status = "<span class='badge bg-warning text-dark'>WARNING</span>";
}else{
$status = "<span class='badge bg-success'>NORMAL</span>";
}
?>

<tr>

<td><?= $row['bin_id'] ?></td>
<td><?= $row['location_name'] ?></td>
<td><?= $row['fill_level'] ?>%</td>
<td><?= $row['gas_level'] ?></td>
<td><?= $status ?></td>

<td>

<a href="edit_status.php?id=<?= $row['bin_id'] ?>"
class="btn btn-warning btn-sm">
Edit
</a>

<a href="../backend/history/add.php?bin_id=<?= $row['bin_id'] ?>"
class="btn btn-success btn-sm"
onclick="return confirm('Collect this bin?')">
Collect
</a>

</td>

</tr>

<?php endwhile; ?>

</table>

</div>
</body>
</html>

