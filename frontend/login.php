
<?php session_start(); ?>

<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>SmartWaste Login</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<style>

body{
    margin:0;
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:linear-gradient(135deg,#0f172a,#1e293b,#0ea5e9);
    font-family:Segoe UI, Arial, sans-serif;
}

.login-box{
    width:400px;
    background:rgba(255,255,255,.12);
    backdrop-filter:blur(15px);
    border:1px solid rgba(255,255,255,.2);
    border-radius:22px;
    padding:35px;
    box-shadow:0 20px 40px rgba(0,0,0,.25);
    color:white;
}

.logo{
    font-size:42px;
    text-align:center;
    margin-bottom:10px;
}

.title{
    text-align:center;
    font-size:28px;
    font-weight:700;
}

.subtitle{
    text-align:center;
    color:#dbeafe;
    margin-bottom:25px;
    font-size:14px;
}

.form-control{
    height:48px;
    border-radius:12px;
    border:none;
    margin-bottom:15px;
}

.btn-login{
    width:100%;
    height:48px;
    border:none;
    border-radius:12px;
    background:#10b981;
    color:white;
    font-weight:700;
    transition:.2s;
}

.btn-login:hover{
    background:#059669;
}

.footer{
    text-align:center;
    margin-top:18px;
    font-size:13px;
    color:#cbd5e1;
}

.alert{
    border-radius:12px;
}

</style>

</head>
<body>

<div class="login-box">

<div class="logo">♻</div>

<div class="title">SmartWaste</div>
<div class="subtitle">Waste Management Platform</div>

<?php if(isset($_GET['error'])): ?>
<div class="alert alert-danger">
Invalid Username or Password
</div>
<?php endif; ?>

<form action="../backend/auth/login.php" method="post">

<input type="text"
name="username"
class="form-control"
placeholder="Username"
required>

<input type="password"
name="password"
class="form-control"
placeholder="Password"
required>

<button type="submit" class="btn-login">
Login
</button>

</form>

<div class="footer">
© 2026 SmartWaste System
</div>

</div>

</body>
</html>

