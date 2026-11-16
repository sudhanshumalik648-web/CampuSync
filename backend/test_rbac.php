<?php
/**
 * CampusSync - Test RBAC & Targeted Routing Verification
 */
require_once __DIR__ . '/db.php';
$pdo = Database::getConnection();

function checkUserTasks($pdo, $userId) {
    $_SERVER['HTTP_X_USER_ID'] = $userId;
    $user = get_current_user_context($pdo);
    
    $stmt = $pdo->query("SELECT * FROM tasks ORDER BY id ASC");
    $allTasks = $stmt->fetchAll();

    // Re-declare canUserAccessTask here or include tasks.php logic
    $accessible = array_filter($allTasks, function($task) use ($user) {
        if (empty($task['target_department_id'])) return true;
        if ((int)$task['creator_id'] === (int)$user['id']) return true;
        if ((int)$task['target_department_id'] === (int)$user['department_id']) return true;
        if ($user['role'] === 'Dean') return true;
        return false;
    });

    echo "User: " . $user['name'] . " (" . $user['role'] . " - " . $user['dept_code'] . ") -> Accessible Tasks: " . count($accessible) . "/" . count($allTasks) . PHP_EOL;
    foreach ($accessible as $t) {
        $tag = $t['target_department_id'] ? "[RESTRICTED -> Dept #" . $t['target_department_id'] . "]" : "[PUBLIC]";
        echo "   - Task #" . $t['id'] . ": " . $t['title'] . " " . $tag . PHP_EOL;
    }
    echo PHP_EOL;
}

echo "=== CAMPUSSYNC GRANULAR RBAC TARGETED ROUTING TEST ===" . PHP_EOL;
checkUserTasks($pdo, 3); // Prof. Richard Davis (CS) -> Should NOT see Task #3 (Targeted to Accounts)
checkUserTasks($pdo, 6); // Clara Oswald (Accounts) -> Should see Task #3
checkUserTasks($pdo, 1); // Dean Elena Miller (Dean) -> Should see all tasks
?>
