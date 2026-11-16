/**
 * CampusSync - Faculty Authentication & Portal Entry Component (AuthView)
 * Allows users to test the project from scratch:
 * 1. 1-Click Role-Based Quick Login (Dean, Dept Head, Professor, IT, Accounts)
 * 2. Standard Email & Password Sign-In with demo credential chips
 * 3. New Faculty Member Registration
 */

import React, { useState } from 'react';

export function AuthView({ users = [], departments = [], onLogin, onRegister, onResetDemo }) {
    const [activeTab, setActiveTab] = useState('roles'); // 'roles' | 'signin' | 'signup'
    
    // Sign-in state
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    // Sign-up state
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regRole, setRegRole] = useState('Professor');
    const [regDeptId, setRegDeptId] = useState(departments[0]?.id || 1);

    // Feedback state
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleRoleCardClick = (user) => {
        setErrorMsg('');
        setSuccessMsg(`Signing in as ${user.name} (${user.role})...`);
        setTimeout(() => {
            onLogin(user);
        }, 300);
    };

    const handleSignInSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');

        const emailClean = signInEmail.trim().toLowerCase();
        if (!emailClean) {
            setErrorMsg('Please enter your university email address.');
            return;
        }

        const foundUser = users.find(u => u.email.toLowerCase() === emailClean);
        if (foundUser) {
            setSuccessMsg(`Welcome back, ${foundUser.name}!`);
            setTimeout(() => {
                onLogin(foundUser);
            }, 300);
        } else {
            setErrorMsg(`No faculty account found for "${signInEmail}". Please choose one from the list or register below.`);
        }
    };

    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!regName.trim() || !regEmail.trim()) {
            setErrorMsg('Please provide both your Full Name and University Email.');
            return;
        }

        const emailClean = regEmail.trim().toLowerCase();
        const existing = users.find(u => u.email.toLowerCase() === emailClean);
        if (existing) {
            setErrorMsg(`An account with email ${regEmail} already exists. Sign in instead.`);
            return;
        }

        const selectedDept = departments.find(d => d.id === parseInt(regDeptId, 10)) || departments[0];

        // Generate initials
        const words = regName.trim().split(/\s+/);
        let initials = "";
        words.forEach(w => { if (w) initials += w[0].toUpperCase(); });
        initials = initials.slice(0, 3) || "FA";

        const newUserData = {
            id: Date.now(),
            name: regName.trim(),
            email: emailClean,
            role: regRole,
            department_id: selectedDept.id,
            avatar_initials: initials,
            department_name: selectedDept.name,
            dept_code: selectedDept.short_code,
            dept_color: selectedDept.color_hex
        };

        setSuccessMsg(`Registered successfully as ${newUserData.name}! Entering portal...`);
        setTimeout(() => {
            if (onRegister) {
                onRegister(newUserData);
            } else {
                onLogin(newUserData);
            }
        }, 400);
    };

    const roleExplanations = {
        'Dean': {
            icon: '🏛️',
            badge: 'Executive Oversight',
            desc: 'Unrestricted access to all university proposals, Dean Approval stage sign-offs, and official Real-Time Audit Logs.'
        },
        'Dept Head': {
            icon: '💻',
            badge: 'Department Leadership',
            desc: 'Evaluates curriculum, lab upgrades, and endorses departmental proposals for executive review.'
        },
        'Professor': {
            icon: '👨‍🏫',
            badge: 'Faculty Member',
            desc: 'Submits course syllabus modernizations, participates in peer reviews, and adds threaded feedback.'
        },
        'IT': {
            icon: '🖥️',
            badge: 'Targeted Operations',
            desc: 'Routes confidential server & GPU budget allocations targeted specifically to Accounts & Finance.'
        },
        'Accounts': {
            icon: '📊',
            badge: 'Financial Governance',
            desc: 'Exclusive access to review and approve confidential inter-departmental budget allocations from IT.'
        }
    };

    return (
        <div className="auth-page-container">
            {/* Top Navigation & Status Bar */}
            <div className="auth-top-navbar">
                <div className="auth-brand-group">
                    <div className="sidebar-logo-icon" style={{ width: '38px', height: '38px', fontSize: '1.25rem' }}>
                        <span>📚</span>
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0F172A', letterSpacing: '-0.02em' }}>
                            CampusSync
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                            University Academic & Administrative Workflow Portal
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="term-badge">Fall 2026 Term</span>
                    <span style={{ fontSize: '0.78rem', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>
                        🟢 Portal Active
                    </span>
                    {onResetDemo && (
                        <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderColor: '#CBD5E1' }}
                            onClick={onResetDemo}
                            title="Reset demo database to seed state"
                        >
                            <span>🔄 Reset Demo</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Main Auth Container */}
            <div className="auth-content-wrapper">
                {/* Hero Header */}
                <div className="auth-hero-banner">
                    <h1 className="auth-hero-title">
                        Welcome to Faculty & Department Workflow Board
                    </h1>
                    <p className="auth-hero-subtitle">
                        Sign in to access your Mission Control dashboard, manage curriculum proposals across distinct workflow stages, and test Multi-Tier Role-Based Access Control (RBAC).
                    </p>
                </div>

                {/* Authentication Card */}
                <div className="auth-card">
                    {/* Navigation Tabs */}
                    <div className="auth-tabs-row">
                        <button
                            type="button"
                            className={`auth-tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('roles'); setErrorMsg(''); setSuccessMsg(''); }}
                        >
                            <span style={{ fontSize: '1.05rem' }}>⚡</span>
                            <span>1-Click Role Login</span>
                            <span className="auth-tab-pill">Recommended</span>
                        </button>

                        <button
                            type="button"
                            className={`auth-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                        >
                            <span style={{ fontSize: '1.05rem' }}>🔑</span>
                            <span>Email & Password</span>
                        </button>

                        <button
                            type="button"
                            className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                        >
                            <span style={{ fontSize: '1.05rem' }}>✍️</span>
                            <span>Register Faculty</span>
                        </button>
                    </div>

                    {/* Notification Alerts */}
                    {errorMsg && (
                        <div className="auth-alert auth-alert-error">
                            <span>⚠️ {errorMsg}</span>
                        </div>
                    )}
                    {successMsg && (
                        <div className="auth-alert auth-alert-success">
                            <span>✅ {successMsg}</span>
                        </div>
                    )}

                    {/* TAB 1: 1-Click Role Login Grid */}
                    {activeTab === 'roles' && (
                        <div>
                            <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.86rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>💡</span>
                                <span>
                                    <strong>Interactive RBAC Demonstration:</strong> Select any faculty member below to immediately enter their customized dashboard view. Notice how Deans access executive Audit Logs, while IT and Accounts see confidential budget allocations.
                                </span>
                            </div>

                            <div className="auth-roles-grid">
                                {users.map(u => {
                                    const roleMeta = roleExplanations[u.role] || {
                                        icon: '👤',
                                        badge: u.role,
                                        desc: 'Standard academic faculty collaboration and review.'
                                    };

                                    return (
                                        <div 
                                            key={u.id}
                                            className="auth-role-card"
                                            onClick={() => handleRoleCardClick(u)}
                                            title={`Click to sign in as ${u.name}`}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div 
                                                    className="avatar-badge" 
                                                    style={{ 
                                                        backgroundColor: u.dept_color || '#3B82F6', 
                                                        width: '44px', 
                                                        height: '44px', 
                                                        fontSize: '1rem',
                                                        fontWeight: 700 
                                                    }}
                                                >
                                                    {u.avatar_initials}
                                                </div>

                                                <span 
                                                    className="dept-tag" 
                                                    style={{ backgroundColor: u.dept_color || '#3B82F6', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                                                >
                                                    {u.dept_code || 'UNIV'}
                                                </span>
                                            </div>

                                            <div style={{ marginTop: '0.85rem' }}>
                                                <div style={{ fontWeight: 700, fontSize: '1.02rem', color: '#0F172A' }}>
                                                    {u.name}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 600, marginTop: '0.1rem' }}>
                                                    {roleMeta.icon} {u.role} • {u.department_name || 'Academic Dept'}
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                                                    {u.email}
                                                </div>
                                            </div>

                                            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.45', marginTop: '0.75rem', marginBottom: '1rem', flex: 1 }}>
                                                {roleMeta.desc}
                                            </p>

                                            <button 
                                                type="button" 
                                                className="btn btn-primary"
                                                style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem', justifyContent: 'center' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRoleCardClick(u);
                                                }}
                                            >
                                                <span>Sign In as {u.role} →</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: Standard Email & Password Sign-In */}
                    {activeTab === 'signin' && (
                        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1rem 0' }}>
                            <form onSubmit={handleSignInSubmit}>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label" style={{ fontWeight: 600 }}>University Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-input" 
                                        placeholder="e.g. emiller@university.edu or rdavis@university.edu"
                                        value={signInEmail}
                                        onChange={(e) => setSignInEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label className="form-label" style={{ fontWeight: 600 }}>Password</label>
                                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Demo: Any password accepted</span>
                                    </div>
                                    <input 
                                        type="password" 
                                        className="form-input" 
                                        placeholder="••••••••"
                                        value={signInPassword}
                                        onChange={(e) => setSignInPassword(e.target.value)}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#475569' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={rememberMe} 
                                            onChange={(e) => setRememberMe(e.target.checked)} 
                                        />
                                        <span>Stay signed in for this session</span>
                                    </label>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', justifyContent: 'center' }}
                                >
                                    <span>Sign In to CampusSync Dashboard →</span>
                                </button>
                            </form>

                            {/* Quick demo account autofill chips */}
                            <div style={{ marginTop: '2rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 700, marginBottom: '0.75rem' }}>
                                    Or Click to Auto-Fill Demo Credentials:
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {users.slice(0, 5).map(u => (
                                        <button 
                                            key={u.id}
                                            type="button"
                                            className="btn btn-secondary"
                                            style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                                            onClick={() => {
                                                setSignInEmail(u.email);
                                                setSignInPassword('password');
                                            }}
                                        >
                                            <span>{u.name} ({u.role})</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: Register New Faculty Member */}
                    {activeTab === 'signup' && (
                        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1rem 0' }}>
                            <form onSubmit={handleSignUpSubmit}>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label" style={{ fontWeight: 600 }}>Full Name & Academic Title</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="e.g. Dr. Alan Turing"
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label" style={{ fontWeight: 600 }}>University Email</label>
                                    <input 
                                        type="email" 
                                        className="form-input" 
                                        placeholder="e.g. aturing@university.edu"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 600 }}>Department</label>
                                        <select 
                                            className="form-select"
                                            value={regDeptId}
                                            onChange={(e) => setRegDeptId(e.target.value)}
                                        >
                                            {departments.map(d => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name} ({d.short_code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 600 }}>Faculty Role (RBAC)</label>
                                        <select 
                                            className="form-select"
                                            value={regRole}
                                            onChange={(e) => setRegRole(e.target.value)}
                                        >
                                            <option value="Professor">Professor (Standard Faculty)</option>
                                            <option value="Dept Head">Department Head</option>
                                            <option value="IT">IT (Targeted Routing)</option>
                                            <option value="Accounts">Accounts & Finance</option>
                                            <option value="Dean">Dean (Executive Authority)</option>
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', justifyContent: 'center' }}
                                >
                                    <span>Register & Enter Dashboard →</span>
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Bottom Testing Guide & Key Feature Highlights */}
                <div className="auth-feature-highlights">
                    <div className="auth-feature-pill">
                        <span style={{ fontSize: '1.4rem' }}>🛡️</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                Executive RBAC & Audit Logs
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                Log in as <strong>Dean Elena Miller</strong> to access the timestamped Audit Trail, Executive oversight, and Dean Approval columns.
                            </div>
                        </div>
                    </div>

                    <div className="auth-feature-pill">
                        <span style={{ fontSize: '1.4rem' }}>🔒</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                Granular Targeted Routing
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                Log in as <strong>Marcus Vance (IT)</strong> or <strong>Clara Oswald (Accounts)</strong> to view confidential budget allocations hidden from general faculty.
                            </div>
                        </div>
                    </div>

                    <div className="auth-feature-pill">
                        <span style={{ fontSize: '1.4rem' }}>🖨️</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                Detailed Proposal Printing
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                Multi-select request cards on the board and export formal serif PDF dossiers with official letterheads and signature blocks.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
