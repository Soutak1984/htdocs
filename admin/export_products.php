<?php
require_once 'db.php';
require_admin();

$filename = 'products_export_' . date('Ymd_His') . '.csv';
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="'.$filename.'"');

$out = fopen('php://output', 'w');
fputcsv($out, ['id','category','name','slug','sku','price','stock','status','image','datasheet','created_at']);

$stmt = $pdo->query("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id=c.id ORDER BY p.id ASC");
while ($row = $stmt->fetch()) {
    fputcsv($out, [
        $row['id'],
        $row['category_name'],
        $row['name'],
        $row['slug'],
        $row['sku'],
        $row['price'],
        $row['stock'],
        $row['status'],
        $row['image'],
        $row['datasheet'],
        $row['created_at']
    ]);
}
fclose($out);
exit;
