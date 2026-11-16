/**
 * CampusSync - Left Sidebar Component (Matching Mission Control Reference UI)
 * Deep Navy Blue (#0F172A) sidebar with layered logo icon and navigation items.
 * RBAC: Audit Logs navigation is strictly restricted to higher authorities (e.g. Dean, Director).
 */

export function isHigherAuthority(user) {
    if (!user || !user.role) return false;
    const role = user.role.toLowerCase().trim();
    const higherRoles = ['dean', 'director', 'admin', 'administrator', 'provost', 'chancellor', 'president'];
    return higherRoles.some(r => role.includes(r));
}

export function Sidebar({ activeView, onSelectView, currentUser, onLogout }) {
    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠', title: 'Mission Control Dashboard' },
        { id: 'board', label: 'Department Boards', icon: '📊', title: 'Kanban Workflow Board' },
        { id: 'templates', label: 'Document Templates', icon: '📄', title: 'Official Policy & Form Templates' },
    ];

    // Audit logs strictly restricted to higher authority (Dean, Director, etc.)
    if (isHigherAuthority(currentUser)) {
        navItems.push({
            id: 'audit',
            label: 'Audit Logs',
            icon: '🕒',
            title: 'Real-Time Activity Audit Trail (Dean / Director Only)'
        });
    }

    return (
        <aside className="sidebar no-print">
            <div>
                {/* Brand Logo */}
                <div className="sidebar-brand">
                    <div className="sidebar-logo-icon">
                        <span>📚</span>
                    </div>
                    <span className="sidebar-logo-text">CampusSync</span>
                </div>

                {/* Main Navigation Links */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => onSelectView(item.id)}
                                title={item.title}
                            >
                                <span className="sidebar-nav-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Footer Item */}
            <div className="sidebar-footer">
                <button
                    className={`sidebar-nav-item ${activeView === 'settings' ? 'active' : ''}`}
                    onClick={() => onSelectView('settings')}
                    title="Faculty & Account Settings"
                >
                    <span className="sidebar-nav-icon">⚙️</span>
                    <span>Settings</span>
                </button>

                {onLogout && (
                    <button
                        className="sidebar-nav-item"
                        onClick={onLogout}
                        title="Sign out of CampusSync and return to the login screen"
                        style={{ color: '#F87171', marginTop: '0.25rem' }}
                    >
                        <span className="sidebar-nav-icon">🚪</span>
                        <span>Sign Out</span>
                    </button>
                )}
            </div>
        </aside>
    );
}
