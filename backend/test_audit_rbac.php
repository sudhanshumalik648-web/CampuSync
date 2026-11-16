<?php
require_once __DIR__ . '/db.php';

function testAuditAccess($userId, $label) {
    $pdo = Database::getConnection();
    $_SERVER['HTTP_X_USER_ID'] = $userId;
    $user = get_current_user_context($pdo);
    
    // Simulate is_higher_authority
    $role = strtolower(trim($user['role']));
    $higherRoles = ['dean', 'director', 'admin', 'administrator', 'provost', 'chancellor', 'president'];
    $isHigher = false;
    foreach ($higherRoles as $hr) {
        if (strpos($role, $hr) !== false) {
            $isHigher = true;
            break;
        }
    }
    
    echo "User: " . $user['name'] . " (" . $user['role'] . ") -> Higher Authority? " . ($isHigher ? "YES (Access Granted)" : "NO (Access Denied)") . PHP_EOL;
}

echo "=== CAMPUSSYNC AUDIT LOG RBAC VERIFICATION ===" . PHP_EOL;
testAuditAccess(1, "Dean Elena Miller");
testAuditAccess(2, "Dr. Arthur Aris");
testAuditAccess(3, "Prof. Richard Davis");
testAuditAccess(4, "Prof. Sarah Jenkins");
testAuditAccess(5, "Marcus Vance");
testAuditAccess(6, "Clara Oswald");
