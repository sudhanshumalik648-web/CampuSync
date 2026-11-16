<?php
/**
 * CampusSync - RESTful API for Threaded Comments
 */
require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$currentUser = get_current_user_context($pdo);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $taskId = (int)($_GET['task_id'] ?? 0);
        if (!$taskId) {
            send_json(["success" => false, "error" => "task_id required"], 400);
        }
        $stmt = $pdo->prepare("
            SELECT c.*, u.name AS user_name, u.role AS user_role, u.avatar_initials, d.short_code AS dept_code, d.color_hex AS dept_color
            FROM comments c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN departments d ON u.department_id = d.id
            WHERE c.task_id = ?
            ORDER BY c.timestamp ASC
        ");
        $stmt->execute([$taskId]);
        $comments = $stmt->fetchAll();
        send_json(["success" => true, "count" => count($comments), "data" => $comments]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $taskId = (int)($input['task_id'] ?? 0);
        $text = trim($input['text'] ?? '');

        if (!$taskId || empty($text)) {
            send_json(["success" => false, "error" => "task_id and text required"], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO comments (task_id, user_id, text) VALUES (?, ?, ?)");
        $stmt->execute([$taskId, $currentUser['id'], $text]);
        $commentId = $pdo->lastInsertId();

        // Log comment activity
        $logStmt = $pdo->prepare("INSERT INTO activity_logs (user_id, task_id, action_type, details) VALUES (?, ?, 'COMMENT_ADDED', ?)");
        $logStmt->execute([
            $currentUser['id'],
            $taskId,
            "Added comment: \"" . substr($text, 0, 40) . (strlen($text) > 40 ? '...' : '') . "\" by {$currentUser['name']}"
        ]);

        // Return the created comment
        $stmt = $pdo->prepare("
            SELECT c.*, u.name AS user_name, u.role AS user_role, u.avatar_initials, d.short_code AS dept_code, d.color_hex AS dept_color
            FROM comments c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN departments d ON u.department_id = d.id
            WHERE c.id = ?
        ");
        $stmt->execute([$commentId]);
        $newComment = $stmt->fetch();

        send_json(["success" => true, "data" => $newComment]);
        break;

    default:
        send_json(["success" => false, "error" => "Method not allowed"], 405);
}
?>
