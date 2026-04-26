
<?php
include("../backend/config/db.php");

$id = $_GET['id'];

$q = $conn->query("
SELECT * FROM bin_status
WHERE bin_id='$id'
");

$row = $q->fetch_assoc();
?>

<!DOCTYPE html>
<html>
<head>
<title>Edit Sensor</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">

<div class="container mt-5">

<h2>Edit Sensor Data</h2>

<form action="../backend/status/update.php" method="post">

<input type="hidden" name="bin_id" value="<?= $row['bin_id'] ?>">

<div class="mb-3">
<label>Fill Level %</label>
<input type="number" step="0.1"
name="fill_level"
value="<?= $row['fill_level'] ?>"
class="form-control">
</div>

<div class="mb-3">
<label>Gas Level</label>
<input type="number" step="0.1"
name="gas_level"
value="<?= $row['gas_level'] ?>"
class="form-control">
</div>

<button class="btn btn-success">Save</button>
<a href="status.php" class="btn btn-secondary">Back</a>

</form>

</div>
</body>
</html>

