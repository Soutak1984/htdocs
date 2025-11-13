<?php
require_once 'db.php';
require_admin();

if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $pdo->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
    header("Location: categories.php");
    exit;
}

$cats = $pdo->query("SELECT * FROM categories ORDER BY created_at DESC")->fetchAll();
?><!doctype html>
<html><head><meta charset="utf-8"><title>Categories</title></head><body>
  <h2>Categories <a href="category_edit.php">Add New</a></h2>
  <table border="1" cellpadding="6">
    <tr><th>ID</th><th>Name</th><th>Slug</th><th>Actions</th></tr>
    <?php foreach($cats as $c): ?>
      <tr>
        <td><?=$c['id']?></td>
        <td><?=htmlspecialchars($c['name'])?></td>
        <td><?=htmlspecialchars($c['slug'])?></td>
        <td>
          <a href="category_edit.php?id=<?=$c['id']?>">Edit</a> |
          <a href="?delete=<?=$c['id']?>" onclick="return confirm('Delete?')">Delete</a>
        </td>
      </tr>
    <?php endforeach;?>
  </table>
</body></html>
