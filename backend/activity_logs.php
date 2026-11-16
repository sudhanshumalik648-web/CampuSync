<?php
/**
 * CampusSync - RESTful API for Activity Logs & Audit Trail
 * RBAC Protected: Audit log is only accessible by higher authorities (Dean, Director, Admin).
 * Other faculty members (Professors, Staff, IT, Accounts) are forbidden access.
 */
require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$currentUser = get_current_user_context($pdo);

$taskId = isset($_GET['task_id']) ? (int)$_GET['task_id'] : 0;

/**
 * Check if the user is a higher administrative authority (Dean, Director, Admin, etc.)
 */
function is_higher_authority($user) {
    if (!$user || empty($user['role'])) {
        return false;
    }
    $role = strtolower(trim($user['role']));
    $higherRoles = ['dean', 'director', 'admin', 'administrator', 'provost', 'chancellor', 'president'];
    foreach ($higherRoles as $hr) {
        if (strpos($role, $hr) !== false) {
            return true;
        }
    }
    return false;
}

if ($taskId > 0) {
    // Task-specific history: Verify task exists
    $stmt = $pdo->prepare("
        SELECT l.*, u.name AS user_name, u.role AS user_role, u.avatar_initials, 
               d.short_code AS dept_code, d.color_hex AS dept_color,
               t.title AS task_title
        FROM activity_logs l
        JOIN users u ON l.user_id = u.id
        LEFT JOIN departments d ON u.department_id = d.id
        JOIN tasks t ON l.task_id = t.id
        WHERE l.task_id = ?
        ORDER BY l.timestamp DESC
        LIMIT 50
    ");
    $stmt->execute([$taskId]);
} else {
    // Global audit trail: Strictly restricted to higher administrative authorities
    if (!is_higher_authority($currentUser)) {
        send_json([
            "success" => false,
            "error" => "Access denied. Audit logs are restricted to higher authorities (e.g. Dean, Director)."
        ], 403);
    }

    $stmt = $pdo->query("
        SELECT l.*, u.name AS user_name, u.role AS user_role, u.avatar_initials, 
               d.short_code AS dept_code, d.color_hex AS dept_color,
               t.title AS task_title
        FROM activity_logs l
        JOIN users u ON l.user_id = u.id
        LEFT JOIN departments d ON u.department_id = d.id
        JOIN tasks t ON l.task_id = t.id
        ORDER BY l.timestamp DESC
        LIMIT 100
    ");
}

$logs = $stmt->fetchAll();

send_json([
    "success" => true,
    "count" => count($logs),
    "data" => $logs
]);
?>
