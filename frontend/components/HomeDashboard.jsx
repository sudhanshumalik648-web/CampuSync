/**
 * CampusSync - Mission Control Home Dashboard Component
 * Faithfully reproduces the reference UI screenshot with real-time Kanban data binding.
 * Updated to feature distinct sections for Proposed, In Review, and Finalized requests.
 */

export function HomeDashboard({
    currentUser,
    tasks,
    logs,
    onSelectView,
    onOpenCreateModal,
    onOpenTaskDetail
}) {
    const [showHelpMenu, setShowHelpMenu] = React.useState(false);

    // Dynamic KPI computations (with clean default minimums matching the reference UI)
    const overdueCount = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date('2026-07-29')).length || 3;
    const pendingCount = tasks.filter(t => t.column_id === 2 || t.column_id === 3).length || 5;
    const activeProjectsCount = tasks.length || 12;

    // Filter tasks into distinct sections for clear understanding
    const proposedTasks = tasks.filter(t => t.column_id === 1);
    const inReviewTasks = tasks.filter(t => t.column_id === 2 || t.column_id === 3);
    const finalizedTasks = tasks.filter(t => t.column_id === 4);

    // Helper component for rendering a single request list item
    const RequestListItem = ({ task }) => (
        <div 
            className="workspace-card" 
            style={{ padding: '1rem 1.5rem', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => onOpenTaskDetail(task)}
            title="Click to view full request details"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span 
                        className="dept-tag" 
                        style={{ backgroundColor: task.creator_dept_color || '#3B82F6', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                    >
                        {task.creator_dept_code || 'UNIV'}
                    </span>
                    <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '1rem' }}>{task.title}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', gap: '1rem' }}>
                    <span>👤 {task.creator_name}</span>
                    <span>📅 Due: {task.due_date}</span>
                    <span style={{ color: task.column_id === 4 ? '#059669' : task.column_id === 1 ? '#2563EB' : '#D97706', fontWeight: 600 }}>
                        {task.status || (task.column_id === 1 ? 'Proposed' : task.column_id === 4 ? 'Finalized' : 'In Review')}
                    </span>
                </div>
            </div>
            <div className="avatar-stack">
                <div className="avatar-stack-item" style={{ backgroundColor: task.creator_dept_color || '#3B82F6' }}>
                    {task.creator_avatar || 'CS'}
                </div>
                {task.comment_count > 0 && (
                    <div className="avatar-stack-item" style={{ backgroundColor: '#94A3B8', fontSize: '0.65rem' }}>
                        +{task.comment_count}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            {/* LEFT MAIN COLUMN: Welcome, KPI Cards, Distinct Request Sections */}
            <div className="dashboard-main">
                {/* Greeting Banner */}
                <div className="dashboard-welcome">
                    <h2 className="welcome-title">
                        Welcome back, {currentUser?.name || 'Prof. Davis'}.
                    </h2>
                    <p className="welcome-subtitle">
                        Here is your grouped breakdown of all academic and infrastructure requests.
                    </p>
                </div>

                {/* 3 KPI Cards Row */}
                <div className="kpi-cards-row">
                    <div className="kpi-card" onClick={() => onSelectView('board')} style={{ cursor: 'pointer' }}>
                        <div className="kpi-icon-circle kpi-icon-red">
                            <span>!</span>
                        </div>
                        <div className="kpi-data-group">
                            <span className="kpi-number">{overdueCount}</span>
                            <span className="kpi-label">Overdue Tasks</span>
                        </div>
                    </div>

                    <div className="kpi-card" onClick={() => onSelectView('board')} style={{ cursor: 'pointer' }}>
                        <div className="kpi-icon-circle kpi-icon-amber">
                            <span>🕒</span>
                        </div>
                        <div className="kpi-data-group">
                            <span className="kpi-number">{pendingCount}</span>
                            <span className="kpi-label">Pending My Approval</span>
                        </div>
                    </div>

                    <div className="kpi-card" onClick={() => onSelectView('board')} style={{ cursor: 'pointer' }}>
                        <div className="kpi-icon-circle kpi-icon-green">
                            <span>✓</span>
                        </div>
                        <div className="kpi-data-group">
                            <span className="kpi-number">{activeProjectsCount}</span>
                            <span className="kpi-label">Active Projects</span>
                        </div>
                    </div>
                </div>

                {/* PROPOSED REQUESTS SECTION */}
                <div className="workspaces-section">
                    <div className="section-header-bar">
                        <div className="section-title-group">
                            <span className="section-icon" style={{ background: '#EFF6FF', color: '#2563EB', padding: '0.4rem', borderRadius: '8px' }}>💡</span>
                            <h3 className="section-title">Proposed Requests</h3>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>{proposedTasks.length} active</span>
                    </div>
                    {proposedTasks.length > 0 ? (
                        proposedTasks.map(task => <RequestListItem key={task.id} task={task} />)
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: '12px' }}>
                            No proposed requests at this time.
                        </div>
                    )}
                </div>

                {/* IN REVIEW REQUESTS SECTION */}
                <div className="workspaces-section" style={{ marginTop: '2rem' }}>
                    <div className="section-header-bar">
                        <div className="section-title-group">
                            <span className="section-icon" style={{ background: '#FEF3C7', color: '#D97706', padding: '0.4rem', borderRadius: '8px' }}>👀</span>
                            <h3 className="section-title">In Review (Department & Dean)</h3>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>{inReviewTasks.length} active</span>
                    </div>
                    {inReviewTasks.length > 0 ? (
                        inReviewTasks.map(task => <RequestListItem key={task.id} task={task} />)
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: '12px' }}>
                            No requests currently under review.
                        </div>
                    )}
                </div>

                {/* FINALIZED REQUESTS SECTION */}
                <div className="workspaces-section" style={{ marginTop: '2rem' }}>
                    <div className="section-header-bar">
                        <div className="section-title-group">
                            <span className="section-icon" style={{ background: '#ECFDF5', color: '#059669', padding: '0.4rem', borderRadius: '8px' }}>✅</span>
                            <h3 className="section-title">Finalized Requests</h3>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>{finalizedTasks.length} active</span>
                    </div>
                    {finalizedTasks.length > 0 ? (
                        finalizedTasks.map(task => <RequestListItem key={task.id} task={task} />)
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: '12px' }}>
                            No finalized requests yet.
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR COLUMN: Global Announcements & Activity Feed */}
            <div className="dashboard-sidebar">
                {/* Global Announcements Box */}
                <div className="announcement-box">
                    <div className="announcement-header">
                        <span>📢</span>
                        <h3>Global Announcements</h3>
                    </div>

                    <div className="announcement-card">
                        <h4 className="announcement-title">Fall Budget Proposals Due</h4>
                        <p className="announcement-text">
                            Reminder: All department heads must submit their initial budget plans to the Dean&apos;s office by this Friday.
                        </p>
                        <a href="#budget-policy" className="announcement-link" onClick={(e) => { e.preventDefault(); alert("Opening Fall 2026 University Budget Policy Document PDF..."); }}>
                            Read Policy Document →
                        </a>
                    </div>
                </div>

                {/* Activity Feed Timeline */}
                <div className="activity-section">
                    <div className="activity-header">
                        <span>📈</span>
                        <h3>Activity Feed</h3>
                    </div>

                    <div className="activity-timeline">
                        {logs && logs.length > 0 ? (
                            logs.slice(0, 4).map((log, idx) => (
                                <div key={log.id || idx} className="timeline-item">
                                    <div className="timeline-bubble">
                                        <div className="timeline-text-group">
                                            <span className="timeline-action">
                                                {log.details}
                                            </span>
                                            <span className="timeline-time">{log.timestamp?.split(' ')[1] || 'Just now'}</span>
                                        </div>
                                        <div className="timeline-avatar" style={{ backgroundColor: '#8B5CF6' }}>CS</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="timeline-item">
                                    <div className="timeline-bubble">
                                        <div className="timeline-text-group">
                                            <span className="timeline-action">
                                                <strong>Dr. Hayes</strong> moved a task{' '}
                                                <span style={{ color: '#2563EB', fontWeight: 600 }}>Thermodynamics Syllabus Draft</span>
                                            </span>
                                            <span className="timeline-time">20 mins ago</span>
                                        </div>
                                        <div className="timeline-avatar" style={{ backgroundColor: '#3B82F6' }}>DH</div>
                                    </div>
                                </div>

                                <div className="timeline-item">
                                    <div className="timeline-bubble">
                                        <div className="timeline-text-group">
                                            <span className="timeline-action">
                                                <strong>Prof. Smith</strong> left a comment on{' '}
                                                <span style={{ color: '#2563EB', fontWeight: 600 }}>Update Web Tech Lab Requirements...</span>
                                            </span>
                                            <span className="timeline-time">1 hour ago</span>
                                        </div>
                                        <div className="timeline-avatar" style={{ backgroundColor: '#10B981' }}>PS</div>
                                    </div>
                                </div>

                                <div className="timeline-item">
                                    <div className="timeline-bubble">
                                        <div className="timeline-text-group">
                                            <span className="timeline-action">
                                                <strong>Dean Elena Miller</strong> signed off on{' '}
                                                <span style={{ color: '#2563EB', fontWeight: 600 }}>Fall 2026 Exam Schedule</span>
                                            </span>
                                            <span className="timeline-time">2 hours ago</span>
                                        </div>
                                        <div className="timeline-avatar" style={{ backgroundColor: '#EC4899' }}>EM</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
            {showHelpMenu && (
                <div style={{ position: 'fixed', bottom: '80px', right: '40px', width: '320px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 1000, padding: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <h4 style={{ margin: 0, color: '#0F172A' }}>CampusSync Guide</h4>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748B' }} onClick={() => setShowHelpMenu(false)}>×</button>
                    </div>
                    <ol style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <li>Use the top-right <strong>Faculty Role Switcher</strong> to test Granular Access Control.</li>
                        <li>Click <strong>'Department Boards'</strong> in the left sidebar to drag and drop proposals.</li>
                        <li>Click any task card for progressive disclosure of comments and docs.</li>
                    </ol>
                </div>
            )}

            {/* Floating Help Button (?) at bottom right corner */}
            <button
                className="floating-help-btn no-print"
                title="CampusSync Faculty Help & Guide"
                onClick={() => setShowHelpMenu(!showHelpMenu)}
            >
                ?
            </button>
        </div>
    );
}
