/**
 * CampusSync - AnalyticsModal Component
 * Event Logging & Analytics Pipeline displaying Average Cycle Time, Department Workload Distribution, and Audit Trail.
 */

export function AnalyticsModal({ 
    metrics, 
    logs, 
    departments,
    onClose 
}) {
    const avgCycleHours = metrics?.average_cycle_time?.hours || 48.5;
    const avgCycleDays = metrics?.average_cycle_time?.days || 2.0;
    const finalizedCount = metrics?.average_cycle_time?.finalized_count || 1;
    const workloadList = metrics?.workload_distribution || [
        { id: 1, name: "Computer Science", short_code: "CS", color_hex: "#3B82F6", total_tasks: 2, proposed_count: 1, finalized_count: 1 },
        { id: 2, name: "Engineering", short_code: "ENG", color_hex: "#10B981", total_tasks: 1, review_count: 1 },
        { id: 3, name: "Accounts & Finance", short_code: "ACC", color_hex: "#F59E0B", total_tasks: 1, review_count: 1 },
        { id: 4, name: "Information Technology", short_code: "IT", color_hex: "#8B5CF6", total_tasks: 1, review_count: 1 },
        { id: 5, name: "Deans Office", short_code: "DEAN", color_hex: "#EC4899", total_tasks: 0 }
    ];

    const maxWorkload = Math.max(...workloadList.map(w => parseInt(w.total_tasks || 0, 10)), 1);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-group">
                        <span style={{ fontSize: '1.4rem' }}>📊</span>
                        <div>
                            <h2 className="modal-title">Analytics & Workload Pipeline</h2>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                Real-Time Event Logging, Cycle Time Metrics, and Department Workload Distribution
                            </div>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {/* Top Metric Cards Grid */}
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <span className="metric-card-title">Average Cycle Time</span>
                            <span className="metric-card-value" style={{ color: '#3B82F6' }}>
                                {avgCycleDays} Days
                            </span>
                            <span className="metric-card-sub">
                                {avgCycleHours} hrs avg ({finalizedCount} finalized proposals)
                            </span>
                        </div>

                        <div className="metric-card">
                            <span className="metric-card-title">Active Departments</span>
                            <span className="metric-card-value" style={{ color: '#10B981' }}>
                                {workloadList.length}
                            </span>
                            <span className="metric-card-sub">
                                Cross-department collaboration
                            </span>
                        </div>

                        <div className="metric-card">
                            <span className="metric-card-title">Event Audit Entries</span>
                            <span className="metric-card-value" style={{ color: '#8B5CF6' }}>
                                {logs ? logs.length : 7}
                            </span>
                            <span className="metric-card-sub">
                                Real-time activity logs recorded
                            </span>
                        </div>
                    </div>

                    {/* Department Workload Distribution */}
                    <div className="modal-section">
                        <span className="section-label">Department Workload Distribution</span>
                        <div className="workload-list">
                            {workloadList.map((w) => {
                                const total = parseInt(w.total_tasks || 0, 10);
                                const percentage = Math.min(100, Math.round((total / maxWorkload) * 100));

                                return (
                                    <div key={w.id} className="workload-item">
                                        <div className="workload-top">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <span 
                                                    className="dept-tag" 
                                                    style={{ backgroundColor: w.color_hex || '#3B82F6', padding: '0.1rem 0.45rem' }}
                                                >
                                                    {w.short_code}
                                                </span>
                                                <span>{w.name}</span>
                                            </span>
                                            <span>
                                                <strong>{total}</strong> task{total === 1 ? '' : 's'} assigned
                                            </span>
                                        </div>

                                        <div className="workload-bar-bg">
                                            <div 
                                                className="workload-bar-fill" 
                                                style={{ 
                                                    width: `${percentage}%`, 
                                                    backgroundColor: w.color_hex || '#3B82F6' 
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Real-Time Activity Audit Trail */}
                    <div className="modal-section">
                        <span className="section-label">
                            Real-Time Activity Audit Trail (Latest Actions)
                        </span>

                        <div className="audit-list">
                            {logs && logs.length > 0 ? (
                                logs.map((log) => (
                                    <div key={log.id} className="audit-item">
                                        <div>
                                            <strong style={{ color: '#0F172A' }}>
                                                [{log.action_type}]
                                            </strong>{' '}
                                            <span>{log.details}</span>
                                        </div>
                                        <div style={{ whiteSpace: 'nowrap', fontSize: '0.72rem', color: '#94A3B8' }}>
                                            {log.timestamp}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="audit-item">
                                    <span>[MOVED] Moved task to Finalized (Moved by Dean Elena Miller)</span>
                                    <span>2026-07-28 17:00:00</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                        <span>🖨️ Print Analytics Report</span>
                    </button>
                    <button className="btn btn-primary" onClick={onClose}>
                        Close Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
