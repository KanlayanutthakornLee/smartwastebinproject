
<?php
session_start();

if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

include("../backend/config/db.php");

/* KPI */
$totalBins = $conn->query("SELECT COUNT(*) c FROM bins")->fetch_assoc()['c'];

$fullBins = $conn->query("
SELECT COUNT(*) c
FROM bin_status
WHERE fill_level >= 80
")->fetch_assoc()['c'];

$warningBins = $conn->query("
SELECT COUNT(*) c
FROM bin_status
WHERE fill_level >= 50 AND fill_level < 80
")->fetch_assoc()['c'];

$normalBins = $totalBins - $fullBins - $warningBins;

/* Chart */
$chart = $conn->query("
SELECT bins.bin_id,
IFNULL(bin_status.fill_level,0) AS fill_level
FROM bins
LEFT JOIN bin_status ON bins.bin_id = bin_status.bin_id
ORDER BY bins.bin_id ASC
");

$data = [];
while($row = $chart->fetch_assoc()){
    $data[] = $row;
}
?>

<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="10">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Dashboard</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>

body{
margin:0;
font-family:Segoe UI;
background:linear-gradient(135deg,#0f172a,#1e293b,#0ea5e9);
min-height:100vh;
}

/* Sidebar */
.sidebar{
width:250px;
height:100vh;
position:fixed;
top:0;
left:0;
background:#0f172a;
padding:25px;
box-shadow:5px 0 20px rgba(0,0,0,.2);
}

.logo{
color:white;
font-size:32px;
font-weight:800;
margin-bottom:30px;
}

.sidebar a{
display:block;
color:#cbd5e1;
padding:12px;
margin-bottom:8px;
border-radius:12px;
text-decoration:none;
transition:.2s;
}

.sidebar a:hover{
background:#1e293b;
color:white;
}

/* Main */
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
font-size:34px;
font-weight:800;
}

.chart-box{
background:white;
border-radius:18px;
padding:20px;
box-shadow:0 10px 20px rgba(0,0,0,.08);
}

</style>

</head>
<body>

<!-- Sidebar -->
<div class="sidebar">

<div class="logo">♻ SmartWaste</div>

<a href="dashboard.php">📊 Dashboard</a>
<a href="bins.php">🗑 Manage Bins</a>
<a href="status.php">📡 Sensor Status</a>
<a href="history.php">📜 History</a>
<a href="locations.php">📍 Locations</a>
<a href="waste_types.php">♻ Waste Types</a>
<a href="users.php">👤 Users</a>
<a href="report.php">📈 Reports</a>
<a href="../backend/auth/logout.php">🚪 Logout</a>

</div>

<!-- Main -->
<div class="main">

<h1>Welcome, <?= $_SESSION['user_name']; ?> 👋</h1>
<p>Waste Management Control Center</p>

<!-- KPI -->
<div class="row g-4 mt-2">

<div class="col-md-3">
<div class="card-box">
<div>Total Bins</div>
<div class="number"><?= $totalBins ?></div>
</div>
</div>

<div class="col-md-3">
<div class="card-box">
<div>Full Bins</div>
<div class="number text-danger"><?= $fullBins ?></div>
</div>
</div>

<div class="col-md-3">
<div class="card-box">
<div>Warning</div>
<div class="number text-warning"><?= $warningBins ?></div>
</div>
</div>

<div class="col-md-3">
<div class="card-box">
<div>Normal</div>
<div class="number text-success"><?= $normalBins ?></div>
</div>
</div>

</div>

<!-- Chart -->
<div class="chart-box mt-4">

<h4 class="mb-3 text-dark">Fill Level Analytics</h4>

<canvas id="myChart"></canvas>

</div>

</div>

<script>

new Chart(document.getElementById('myChart'),{
type:'bar',
data:{
labels:[
<?php foreach($data as $r): ?>
'Bin <?= $r['bin_id'] ?>',
<?php endforeach; ?>
],
datasets:[{
label:'Fill Level %',
data:[
<?php foreach($data as $r): ?>
<?= $r['fill_level'] ?>,
<?php endforeach; ?>
],
borderWidth:1
}]
},
options:{
responsive:true,
scales:{
y:{
beginAtZero:true,
max:100
}
}
}
});

</script>

</body>
</html>
