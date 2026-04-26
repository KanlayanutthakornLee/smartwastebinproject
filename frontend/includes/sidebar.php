```php id="sidebarfixedfull"
<style>

.sidebar{
width:250px;
height:100vh;
position:fixed;
top:0;
left:0;
background:#0f172a;
padding:25px;
box-shadow:5px 0 25px rgba(0,0,0,.25);
z-index:999;
}

.logo{
color:white;
font-size:30px;
font-weight:800;
margin-bottom:30px;
}

.sidebar a{
display:block;
padding:13px 15px;
margin-bottom:10px;
border-radius:12px;
text-decoration:none;
color:#cbd5e1;
font-weight:500;
transition:0.2s;
}

.sidebar a:hover{
background:#1e293b;
color:white;
transform:translateX(4px);
}

.sidebar a.active{
background:#2563eb;
color:white;
}

</style>

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
```
