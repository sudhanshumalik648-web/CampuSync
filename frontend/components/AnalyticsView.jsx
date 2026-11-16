/**
 * CampusSync - Faculty Analytics Full Page View
 * Average Cycle Time metrics and Department Workload Distribution progress bars.
 */

export function AnalyticsView({ metrics, departments }) {
    const avgCycleHours = metrics?.average_cycle_time?.hours || 48.5;
    const avgCycleDays = metrics?.average_cycle_time?.days || 2.0;
    const finalizedCount = metrics?.average_cycle_time?.finalized_count || 1;
    const workloadList = metrics?.workload_distribution || [
        { id: 1, name: "Computer Science", short_code: "CS", color_hex: "#3B82F6", total_tasks: 2 },
        { id: 2, name: "Engineering", short_code: "ENG", color_hex: "#10B981", total_tasks: 1 },
        { id: 3, name: "Accounts & Finance", short_code: "ACC", color_hex: "#F59E0B", total_tasks: 1 },
        { id: 4, name: "Information Technology", short_code: "IT", color_hex: "#8B5CF6", total_tasks: 1 },
        { id: 5, name: "Deans Office", short_code: "DEAN", color_hex: "#EC4899", total_tasks: 0 }
    ];

    const maxWorkload = Math.max(...workloadList.map(w => parseInt(w.total_tasks || 0, 10)), 1);

    return (
        <div className="dashboard-container" style={{ gridTemplateColumns: '1fr' }}>
            <div className="dashboard-main">
                <div className="section-header-bar">
                    <div className="section-title-group">
                        <span style={{ fontSize: '1.4rem' }}>📊</span>
                        <div>
                            <h2 className="welcome-title">Faculty Analytics & Workload Distribution</h2>
                            <p className="welcome-subtitle">
                                Real-time cycle time metrics and cross-department collaboration analytics.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Top Metric Cards Row */}
                <div className="kpi-cards-row">
                    <div className="kpi-card">
                        <div className="kpi-icon-circle kpi-icon-red" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                            <span>⚡</span>
                        </div>
                        <div className="kpi-data-group">
                            <span className="kpi-number">{avgCycleDays} Days</span>
                            <span className="kpi-label">Average Cycle Time ({avgCycleHours}h)</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon-circle kpi-icon-amber" style={{ background: '#ECFDF5', color: '#059669' }}>
                            <span>🏛️</span>
                        </div>
                        <div className="kpi-data-group">
                            <span className="kpi-number">{workloadList.length}</span>
                            <span className="kpi-label">Active Academic Departments</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon-circle kpi-icon-green" style={{ background: '#FEF3C7', color: '#D97706' }}>
                            <span>✅</span>
                        </div>
                        <div className="kpi-data-group">
                            <span className="kpi-number">{finalizedCount}</span>
                            <span className="kpi-label">Finalized Term Proposals</span>
                        </div>
                    </div>
                </div>

                {/* Department Workload Distribution Section */}
                <div className="workspace-card">
                    <h3 className="section-title">Department Workload Distribution</h3>
                    <div className="workload-list">
                        {workloadList.map((w) => {
                            const total = parseInt(w.total_tasks || 0, 10);
                            const percentage = Math.min(100, Math.round((total / maxWorkload) * 100));

                            return (
                                <div key={w.id} className="workload-item" style={{ padding: '0.5rem 0' }}>
                                    <div className="workload-top">
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span 
                                                className="dept-tag" 
                                                style={{ backgroundColor: w.color_hex || '#3B82F6', padding: '0.2rem 0.6rem' }}
                                            >
                                                {w.short_code}
                                            </span>
                                            <span style={{ fontSize: '0.95rem' }}>{w.name}</span>
                                        </span>
                                        <span>
                                            <strong>{total}</strong> task{total === 1 ? '' : 's'} assigned
                                        </span>
                                    </div>

                                    <div className="workload-bar-bg" style={{ height: '12px' }}>
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
            </div>
        </div>
    );
}
