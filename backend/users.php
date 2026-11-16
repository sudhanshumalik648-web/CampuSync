<?php
/**
 * CampusSync - RESTful API for Users & Multi-Tier Role-Based Access Control (RBAC)
 */
require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();

$stmt = $pdo->query("
    SELECT u.*, 
           d.name AS department_name, 
           d.short_code AS dept_code, 
           d.color_hex AS dept_color
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    ORDER BY u.id ASC
");
$users = $stmt->fetchAll();

send_json([
    "success" => true,
    "count" => count($users),
    "data" => $users
]);
?>
