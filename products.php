<?php
require_once __DIR__.'/admin/db.php';
$cat = $_GET['category'] ?? null;

if ($cat) {
    $stmt = $pdo->prepare("SELECT id FROM categories WHERE slug = ? LIMIT 1");
    $stmt->execute([$cat]);
    $catrow = $stmt->fetch();
    $catId = $catrow['id'] ?? null;
    $stmt = $pdo->prepare("SELECT p.*, c.name as catname FROM products p LEFT JOIN categories c ON p.category_id=c.id WHERE p.category_id = ? AND p.status = 1 ORDER BY p.created_at DESC");
    $stmt->execute([$catId]);
    $products = $stmt->fetchAll();
} else {
    $products = $pdo->query("SELECT p.*, c.name as catname FROM products p LEFT JOIN categories c ON p.category_id=c.id WHERE p.status = 1 ORDER BY p.created_at DESC")->fetchAll();
}
?><!doctype html>
<html><head><meta charset="utf-8"><title>Products</title></head><body>
  <h1>Products</h1>
  <ul>
  <?php foreach($products as $p): ?>
    <li>
      <a href="product.php?slug=<?=urlencode($p['slug'])?>">
        <?=htmlspecialchars($p['name'])?>
      </a>
      — <?=htmlspecialchars($p['catname'])?> — Rs. <?=$p['price']?>
    </li>
  <?php endforeach;?>
  </ul>
</body></html>
