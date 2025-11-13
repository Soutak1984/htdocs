<?php
require_once 'db.php';
require_admin();

$filename = 'inquiries_export_' . date('Ymd_His') . '.csv';
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="'.$filename.'"');

$out = fopen('php://output', 'w');
fputcsv($out, ['id','name','email','phone','product','status','message','admin_note','created_at']);

$stmt = $pdo->query("SELECT i.*, p.name as product_name FROM inquiries i LEFT JOIN products p ON i.product_id=p.id ORDER BY i.id ASC");
while ($row = $stmt->fetch()) {
    fputcsv($out, [
        $row['id'],
        $row['name'],
        $row['email'],
        $row['phone'],
        $row['product_name'],
        $row['status'],
        $row['message'],
        $row['admin_note'],
        $row['created_at']
    ]);
}
fclose($out);
exit;
