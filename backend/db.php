<?php
/**
 * CampusSync - Robust PDO Database Connection & Auto-Initializer
 * Handles CORS headers, PDO MySQL connection, and automatic schema seeding if empty.
 */

// Enable CORS for local development and standalone UI
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Id, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

// Handle preflight OPTIONS request
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        $host = '127.0.0.1';
        $dbname = 'campussync_db';
        $username = 'root';
        $password = 'root';

        try {
            // Connect to MySQL server first to ensure database exists
            $serverPdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
            $serverPdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

            // Now connect to the specific database
            $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
            $this->pdo = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);

            // Ensure tables are created and seeded if missing
            $this->ensureInitialized();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "error" => "Database connection failed: " . $e->getMessage()
            ]);
            exit();
        }
    }

    private function ensureInitialized() {
        try {
            $stmt = $this->pdo->query("SHOW TABLES LIKE 'tasks'");
            if ($stmt->rowCount() === 0) {
                // Read and execute schema.sql
                $schemaPath = __DIR__ . '/../schema.sql';
                if (file_exists($schemaPath)) {
                    $sql = file_get_contents($schemaPath);
                    // Remove DELIMITER or multi-command blocks if needed
                    $this->pdo->exec($sql);
                }
            }
        } catch (Exception $e) {
            // Log silent warning
            error_log("Auto-initialization check: " . $e->getMessage());
        }
    }

    public static function getConnection() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance->pdo;
    }
}

// Helper function to return JSON and terminate
function send_json($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data);
    exit();
}

// Helper function to get current user context from header or query param
function get_current_user_context($pdo) {
    $userId = $_SERVER['HTTP_X_USER_ID'] ?? $_GET['user_id'] ?? 3; // Default to Prof. Richard Davis (CS)
    $stmt = $pdo->prepare("SELECT u.*, d.name AS department_name, d.short_code AS dept_code, d.color_hex 
                           FROM users u 
                           LEFT JOIN departments d ON u.department_id = d.id 
                           WHERE u.id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user) {
        // Fallback user
        return [
            'id' => 3,
            'name' => 'Prof. Richard Davis',
            'role' => 'Professor',
            'department_id' => 1,
            'dept_code' => 'CS',
            'color_hex' => '#3B82F6'
        ];
    }
    return $user;
}
?>
