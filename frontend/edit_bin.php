
<?php
include("../backend/config/db.php");

$id = $_GET['id'];

$result = $conn->query("
SELECT * FROM bins WHERE bin_id='$id'
");

$row = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html>
<head>
<title>Edit Bin</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">

<div class="container mt-5">

<h2>Edit Bin</h2>

<form action="../backend/bins/update.php" method="post">

<input type="hidden" name="bin_id" value="<?= $row['bin_id'] ?>">

<div class="mb-3">
<label>Location ID</label>
<input type="number" name="location_id"
value="<?= $row['location_id'] ?>"
class="form-control">
</div>

<div class="mb-3">
<label>Waste Type ID</label>
<input type="number" name="waste_type_id"
value="<?= $row['waste_type_id'] ?>"
class="form-control">
</div>

<div class="mb-3">
<label>Capacity</label>
<input type="number" name="capacity"
value="<?= $row['capacity'] ?>"
class="form-control">
</div>

<button class="btn btn-success">Save</button>
<a href="bins.php" class="btn btn-secondary">Back</a>

</form>

</div>
</body>
</html>

