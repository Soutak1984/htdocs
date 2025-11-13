<?php
require_once 'db.php';
$err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password, $admin['password_hash'])) {
        $_SESSION['admin_id'] = $admin['id'];
        header('Location: dashboard.php');
        exit;
    } else {
        $err = "Invalid username or password.";
    }
}
?><!doctype html>
<html><head><meta charset="utf-8"><title>Admin Login</title></head><body>
  <h2>Admin Login</h2>
  <?php if ($err) echo "<p style='color:red;'>$err</p>"; ?>
  <form method="post">
    <label>Username<input name="username" required></label><br>
    <label>Password<input name="password" type="password" required></label><br>
    <button type="submit">Login</button>
  </form>
</body></html>
