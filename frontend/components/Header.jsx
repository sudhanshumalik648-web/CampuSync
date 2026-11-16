/**
 * CampusSync - Top Header Bar Component (Matching Reference UI Screenshot)
 * Features dynamic page title, Term badge, Search input, Propose Task button,
 * and the avatar-styled Faculty Role Switcher dropdown.
 * Now fully workable with functional Notifications Dropdown.
 */

import React, { useState, useRef, useEffect } from 'react';

export function Header({
    activeView,
    users,
    currentUser,
    searchQuery,
    onSearchChange,
    onSelectUser,
    onOpenCreateModal,
    onPrintBoard,
    onResetDemo,
    logs,
    onLogout
}) {
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    // Map activeView to friendly title matching screenshot
    const viewTitles = {
        home: 'Mission Control',
        board: 'Department Boards',
        templates: 'Document Templates',
        audit: 'Audit Logs',
        settings: 'Settings'
    };

    // Close notifications when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notifRef]);

    return (
        <header className="top-header no-print">
            {/* Left: Dynamic View Title & Term Badge */}
            <div className="header-left">
                <h1 className="header-page-title">
                    {viewTitles[activeView] || 'Mission Control'}
                </h1>
                <span className="term-badge">Fall 2026 Term</span>
            </div>

            {/* Center: Search across CampusSync */}
            <div className="header-search-container">
                <span className="header-search-icon">🔍</span>
                <input
                    type="text"
                    className="header-search-input"
                    placeholder="Search across CampusSync..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Right Controls */}
            <div className="header-right">
                <button
                    className="btn btn-primary"
                    onClick={onOpenCreateModal}
                    title="Propose a new task or inter-departmental request"
                >
                    <span>+ Propose Task</span>
                </button>

                <button
                    className="header-icon-btn"
                    onClick={onPrintBoard}
                    title="Print summary to serif PDF format"
                >
                    <span>🖨️</span>
                </button>

                <button
                    className="header-icon-btn"
                    onClick={onResetDemo}
                    title="Reset demo database to seed state"
                >
                    <span>🔄</span>
                </button>

                {/* Notification Bell Dropdown */}
                <div style={{ position: 'relative' }} ref={notifRef}>
                    <button
                        className="header-icon-btn"
                        title="Notifications"
                        style={{ position: 'relative' }}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <span>🔔</span>
                        {logs && logs.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '6px',
                                right: '6px',
                                width: '8px',
                                height: '8px',
                                background: '#EF4444',
                                borderRadius: '50%'
                            }} />
                        )}
                    </button>

                    {showNotifications && (
                        <div style={{
                            position: 'absolute',
                            top: '120%',
                            right: '0',
                            width: '320px',
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            zIndex: 100,
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0F172A' }}>Recent Activity Alerts</h4>
                                <span style={{ fontSize: '0.75rem', background: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.5rem', borderRadius: '10px' }}>{logs ? logs.length : 0} New</span>
                            </div>
                            <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {logs && logs.length > 0 ? (
                                    logs.slice(0, 6).map((log, index) => (
                                        <div key={index} style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                            <span style={{ color: '#334155' }}>{log.details}</span>
                                            <span style={{ color: '#94A3B8', fontSize: '0.7rem' }}>{log.timestamp}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ fontSize: '0.8rem', color: '#64748B', textAlign: 'center', padding: '1rem 0' }}>No new notifications.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Faculty Role Switcher styled as User Dropdown in screenshot */}
                <div 
                    className="user-dropdown"
                    title="Click to switch between faculty roles to test Granular Targeted Routing"
                >
                    <div 
                        className="user-avatar-circle"
                        style={{ backgroundColor: currentUser?.dept_color || '#3B82F6' }}
                    >
                        {currentUser?.avatar_initials || 'RD'}
                    </div>

                    <div className="user-info-text">
                        <span className="user-name-bold">
                            {currentUser?.name || 'Prof. Davis'}
                        </span>
                        <span className="user-role-sub">
                            {currentUser?.role || 'Professor'} — {currentUser?.dept_code || 'CS'}
                        </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '0.2rem' }}>
                        ⌄
                    </span>

                    {/* Invisible native select overlay for instant role switching */}
                    <select
                        className="role-switcher-select-overlay"
                        value={currentUser ? currentUser.id : ''}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value, 10);
                            const found = users.find(u => u.id === selectedId);
                            if (found) {
                                onSelectUser(found);
                            }
                        }}
                    >
                        {users.map(u => (
                            <option key={u.id} value={u.id}>
                                Switch Role: {u.name} ({u.role} — {u.dept_code || 'UNIV'})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sign Out Button */}
                {onLogout && (
                    <button 
                        className="btn btn-outline"
                        onClick={onLogout}
                        title="Sign out of CampusSync and return to the login screen"
                        style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: '#E2E8F0',
                            color: '#DC2626',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: '#FFFFFF'
                        }}
                    >
                        <span>🚪</span>
                        <span>Sign Out</span>
                    </button>
                )}
            </div>
        </header>
    );
}
