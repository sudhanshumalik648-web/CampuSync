<?php
/**
 * CampusSync - RESTful API for Faculty Authentication (Login & Registration)
 */
require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        send_json(["success" => false, "error" => "Invalid JSON payload"], 400);
    }

    $action = $data['action'] ?? 'login';

    if ($action === 'login') {
        $email = trim($data['email'] ?? '');
        if (empty($email)) {
            send_json(["success" => false, "error" => "Email address is required"], 400);
        }

        $stmt = $pdo->prepare("
            SELECT u.*, 
                   d.name AS department_name, 
                   d.short_code AS dept_code, 
                   d.color_hex AS dept_color
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
            WHERE LOWER(u.email) = LOWER(:email)
            LIMIT 1
        ");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();

        if ($user) {
            send_json([
                "success" => true,
                "message" => "Authentication successful",
                "user" => $user
            ]);
        } else {
            send_json([
                "success" => false,
                "error" => "No faculty account found with email: " . htmlspecialchars($email)
            ], 404);
        }
    } elseif ($action === 'register') {
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $role = trim($data['role'] ?? 'Professor');
        $deptId = !empty($data['department_id']) ? (int)$data['department_id'] : null;

        if (empty($name) || empty($email)) {
            send_json(["success" => false, "error" => "Name and Email are required"], 400);
        }

        // Check if email already exists
        $checkStmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(:email)");
        $checkStmt->execute([':email' => $email]);
        if ($checkStmt->fetch()) {
            send_json(["success" => false, "error" => "An account with this email already exists."], 409);
        }

        // Generate avatar initials
        $words = preg_split("/\s+/", $name);
        $initials = "";
        foreach ($words as $w) {
            if (!empty($w)) $initials .= strtoupper($w[0]);
        }
        $initials = substr($initials, 0, 3) ?: "FA";

        $insertStmt = $pdo->prepare("
            INSERT INTO users (name, email, role, department_id, avatar_initials)
            VALUES (:name, :email, :role, :department_id, :avatar_initials)
        ");
        $insertStmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':role' => $role,
            ':department_id' => $deptId,
            ':avatar_initials' => $initials
        ]);

        $newId = (int)$pdo->lastInsertId();

        // Fetch newly created user with department metadata
        $userStmt = $pdo->prepare("
            SELECT u.*, 
                   d.name AS department_name, 
                   d.short_code AS dept_code, 
                   d.color_hex AS dept_color
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
            WHERE u.id = :id
        ");
        $userStmt->execute([':id' => $newId]);
        $newUser = $userStmt->fetch();

        send_json([
            "success" => true,
            "message" => "Faculty registration successful",
            "user" => $newUser
        ], 201);
    } else {
        send_json(["success" => false, "error" => "Unknown auth action"], 400);
    }
} else {
    send_json(["success" => false, "error" => "Only POST method accepted"], 405);
}
?>