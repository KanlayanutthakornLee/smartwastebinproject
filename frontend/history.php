
<?php
session_start();
if(!isset($_SESSION['user_id'])){
header("Location: login.php");
exit();
}

include("../backend/config/db.php");

/* ตาราง */
$sql = "
SELECT
collection_history.collection_id,
bins.bin_id,
users.user_name,
collection_history.collection_time
FROM collection_history
JOIN bins ON collection_history.bin_id = bins.bin_id
JOIN users ON collection_history.collected_by = users.user_id
ORDER BY collection_history.collection_id DESC
";

$result = $conn->query($sql);

/* KPI */
$total = $conn->query("
SELECT COUNT(*) c FROM collection_history
")->fetch_assoc()['c'];

$today = $conn->query("
SELECT COUNT(*) c
FROM collection_history
WHERE DATE(collection_time)=CURDATE()
")->fetch_assoc()['c'];

$users = $conn->query("
SELECT COUNT(DISTINCT collected_by) c
FROM collection_history
")->fetch_assoc()['c'];
?>

<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="15">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Collection History</title>

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

</style>

</head>
<body>

<?php include("includes/sidebar.php"); ?>

<div class="main">

<h2>📜 Collection History</h2>
<p>Waste Collection Activity Log</p>

<div class="row g-4 mt-2">

<div class="col-md-4">
<div class="card-box">
<div>Total Collections</div>
<div class="number"><?= $total ?></div>
</div>
</div>

<div class="col-md-4">
<div class="card-box">
<div>Today</div>
<div class="number text-success"><?= $today ?></div>
</div>
</div>

<div class="col-md-4">
<div class="card-box">
<div>Active Staff</div>
<div class="number text-warning"><?= $users ?></div>
</div>
</div>

</div>

<table class="table table-bordered mt-4">

<tr>
<th>ID</th>
<th>Bin</th>
<th>Collected By</th>
<th>Date / Time</th>
<th>Status</th>
</tr>

<?php while($row=$result->fetch_assoc()): ?>

<tr>

<td><?= $row['collection_id'] ?></td>
<td>Bin <?= $row['bin_id'] ?></td>
<td><?= $row['user_name'] ?></td>
<td><?= $row['collection_time'] ?></td>
<td>
<span class="badge bg-success">
Completed
</span>
</td>

</tr>

<?php endwhile; ?>

</table>

</div>
</body>
</html>
