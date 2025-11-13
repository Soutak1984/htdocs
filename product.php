<?php
require_once __DIR__.'/admin/db.php';
require_once __DIR__.'/lib/mailer.php';
require_once __DIR__.'/admin/config.php';

$slug = $_GET['slug'] ?? '';
$stmt = $pdo->prepare("SELECT p.*, c.name as catname FROM products p LEFT JOIN categories c ON p.category_id=c.id WHERE p.slug = ? LIMIT 1");
$stmt->execute([$slug]);
$p = $stmt->fetch();
if (!$p) {
    http_response_code(404);
    echo "Product not found";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $message = trim($_POST['message'] ?? '');
    if ($name && $email && $message) {
        $stmt = $pdo->prepare("INSERT INTO inquiries (name, email, phone, message, product_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $phone, $message, $p['id']]);
        // notify via email
        $to = 'sales@yourdomain.com';
        $subject = 'New inquiry for ' . $p['name'];
        $body = "Name: $name\nEmail: $email\nPhone: $phone\nProduct: {$p['name']}\n\nMessage:\n$message";
        send_mail($to, $subject, $body, 'no-reply@yourdomain.com', $email);
        $sent = true;
    } else {
        $error = 'Please fill required fields.';
    }
}
?><!doctype html>
<html><head><meta charset="utf-8"><title><?=htmlspecialchars($p['name'])?></title></head><body>
  <h1><?=htmlspecialchars($p['name'])?></h1>
  <p>Category: <?=htmlspecialchars($p['catname'])?></p>
  <p>Price: Rs. <?=$p['price']?></p>
  <?php if ($p['image']): ?>
    <img src="<?=htmlspecialchars($p['image'])?>" style="max-width:300px">
  <?php endif; ?>
  <div><?=nl2br(htmlspecialchars($p['long_desc']))?></div>
  <?php if ($p['datasheet']): ?><p><a href="<?=htmlspecialchars($p['datasheet'])?>" target="_blank">Download datasheet</a></p><?php endif; ?>

  <h3>Send inquiry about this product</h3>
  <?php if (!empty($sent)): ?><p style="color:green;">Inquiry sent — we will contact you shortly.</p><?php endif; ?>
  <?php if (!empty($error)): ?><p style="color:red;"><?=htmlspecialchars($error)?></p><?php endif; ?>
  <form method="post">
    <label>Name: <input name="name" required></label><br>
    <label>Email: <input name="email" type="email" required></label><br>
    <label>Phone: <input name="phone"></label><br>
    <label>Message:<br><textarea name="message" required></textarea></label><br>
    <button type="submit">Send Inquiry</button>
  </form>
</body></html>
