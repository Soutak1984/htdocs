<?php
// --- Admin Login Script ---
session_start();

// Change these credentials to your own
$admin_user = "admin";
$admin_pass = "1234";

// If already logged in
if (isset($_SESSION['admin_logged_in'])) {
    header("Location: dashboard.php");
    exit;
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user = $_POST["username"] ?? "";
    $pass = $_POST["password"] ?? "";
    if ($user === $admin_user && $pass === $admin_pass) {
        $_SESSION["admin_logged_in"] = true;
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Invalid username or password";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | Circuit Supplier</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            font-family: "Roboto", sans-serif;
            background: linear-gradient(135deg, #0c1435, #1a2a6c);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .login-box {
            background: rgba(255,255,255,0.1);
            padding: 40px 30px;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            width: 320px;
            text-align: center;
        }
        h2 {
            margin-bottom: 25px;
            color: #ffcc00;
            letter-spacing: 1px;
        }
        input[type="text"], input[type="password"] {
            width: 90%;
            padding: 10px;
            margin: 10px 0;
            border: none;
            border-radius: 6px;
            background: rgba(255,255,255,0.2);
            color: white;
            font-size: 15px;
        }
        input::placeholder {
            color: rgba(255,255,255,0.6);
        }
        button {
            background: #ffcc00;
            border: none;
            color: #0c1435;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 15px;
        }
        button:hover {
            background: #ffd633;
        }
        .error {
            color: #ff7777;
            font-size: 14px;
        }
        a.back-home {
            display: block;
            margin-top: 15px;
            color: #ccc;
            text-decoration: none;
            font-size: 14px;
        }
        a.back-home:hover {
            color: #fff;
        }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>Admin Login</h2>
        <?php if (!empty($error)) echo "<p class='error'>$error</p>"; ?>
        <form method="POST">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
        <a class="back-home" href="/">← Back to Home</a>
    </div>
</body>
</html>
