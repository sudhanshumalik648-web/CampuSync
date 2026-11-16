/**
 * CampusSync - Navbar Component
 * Features Deep Navy Blue header, Multi-Tier Role Switcher, and plain-English action buttons.
 */

export function Navbar({ 
    users, 
    currentUser, 
    onSelectUser, 
    onOpenCreateModal, 
    onOpenAnalyticsModal, 
    onPrintBoard,
    onResetDemo
}) {
    return (
        <header className="navbar">
            <div className="navbar-brand">
                <div className="navbar-logo-icon">CS</div>
                <div>
                    <div className="navbar-title">CampusSync</div>
                    <div className="navbar-subtitle">University Faculty Collaboration Board</div>
                </div>
            </div>

            <div className="navbar-controls">
                {/* Multi-Tier Role Switcher */}
                <div className="role-switcher-container" title="Switch between faculty roles to test Granular Targeted Routing (e.g. IT -> Accounts)">
                    <span className="role-label">Active Faculty Role:</span>
                    <select 
                        className="role-select" 
                        value={currentUser ? currentUser.id : ''} 
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value, 10);
                            const found = users.find(u => u.id === selectedId);
                            if (found) onSelectUser(found);
                        }}
                    >
                        {users.map(u => (
                            <option key={u.id} value={u.id}>
                                {u.name} ({u.role} — {u.dept_code || 'UNIV'})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Plain-English Action Buttons */}
                <button 
                    className="btn btn-primary no-print" 
                    onClick={onOpenCreateModal}
                    title="Propose a new task or inter-departmental request"
                >
                    <span>+ Propose Task</span>
                </button>

                <button 
                    className="btn btn-secondary no-print" 
                    onClick={onOpenAnalyticsModal}
                    title="View cycle time metrics & department workload distribution"
                >
                    <span>📊 Analytics & Workload</span>
                </button>

                <button 
                    className="btn btn-secondary no-print" 
                    onClick={onPrintBoard}
                    title="Export clean serif summary for print or PDF"
                >
                    <span>🖨️ Print Summary</span>
                </button>

                <button 
                    className="btn btn-outline no-print" 
                    style={{ color: '#F8FAFC', borderColor: 'rgba(255,255,255,0.2)' }}
                    onClick={onResetDemo}
                    title="Reset database to initial clean seed state"
                >
                    <span>🔄 Reset Demo</span>
                </button>
            </div>
        </header>
    );
}
