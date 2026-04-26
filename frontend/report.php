
<?php
session_start();
if(!isset($_SESSION['user_id'])){
header("Location: login.php");
exit();
}

include("../backend/config/db.php");

/* KPI */
$totalBins = $conn->query("
SELECT COUNT(*) c FROM bins
")->fetch_assoc()['c'];

$full = $conn->query("
SELECT COUNT(*) c FROM bin_status
WHERE fill_level >= 80
")->fetch_assoc()['c'];

$warning = $conn->query("
SELECT COUNT(*) c FROM bin_status
WHERE fill_level >=50 AND fill_level <80
")->fetch_assoc()['c'];

$normal = $totalBins - $full - $warning;

$totalHistory = $conn->query("
SELECT COUNT(*) c FROM collection_history
")->fetch_assoc()['c'];

/* เก็บย้อนหลัง 7 วัน */
$history = $conn->query("
SELECT DATE(collection_time) d,
COUNT(*) total
FROM collection_history
GROUP BY DATE(collection_time)
ORDER BY DATE(collection_time) ASC
LIMIT 7
");
?>

<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="15">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Reports</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

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

.chart-box{
background:white;
border-radius:18px;
padding:20px;
box-shadow:0 10px 20px rgba(0,0,0,.08);
}

</style>

</head>
<body>

<?php include("includes/sidebar.php"); ?>

<div class="main">

<h2>📈 Reports Dashboard</h2>
<p>Executive Summary & Analytics</p>

<div class="row g-4 mt-2">

<div class="col-md-3">
<div class="card-box">
<div>Total Bins</div>
<div class="number"><?= $totalBins ?></div>
</div>
</div>

<div class="col-md-3">
<div class="card-box">
<div>Collections</div>
<div class="number text-success"><?= $totalHistory ?></div>
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

</div>

<div class="row g-4 mt-3">

<div class="col-md-6">
<div class="chart-box">
<h5>Status Overview</h5>
<canvas id="pieChart"></canvas>
</div>
</div>

<div class="col-md-6">
<div class="chart-box">
<h5>Collection Activity</h5>
<canvas id="barChart"></canvas>
</div>
</div>

</div>

</div>

<script>

/* Pie */
new Chart(document.getElementById('pieChart'),{
type:'pie',
data:{
labels:['Normal','Warning','Full'],
datasets:[{
data:[
<?= $normal ?>,
<?= $warning ?>,
<?= $full ?>
]
}]
}
});

/* Bar */
new Chart(document.getElementById('barChart'),{
type:'bar',
data:{
labels:[
<?php
$data=[];
while($row=$history->fetch_assoc()){
$data[]=$row;
?>
'<?= $row['d'] ?>',
<?php } ?>
],
datasets:[{
label:'Collections',
data:[
<?php foreach($data as $r): ?>
<?= $r['total'] ?>,
<?php endforeach; ?>
]
}]
},
options:{
scales:{
y:{beginAtZero:true}
}
}
});

</script>

</body>
</html>
