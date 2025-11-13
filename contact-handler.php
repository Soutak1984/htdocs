<?php
require_once __DIR__.'/admin/db.php';
require_once __DIR__.'/lib/mailer.php';
require_once __DIR__.'/admin/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.htm');
    exit;
}
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');
$product_id = !empty($_POST['product_id']) ? (int)$_POST['product_id'] : null;

if (!$name || !$email || !$message) {
    die('Please provide name, email and message.');
}

$stmt = $pdo->prepare("INSERT INTO inquiries (name, email, phone, message, product_id) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$name, $email, $phone, $message, $product_id]);

$to = 'sales@yourdomain.com';
$subject = 'New inquiry from ' . $name;
$body = "Name: $name\nEmail: $email\nPhone: $phone\nProduct ID: $product_id\n\nMessage:\n$message";
send_mail($to, $subject, $body, 'no-reply@yourdomain.com', $email);

if ($product_id) {
    header('Location: product.php?slug=' . urlencode($_POST['product_slug'] ?? '') . '&sent=1');
} else {
    header('Location: contact-us.html?sent=1');
}
exit;
