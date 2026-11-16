<?php
/**
 * CampusSync - Database Initialization & Reset Endpoint
 * Run via browser (/backend/setup.php) or CLI (php backend/setup.php) to reset and re-seed the MySQL schema.
 */
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . '/db.php';

try {
    $pdo = Database::getConnection();
    $schemaPath = __DIR__ . '/../schema.sql';
    
    if (!file_exists($schemaPath)) {
        echo json_encode(["success" => false, "error" => "schema.sql not found"]);
        exit();
    }

    $sql = file_get_contents($schemaPath);

    // Disable warnings during multi-statement schema execution
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
    $pdo->exec($sql);

    echo json_encode([
        "success" => true,
        "message" => "MySQL Database campussync_db successfully initialized and seeded with initial demo data!"
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Setup failed: " . $e->getMessage()
    ]);
}
?>
