<?php
require_once 'db.php';
require_admin();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$name = $slug = $description = '';
if ($id) {
    $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if ($row) {
        $name = $row['name']; $slug = $row['slug']; $description = $row['description'];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $slug = trim($_POST['slug']) ?: strtolower(preg_replace('/\s+/', '-', $name));
    $description = $_POST['description'];

    if ($id) {
        $stmt = $pdo->prepare("UPDATE categories SET name=?, slug=?, description=? WHERE id=?");
        $stmt->execute([$name, $slug, $description, $id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)");
        $stmt->execute([$name, $slug, $description]);
    }
    header("Location: categories.php");
    exit;
}
?><!doctype html>
<html><head><meta charset="utf-8"><title><?= $id ? 'Edit' : 'Add' ?> Category</title></head><body>
  <h2><?= $id ? 'Edit' : 'Add' ?> Category</h2>
  <form method="post">
    <label>Name: <input name="name" value="<?=htmlspecialchars($name)?>" required></label><br>
    <label>Slug: <input name="slug" value="<?=htmlspecialchars($slug)?>"></label><br>
    <label>Description:<br><textarea name="description"><?=htmlspecialchars($description)?></textarea></label><br>
    <button type="submit">Save</button>
  </form>
</body></html>
