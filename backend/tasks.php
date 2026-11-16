<?php
/**
 * CampusSync - RESTful API for Tasks
 * Handles GET (with RBAC Granular Targeted Routing), POST (Create), PUT (Move/Update + Status Attribution), and DELETE.
 */
require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$currentUser = get_current_user_context($pdo);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$userId = $_SERVER['HTTP_X_USER_ID'] ?? 3; // Default to Prof. Richard Davis (CS) if header not set

// Ensure attachments column exists in tasks table
try {
    $colCheck = $pdo->query("SHOW COLUMNS FROM tasks LIKE 'attachments'");
    if ($colCheck->rowCount() === 0) {
        $pdo->exec("ALTER TABLE tasks ADD COLUMN attachments LONGTEXT NULL");
    }
} catch (Exception $e) {}

switch ($method) {
    case 'GET':
        handleGet($pdo, $currentUser);
        break;
    case 'POST':
        handlePost($pdo, $currentUser);
        break;
    case 'PUT':
        handlePut($pdo, $currentUser);
        break;
    case 'DELETE':
        handleDelete($pdo, $currentUser);
        break;
    default:
        send_json(["success" => false, "error" => "Method not allowed"], 405);
}

function handleGet($pdo, $currentUser) {
    $taskId = $_GET['id'] ?? null;
    $boardId = $_GET['board_id'] ?? 1;

    if ($taskId) {
        $stmt = $pdo->prepare("
            SELECT t.*,
                   u.name AS creator_name, u.role AS creator_role, u.avatar_initials AS creator_avatar,
                   cd.short_code AS creator_dept_code, cd.color_hex AS creator_dept_color,
                   td.name AS target_dept_name, td.short_code AS target_dept_code, td.color_hex AS target_dept_color,
                   c.title AS column_title,
                   (SELECT COUNT(*) FROM comments cm WHERE cm.task_id = t.id) AS comment_count
            FROM tasks t
            JOIN users u ON t.creator_id = u.id
            LEFT JOIN departments cd ON u.department_id = cd.id
            LEFT JOIN departments td ON t.target_department_id = td.id
            JOIN columns c ON t.column_id = c.id
            WHERE t.id = ?
        ");
        $stmt->execute([$taskId]);
        $task = $stmt->fetch();

        if (!$task) {
            send_json(["success" => false, "error" => "Task not found"], 404);
        }

        // Check RBAC Targeted Routing
        if (!canUserAccessTask($task, $currentUser)) {
            send_json(["success" => false, "error" => "Access denied. Restricted to target department."], 403);
        }

        // Decode attachments
        if (!empty($task['attachments']) && is_string($task['attachments'])) {
            $task['attachments'] = json_decode($task['attachments'], true) ?? [];
        } else if (empty($task['attachments'])) {
            $task['attachments'] = [
                ['id' => 'brief_' . $task['id'], 'name' => 'Proposal_Brief_' . $task['id'] . '.pdf', 'size' => '245 KB', 'type' => 'application/pdf', 'icon' => '📕'],
                ['id' => 'signoff_' . $task['id'], 'name' => 'Department_Signoff_Form.docx', 'size' => '112 KB', 'type' => 'application/docx', 'icon' => '📝']
            ];
        }

        send_json(["success" => true, "data" => $task]);
    } else {
        $stmt = $pdo->prepare("
            SELECT t.*,
                   u.name AS creator_name, u.role AS creator_role, u.avatar_initials AS creator_avatar,
                   cd.short_code AS creator_dept_code, cd.color_hex AS creator_dept_color,
                   td.name AS target_dept_name, td.short_code AS target_dept_code, td.color_hex AS target_dept_color,
                   c.title AS column_title,
                   (SELECT COUNT(*) FROM comments cm WHERE cm.task_id = t.id) AS comment_count
            FROM tasks t
            JOIN users u ON t.creator_id = u.id
            LEFT JOIN departments cd ON u.department_id = cd.id
            LEFT JOIN departments td ON t.target_department_id = td.id
            JOIN columns c ON t.column_id = c.id
            WHERE c.board_id = ?
            ORDER BY t.id ASC
        ");
        $stmt->execute([$boardId]);
        $allTasks = $stmt->fetchAll();

        foreach ($allTasks as &$t) {
            if (!empty($t['attachments']) && is_string($t['attachments'])) {
                $t['attachments'] = json_decode($t['attachments'], true) ?? [];
            } else if (empty($t['attachments'])) {
                $t['attachments'] = [
                    ['id' => 'brief_' . $t['id'], 'name' => 'Proposal_Brief_' . $t['id'] . '.pdf', 'size' => '245 KB', 'type' => 'application/pdf', 'icon' => '📕'],
                    ['id' => 'signoff_' . $t['id'], 'name' => 'Department_Signoff_Form.docx', 'size' => '112 KB', 'type' => 'application/docx', 'icon' => '📝']
                ];
            }
        }
        unset($t);

        // Filter out tasks restricted by Granular Access Control (Targeted Routing)
        $accessibleTasks = array_values(array_filter($allTasks, function($task) use ($currentUser) {
            return canUserAccessTask($task, $currentUser);
        }));

        send_json([
            "success" => true,
            "count" => count($accessibleTasks),
            "data" => $accessibleTasks,
            "current_user" => $currentUser
        ]);
    }
}

/**
 * Granular Access Control (Targeted Routing) Logic
 * Restricted tasks must NOT be visible to unauthorized users in DOM or API payloads.
 */
function canUserAccessTask($task, $currentUser) {
    // 1. Public task (target_department_id is NULL) -> Accessible by all faculty
    if (empty($task['target_department_id'])) {
        return true;
    }
    // 2. User is the creator of the task -> Accessible
    if ((int)$task['creator_id'] === (int)$currentUser['id']) {
        return true;
    }
    // 3. User belongs to the targeted department -> Accessible
    if ((int)$task['target_department_id'] === (int)$currentUser['department_id']) {
        return true;
    }
    // 4. Deans have university-wide oversight -> Accessible
    if ($currentUser['role'] === 'Dean') {
        return true;
    }
    return false;
}

function handlePost($pdo, $currentUser) {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $columnId = (int)($input['column_id'] ?? 1);
    $targetDeptId = !empty($input['target_department_id']) ? (int)$input['target_department_id'] : null;
    $dueDate = !empty($input['due_date']) ? $input['due_date'] : date('Y-m-d', strtotime('+14 days'));
    $status = trim($input['status'] ?? 'Proposed');

    if (empty($title)) {
        send_json(["success" => false, "error" => "Task title is required"], 400);
    }

    $attachments = !empty($input['attachments']) ? json_encode($input['attachments']) : null;

    $stmt = $pdo->prepare("
        INSERT INTO tasks (column_id, title, description, creator_id, target_department_id, due_date, status, last_moved_by_name, attachments)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $columnId,
        $title,
        $description,
        $currentUser['id'],
        $targetDeptId,
        $dueDate,
        $status,
        $currentUser['name'],
        $attachments
    ]);

    $taskId = $pdo->lastInsertId();

    // Log Creation Activity
    $targetText = $targetDeptId ? " (Targeted Department #$targetDeptId)" : " (Public)";
    $logStmt = $pdo->prepare("INSERT INTO activity_logs (user_id, task_id, action_type, details) VALUES (?, ?, 'CREATED', ?)");
    $logStmt->execute([$currentUser['id'], $taskId, "Created task \"$title\"$targetText"]);

    // Fetch and return created task
    $_GET['id'] = $taskId;
    handleGet($pdo, $currentUser);
}

function handlePut($pdo, $currentUser) {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $taskId = (int)($input['id'] ?? 0);

    if (!$taskId) {
        send_json(["success" => false, "error" => "Task ID is required"], 400);
    }

    // Check existing task
    $stmt = $pdo->prepare("SELECT * FROM tasks WHERE id = ?");
    $stmt->execute([$taskId]);
    $existing = $stmt->fetch();

    if (!$existing) {
        send_json(["success" => false, "error" => "Task not found"], 404);
    }

    if (!canUserAccessTask($existing, $currentUser)) {
        send_json(["success" => false, "error" => "Access denied"], 403);
    }

    $columnId = isset($input['column_id']) ? (int)$input['column_id'] : (int)$existing['column_id'];
    $title = isset($input['title']) ? trim($input['title']) : $existing['title'];
    $description = isset($input['description']) ? trim($input['description']) : $existing['description'];
    $targetDeptId = array_key_exists('target_department_id', $input) ? 
        (!empty($input['target_department_id']) ? (int)$input['target_department_id'] : null) : 
        $existing['target_department_id'];
    $dueDate = isset($input['due_date']) ? $input['due_date'] : $existing['due_date'];

    // Status attribution & column change detection
    $columnChanged = ($columnId !== (int)$existing['column_id']);
    $lastMovedByName = $existing['last_moved_by_name'];

    // Automatically infer status string based on column title
    $colStmt = $pdo->prepare("SELECT title FROM columns WHERE id = ?");
    $colStmt->execute([$columnId]);
    $colTitle = $colStmt->fetchColumn() ?: 'Proposed Changes';

    $statusMap = [
        'Proposed Changes' => 'Proposed',
        'Department Review' => 'In Review',
        'Dean Approval' => 'Dean Approval',
        'Finalized' => 'Finalized'
    ];
    $status = $statusMap[$colTitle] ?? 'Updated';

    if ($columnChanged) {
        $lastMovedByName = $currentUser['name'];
    }

    $updateStmt = $pdo->prepare("
        UPDATE tasks 
        SET column_id = ?, title = ?, description = ?, target_department_id = ?, due_date = ?, status = ?, last_moved_by_name = ?
        WHERE id = ?
    ");
    $updateStmt->execute([
        $columnId,
        $title,
        $description,
        $targetDeptId,
        $dueDate,
        $status,
        $lastMovedByName,
        $taskId
    ]);

    // Log move in activity_logs
    if ($columnChanged) {
        $logStmt = $pdo->prepare("INSERT INTO activity_logs (user_id, task_id, action_type, details) VALUES (?, ?, 'MOVED', ?)");
        $logStmt->execute([
            $currentUser['id'],
            $taskId,
            "Moved task to \"$colTitle\" (Moved by {$currentUser['name']})"
        ]);
    } else {
        $logStmt = $pdo->prepare("INSERT INTO activity_logs (user_id, task_id, action_type, details) VALUES (?, ?, 'UPDATED', ?)");
        $logStmt->execute([
            $currentUser['id'],
            $taskId,
            "Updated task details by {$currentUser['name']}"
        ]);
    }

    $_GET['id'] = $taskId;
    handleGet($pdo, $currentUser);
}

function handleDelete($pdo, $currentUser) {
    $taskId = (int)($_GET['id'] ?? 0);
    if (!$taskId) {
        send_json(["success" => false, "error" => "Task ID required"], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->execute([$taskId]);

    send_json(["success" => true, "message" => "Task #$taskId deleted"]);
}
?>
