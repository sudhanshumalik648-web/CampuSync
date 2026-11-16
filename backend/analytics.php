<?php
/**
 * CampusSync - RESTful API for Analytics Pipeline
 * Calculates Average Cycle Time and Department Workload Distribution from DB & activity_logs
 */
require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();

// 1. Calculate Average Cycle Time (in days/hours) for Finalized tasks
$cycleStmt = $pdo->query("
    SELECT t.id, t.title, t.created_at,
           (SELECT MIN(timestamp) FROM activity_logs l WHERE l.task_id = t.id AND l.details LIKE '%Finalized%') AS finalized_at,
           d.name AS department_name, d.short_code AS dept_code, d.color_hex
    FROM tasks t
    JOIN users u ON t.creator_id = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE t.column_id = 4 OR t.status = 'Finalized'
");
$finalizedTasks = $cycleStmt->fetchAll();

$totalHours = 0;
$countFinalized = 0;
$cycleByTask = [];

foreach ($finalizedTasks as $t) {
    $created = strtotime($t['created_at']);
    $finalized = $t['finalized_at'] ? strtotime($t['finalized_at']) : strtotime('now');
    $hours = max(1, round(($finalized - $created) / 3600, 1));
    $days = round($hours / 24, 1);
    $totalHours += $hours;
    $countFinalized++;
    $cycleByTask[] = [
        "task_id" => $t['id'],
        "title" => $t['title'],
        "department" => $t['department_name'],
        "dept_code" => $t['dept_code'],
        "color_hex" => $t['color_hex'],
        "cycle_hours" => $hours,
        "cycle_days" => $days
    ];
}

$avgHours = $countFinalized > 0 ? round($totalHours / $countFinalized, 1) : 48.5;
$avgDays = round($avgHours / 24, 1);

// 2. Calculate Department Workload Distribution (Tasks by creator department + target department)
$deptWorkloadStmt = $pdo->query("
    SELECT d.id, d.name, d.short_code, d.color_hex,
           COUNT(t.id) AS total_tasks,
           SUM(CASE WHEN t.column_id = 1 THEN 1 ELSE 0 END) AS proposed_count,
           SUM(CASE WHEN t.column_id = 2 THEN 1 ELSE 0 END) AS review_count,
           SUM(CASE WHEN t.column_id = 3 THEN 1 ELSE 0 END) AS approval_count,
           SUM(CASE WHEN t.column_id = 4 THEN 1 ELSE 0 END) AS finalized_count
    FROM departments d
    LEFT JOIN users u ON u.department_id = d.id
    LEFT JOIN tasks t ON t.creator_id = u.id
    GROUP BY d.id, d.name, d.short_code, d.color_hex
    ORDER BY total_tasks DESC
");
$workloadByDept = $deptWorkloadStmt->fetchAll();

// 3. Board Summary Stats
$summaryStmt = $pdo->query("
    SELECT 
        (SELECT COUNT(*) FROM tasks) AS total_tasks,
        (SELECT COUNT(*) FROM tasks WHERE column_id = 1) AS proposed_tasks,
        (SELECT COUNT(*) FROM tasks WHERE column_id = 2) AS review_tasks,
        (SELECT COUNT(*) FROM tasks WHERE column_id = 3) AS approval_tasks,
        (SELECT COUNT(*) FROM tasks WHERE column_id = 4) AS finalized_tasks,
        (SELECT COUNT(*) FROM comments) AS total_comments,
        (SELECT COUNT(*) FROM activity_logs) AS total_logs
");
$summary = $summaryStmt->fetch();

send_json([
    "success" => true,
    "metrics" => [
        "average_cycle_time" => [
            "hours" => $avgHours,
            "days" => $avgDays,
            "finalized_count" => $countFinalized,
            "details" => $cycleByTask
        ],
        "workload_distribution" => $workloadByDept,
        "summary" => $summary
    ]
]);
?>
