<?php
require_once 'db.php';
require_admin();

$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_FILES['csv']['tmp_name'])) {
    $tmp = $_FILES['csv']['tmp_name'];
    $handle = fopen($tmp, 'r');
    $header = fgetcsv($handle);
    $cols = array_map('strtolower', $header ?: []);
    $count = 0;
    while (($row = fgetcsv($handle)) !== false) {
        $data = array_combine($cols, $row);
        // expected columns: category, name, slug, sku, price, stock, short_desc, long_desc, image_filename, datasheet_filename, status
        $category = trim($data['category'] ?? '');
        $category_id = null;
        if ($category !== '') {
            $stmt = $pdo->prepare("SELECT id FROM categories WHERE name = ? LIMIT 1");
            $stmt->execute([$category]);
            $c = $stmt->fetch();
            if ($c) {
                $category_id = $c['id'];
            } else {
                $pdo->prepare("INSERT INTO categories (name, slug) VALUES (?, ?)")->execute([$category, strtolower(preg_replace('/\s+/', '-', $category))]);
                $category_id = $pdo->lastInsertId();
            }
        }
        $name = $data['name'] ?? '';
        if (!$name) continue;
        $slug = $data['slug'] ?: strtolower(preg_replace('/\s+/', '-', $name));
        $sku = $data['sku'] ?? '';
        $price = floatval($data['price'] ?? 0);
        $stock = intval($data['stock'] ?? 0);
        $short_desc = $data['short_desc'] ?? '';
        $long_desc = $data['long_desc'] ?? '';
        $image = $data['image_filename'] ?? '';
        $datasheet = $data['datasheet_filename'] ?? '';
        $status = ($data['status'] ?? '1') ? 1 : 0;

        // If image/datasheet filenames are provided, expect that files are uploaded into /product-image/import_files and /product-datasheet/import_files
        if ($image) {
            $src = __DIR__ . '/../product-image/import_files/' . basename($image);
            if (file_exists($src)) {
                $destDir = __DIR__ . '/../product-image/';
                if (!is_dir($destDir)) mkdir($destDir, 0755, true);
                $destName = 'pimg_'.time().'_'.rand(1000,9999).'.jpg';
                copy($src, $destDir.$destName);
                $image = 'product-image/'.$destName;
            } else { $image = ''; }
        }
        if ($datasheet) {
            $src = __DIR__ . '/../product-datasheet/import_files/' . basename($datasheet);
            if (file_exists($src)) {
                $destDir = __DIR__ . '/../product-datasheet/';
                if (!is_dir($destDir)) mkdir($destDir, 0755, true);
                $destName = 'pds_'.time().'_'.rand(1000,9999).'.'.pathinfo($datasheet, PATHINFO_EXTENSION);
                copy($src, $destDir.$destName);
                $datasheet = 'product-datasheet/'.$destName;
            } else { $datasheet = ''; }
        }

        $stmt = $pdo->prepare("INSERT INTO products (category_id, name, slug, sku, price, short_desc, long_desc, image, datasheet, stock, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$category_id, $name, $slug, $sku, $price, $short_desc, $long_desc, $image, $datasheet, $stock, $status]);
        $count++;
    }
    fclose($handle);
    $msg = "Imported $count products.";
}
?><!doctype html>
<html><head><meta charset="utf-8"><title>Bulk Import Products</title></head><body>
  <h2>Bulk Import Products (CSV)</h2>
  <?php if ($msg) echo "<p style='color:green;'>".htmlspecialchars($msg)."</p>"; ?>
  <p>CSV columns expected (first row/header): <strong>category,name,slug,sku,price,stock,short_desc,long_desc,image_filename,datasheet_filename,status</strong></p>
  <p>Place referenced image files into <code>product-image/import_files/</code> and datasheets into <code>product-datasheet/import_files/</code> before importing.</p>
  <form method="post" enctype="multipart/form-data">
    <label>CSV File: <input type="file" name="csv" accept=".csv" required></label><br>
    <button type="submit">Import</button>
  </form>
</body></html>
