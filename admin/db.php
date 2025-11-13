<?php
// admin/db.php
session_start();

define('DB_HOST', 'localhost');
define('DB_NAME', 'u999069095_elec_db');
define('DB_USER', 'u999069095_myadmin123');
define('DB_PASS', 'BnZ@200096');

try {
    $pdo = new PDO(
        'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4',
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    die("Database connection failed.");
}

function require_admin() {
    if (empty($_SESSION['admin_id'])) {
        header('Location: login.php');
        exit;
    }
}

function current_admin($pdo) {
    if (!empty($_SESSION['admin_id'])) {
        $stmt = $pdo->prepare("SELECT id, username, fullname FROM admins WHERE id = ?");
        $stmt->execute([$_SESSION['admin_id']]);
        return $stmt->fetch();
    }
    return null;
}
