<?php
require_once 'db.php';
require_admin();
$admin = current_admin($pdo);

$totalProducts = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
$totalCategories = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
$totalInquiries = $pdo->query("SELECT COUNT(*) FROM inquiries")->fetchColumn();
?><!doctype html>
<html><head><meta charset="utf-8"><title>Admin Dashboard</title></head><body>
  <h1>Dashboard</h1>
  <p>Welcome, <?=htmlspecialchars($admin['fullname'] ?? $admin['username'])?></p>
  <ul>
    <li>Products: <?=$totalProducts?></li>
    <li>Categories: <?=$totalCategories?></li>
    <li>Inquiries: <?=$totalInquiries?></li>
  </ul>
  <nav>
    <a href="products.php">Products</a> |
    <a href="categories.php">Categories</a> |
    <a href="inquiries.php">Inquiries</a> |
    <a href="logout.php">Logout</a>
  </nav>
</body></html>
