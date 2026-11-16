<?php
/**
 * CampusSync - RESTful API for Board Columns
 */
require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();

$boardId = (int)($_GET['board_id'] ?? 1);

$stmt = $pdo->prepare("
    SELECT * FROM columns 
    WHERE board_id = ? 
    ORDER BY position_order ASC
");
$stmt->execute([$boardId]);
$columns = $stmt->fetchAll();

send_json([
    "success" => true,
    "count" => count($columns),
    "data" => $columns
]);
?>
