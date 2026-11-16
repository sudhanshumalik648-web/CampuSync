/**
 * CampusSync - Audit Logs Full Page View
 * Chronological audit trail of all actions across the faculty workflow board.
 * RBAC Protected: Accessible exclusively by higher administrative authorities (Dean, Director).
 */

function isHigherAuthority(user) {
    if (!user || !user.role) return false;
    const role = user.role.toLowerCase().trim();
    const higherRoles = ['dean', 'director', 'admin', 'administrator', 'provost', 'chancellor', 'president'];
    return higherRoles.some(r => role.includes(r));
}

export function AuditLogsView({ logs, onResetDemo, currentUser, onSelectView }) {
    const isAuthorized = isHigherAuthority(currentUser);

    if (!isAuthorized) {
        return (
            <div className="dashboard-container" style={{ gridTemplateColumns: '1fr' }}>
                <div className="dashboard-main">
                    <div className="workspace-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
                        <span style={{ fontSize: '3.5rem' }}>🔒</span>
                        <h3 style={{ color: '#0F172A', marginTop: '1rem', fontSize: '1.3rem' }}>Access Restricted</h3>
                        <p style={{ color: '#64748B', maxWidth: '440px', margin: '0.75rem auto 1.5rem', lineHeight: '1.5' }}>
                            The university audit trail contains sensitive inter-departmental security and compliance records. Access is strictly restricted to higher authorities (e.g. Deans, Directors).
                        </p>
                        {onSelectView && (
                            <button className="btn btn-primary" onClick={() => onSelectView('home')}>
                                <span>← Return to Mission Control</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container" style={{ gridTemplateColumns: '1fr' }}>
            <div className="dashboard-main">
                <div className="section-header-bar">
                    <div className="section-title-group">
                        <span style={{ fontSize: '1.4rem' }}>🕒</span>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <h2 className="welcome-title">Real-Time Activity Audit Trail</h2>
                                <span 
                                    className="term-badge" 
                                    style={{ 
                                        background: '#FDF2F8', 
                                        color: '#DB2777', 
                                        borderColor: '#FBCFE8',
                                        fontSize: '0.75rem',
                                        fontWeight: 700 
                                    }}
                                >
                                    🛡️ Executive Oversight Access
                                </span>
                            </div>
                            <p className="welcome-subtitle">
                                Cryptographically timestamped audit log of all curricular and infrastructure proposals across CampusSync.
                            </p>
                        </div>
                    </div>

                    <button className="btn btn-outline" onClick={onResetDemo}>
                        <span>🔄 Re-seed Audit Logs</span>
                    </button>
                </div>

                <div className="workspace-card" style={{ padding: '0' }}>
                    <div style={{ padding: '1rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.82rem', color: '#64748B' }}>
                        <span>ACTION & USER DETAILS</span>
                        <span>TIMESTAMP</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {logs && logs.length > 0 ? (
                            logs.map((log) => (
                                <div
                                    key={log.id}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        borderBottom: '1px solid #F1F5F9',
                                        display: 'flex',
                                        justify-content: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '0.88rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span
                                            style={{
                                                padding: '0.2rem 0.55rem',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                backgroundColor: log.action_type === 'CREATED' ? '#EFF6FF' : log.action_type === 'MOVED' ? '#ECFDF5' : '#FEF3C7',
                                                color: log.action_type === 'CREATED' ? '#2563EB' : log.action_type === 'MOVED' ? '#059669' : '#D97706',
                                                border: '1px solid currentColor'
                                            }}
                                        >
                                            {log.action_type}
                                        </span>
                                        <span style={{ color: '#0F172A' }}>
                                            {log.details}
                                        </span>
                                    </div>
                                    <span style={{ color: '#64748B', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                        {log.timestamp}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                                No audit log entries recorded yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
