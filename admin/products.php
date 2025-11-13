<?php
require_once 'db.php';
require_admin();

if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $stmt = $pdo->prepare("SELECT image, datasheet FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $p = $stmt->fetch();
    if ($p) {
        if ($p['image'] && file_exists(__DIR__.'/../'.$p['image'])) unlink(__DIR__.'/../'.$p['image']);
        if ($p['datasheet'] && file_exists(__DIR__.'/../'.$p['datasheet'])) unlink(__DIR__.'/../'.$p['datasheet']);
    }
    $pdo->prepare("DELETE FROM products WHERE id = ?")->execute([$id]);
    header("Location: products.php");
    exit;
}

$products = $pdo->query("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id=c.id ORDER BY p.created_at DESC")->fetchAll();
?><!doctype html>
<html><head><meta charset="utf-8"><title>Products</title></head><body>
  <h2>Products <a href="product_edit.php">Add New</a> | <a href="export_products.php">Export CSV</a> | <a href="bulk_import.php">Bulk Import</a></h2>
  <table border="1" cellpadding="6">
    <tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
    <?php foreach($products as $p): ?>
      <tr>
        <td><?=$p['id']?></td>
        <td><?=htmlspecialchars($p['name'])?></td>
        <td><?=htmlspecialchars($p['category_name'])?></td>
        <td><?=$p['price']?></td>
        <td><?=$p['stock']?></td>
        <td>
          <a href="product_edit.php?id=<?=$p['id']?>">Edit</a> |
          <a href="?delete=<?=$p['id']?>" onclick="return confirm('Delete product?')">Delete</a>
        </td>
      </tr>
    <?php endforeach;?>
  </table>
</body></html>
