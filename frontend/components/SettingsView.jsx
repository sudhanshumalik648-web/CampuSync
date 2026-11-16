/**
 * CampusSync - Faculty Settings View
 * Configuration options for notifications, display preferences, and demo reset.
 */

export function SettingsView({ currentUser, onResetDemo, onLogout }) {
    return (
        <div className="dashboard-container" style={{ gridTemplateColumns: '1fr' }}>
            <div className="dashboard-main">
                <div className="section-header-bar">
                    <div className="section-title-group">
                        <span style={{ fontSize: '1.4rem' }}>⚙️</span>
                        <div>
                            <h2 className="welcome-title">Faculty & Board Settings</h2>
                            <p className="welcome-subtitle">
                                Manage your academic department profile, notification preferences, and demo database state.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="workspace-card">
                    <h3 className="section-title">Active Role & Department Profile</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
                        <div>
                            <label className="form-label">Name</label>
                            <input type="text" className="form-input" value={currentUser?.name || 'Prof. Davis'} readOnly />
                        </div>
                        <div>
                            <label className="form-label">Role</label>
                            <input type="text" className="form-input" value={currentUser?.role || 'Professor'} readOnly />
                        </div>
                        <div>
                            <label className="form-label">Department Code</label>
                            <input type="text" className="form-input" value={currentUser?.dept_code || 'CS'} readOnly />
                        </div>
                        <div>
                            <label className="form-label">Email Address</label>
                            <input type="text" className="form-input" value={currentUser?.email || 'rdavis@university.edu'} readOnly />
                        </div>
                    </div>

                    {onLogout && (
                        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>Active Faculty Session</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Sign out to return to the portal login page and select or register another user.</div>
                            </div>
                            <button 
                                className="btn btn-outline" 
                                style={{ borderColor: '#DC2626', color: '#DC2626' }}
                                onClick={onLogout}
                            >
                                <span>🚪 Sign Out of Account</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="workspace-card">
                    <h3 className="section-title">Demo & Database Maintenance</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                        Need a clean slate? Resetting the database will re-seed all initial faculty members, departments, and sample proposals from the Master Blueprint.
                    </p>
                    <div>
                        <button className="btn btn-outline" style={{ borderColor: '#DC2626', color: '#DC2626' }} onClick={onResetDemo}>
                            <span>🔄 Reset & Re-Seed Database (campussync_db)</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
