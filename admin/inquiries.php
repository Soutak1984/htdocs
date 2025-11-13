<?php
require_once 'db.php';
require_admin();

if (isset($_GET['mark']) && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $mark = $_GET['mark'];
    $pdo->prepare("UPDATE inquiries SET status = ? WHERE id = ?")->execute([$mark, $id]);
    header("Location: inquiries.php");
    exit;
}

$inquiries = $pdo->query("SELECT i.*, p.name as product_name FROM inquiries i LEFT JOIN products p ON i.product_id = p.id ORDER BY i.created_at DESC")->fetchAll();
?><!doctype html>
<html><head><meta charset="utf-8"><title>Inquiries</title></head><body>
  <h2>Inquiries <a href="export_inquiries.php">Export CSV</a></h2>
  <table border="1" cellpadding="6">
    <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Product</th><th>Status</th><th>Message</th><th>Actions</th></tr>
    <?php foreach($inquiries as $iq): ?>
      <tr>
        <td><?=$iq['id']?></td>
        <td><?=htmlspecialchars($iq['name'])?></td>
        <td><?=htmlspecialchars($iq['email'])?></td>
        <td><?=htmlspecialchars($iq['phone'])?></td>
        <td><?=htmlspecialchars($iq['product_name'])?></td>
        <td><?=$iq['status']?></td>
        <td><?=nl2br(htmlspecialchars($iq['message']))?></td>
        <td>
          <a href="?mark=viewed&id=<?=$iq['id']?>">Mark viewed</a> |
          <a href="?mark=replied&id=<?=$iq['id']?>">Mark replied</a> |
          <a href="?mark=closed&id=<?=$iq['id']?>">Close</a>
        </td>
      </tr>
    <?php endforeach;?>
  </table>
</body></html>
