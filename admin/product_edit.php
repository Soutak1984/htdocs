<?php
require_once 'db.php';
require_admin();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$name = $slug = $sku = $short_desc = $long_desc = $image = $datasheet = '';
$price = 0; $stock = 0; $category_id = null; $status = 1;

$cats = $pdo->query("SELECT id, name FROM categories ORDER BY name")->fetchAll();

if ($id) {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if ($row) {
        extract($row, EXTR_OVERWRITE);
    }
}

function resize_image($srcPath, $destPath, $maxW=800, $maxH=800) {
    if (!extension_loaded('gd')) return false;
    list($w, $h, $type) = getimagesize($srcPath);
    $ratio = $w/$h;
    if ($w <= $maxW && $h <= $maxH) {
        move_uploaded_file($srcPath, $destPath);
        return true;
    }
    if ($ratio > 1) {
        $newW = $maxW;
        $newH = intval($maxW / $ratio);
    } else {
        $newH = $maxH;
        $newW = intval($maxH * $ratio);
    }
    $dst = imagecreatetruecolor($newW, $newH);
    switch ($type) {
        case IMAGETYPE_JPEG: $srcImg = imagecreatefromjpeg($srcPath); break;
        case IMAGETYPE_PNG: $srcImg = imagecreatefrompng($srcPath); break;
        case IMAGETYPE_GIF: $srcImg = imagecreatefromgif($srcPath); break;
        default: return false;
    }
    imagecopyresampled($dst, $srcImg, 0,0,0,0,$newW,$newH,$w,$h);
    imagejpeg($dst, $destPath, 85);
    imagedestroy($dst);
    imagedestroy($srcImg);
    return true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $slug = trim($_POST['slug']) ?: strtolower(preg_replace('/\s+/', '-', $name));
    $sku = trim($_POST['sku']);
    $price = (float)$_POST['price'];
    $stock = (int)$_POST['stock'];
    $short_desc = $_POST['short_desc'];
    $long_desc = $_POST['long_desc'];
    $category_id = $_POST['category_id'] ?: null;
    $status = isset($_POST['status']) ? 1 : 0;

    $uploadDir = __DIR__ . '/../product-image/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    if (!empty($_FILES['image']['tmp_name'])) {
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $filename = 'pimg_'.time().'_'.rand(1000,9999).'.jpg';
        $tmp = $_FILES['image']['tmp_name'];
        $dest = $uploadDir.$filename;
        // attempt resize (GD). if fails, simple move and convert to jpg via imagecreatefrom*
        if (!resize_image($tmp, $dest, 800, 800)) {
            move_uploaded_file($tmp, $dest);
        }
        $image = 'product-image/'.$filename;
    }

    $dsDir = __DIR__ . '/../product-datasheet/';
    if (!is_dir($dsDir)) mkdir($dsDir, 0755, true);
    if (!empty($_FILES['datasheet']['tmp_name'])) {
        $ext = pathinfo($_FILES['datasheet']['name'], PATHINFO_EXTENSION);
        $filename = 'pds_'.time().'_'.rand(1000,9999).'.'.preg_replace('/[^a-z0-9\.\-_]/i','',$ext);
        move_uploaded_file($_FILES['datasheet']['tmp_name'], $dsDir.$filename);
        $datasheet = 'product-datasheet/'.$filename;
    }

    if ($id) {
        $stmt = $pdo->prepare("UPDATE products SET category_id=?, name=?, slug=?, sku=?, price=?, short_desc=?, long_desc=?, image=?, datasheet=?, stock=?, status=? WHERE id=?");
        $stmt->execute([$category_id, $name, $slug, $sku, $price, $short_desc, $long_desc, $image, $datasheet, $stock, $status, $id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO products (category_id, name, slug, sku, price, short_desc, long_desc, image, datasheet, stock, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$category_id, $name, $slug, $sku, $price, $short_desc, $long_desc, $image, $datasheet, $stock, $status]);
    }
    header("Location: products.php");
    exit;
}
?><!doctype html>
<html><head><meta charset="utf-8"><title><?= $id ? 'Edit' : 'Add' ?> Product</title></head><body>
  <h2><?= $id ? 'Edit' : 'Add' ?> Product</h2>
  <form method="post" enctype="multipart/form-data">
    <label>Name: <input name="name" value="<?=htmlspecialchars($name)?>" required></label><br>
    <label>Slug: <input name="slug" value="<?=htmlspecialchars($slug)?>"></label><br>
    <label>Category:
      <select name="category_id">
        <option value="">-- none --</option>
        <?php foreach($cats as $c): ?>
          <option value="<?=$c['id']?>" <?=($c['id']==$category_id?'selected':'')?>><?=htmlspecialchars($c['name'])?></option>
        <?php endforeach;?>
      </select>
    </label><br>
    <label>SKU: <input name="sku" value="<?=htmlspecialchars($sku)?>"></label><br>
    <label>Price: <input name="price" value="<?=$price?>"></label><br>
    <label>Stock: <input name="stock" value="<?=$stock?>"></label><br>
    <label>Short Description:<br><textarea name="short_desc"><?=htmlspecialchars($short_desc)?></textarea></label><br>
    <label>Long Description:<br><textarea name="long_desc"><?=htmlspecialchars($long_desc)?></textarea></label><br>
    <label>Image: <input type="file" name="image"></label>
    <?php if (!empty($image)): ?><div>Current: <img src="../<?=htmlspecialchars($image)?>" style="max-width:120px"></div><?php endif; ?>
    <br>
    <label>Datasheet (PDF): <input type="file" name="datasheet"></label>
    <?php if (!empty($datasheet)): ?><div>Current: <a href="../<?=htmlspecialchars($datasheet)?>" target="_blank">Download</a></div><?php endif; ?>
    <br>
    <label><input type="checkbox" name="status" <?=($status ? 'checked' : '')?>> Active</label><br>
    <button type="submit">Save</button>
  </form>
</body></html>
