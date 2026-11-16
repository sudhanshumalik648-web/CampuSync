<?php
/**
 * CampusSync - RESTful API for Departments
 */
require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();

$stmt = $pdo->query("SELECT * FROM departments ORDER BY id ASC");
$departments = $stmt->fetchAll();

send_json([
    "success" => true,
    "count" => count($departments),
    "data" => $departments
]);
?>
