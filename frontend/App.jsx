/**
 * CampusSync - Master App Component (React 18)
 * Academic Faculty Collaboration & Workflow Board (Kanban & Mission Control)
 * Incorporates the Mission Control Reference UI (Left Sidebar + Header + Multi-View Dashboard).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
    DUMMY_DEPARTMENTS, 
    DUMMY_USERS, 
    DUMMY_COLUMNS, 
    DUMMY_TASKS, 
    DUMMY_COMMENTS 
} from './dummyData.js';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';
import { HomeDashboard } from './components/HomeDashboard.jsx';
import { KanbanBoard } from './components/KanbanBoard.jsx';
import { TemplateLibraryView } from './components/TemplateLibraryView.jsx';
import { AuditLogsView } from './components/AuditLogsView.jsx';
import { SettingsView } from './components/SettingsView.jsx';
import { TaskDetailModal } from './components/TaskDetailModal.jsx';
import { CreateTaskModal } from './components/CreateTaskModal.jsx';
import { PrintDossierModal } from './components/PrintDossierModal.jsx';
import { DocumentViewerModal } from './components/DocumentViewerModal.jsx';
import { AuthView } from './components/AuthView.jsx';

const API_BASE = '../backend'; // Relative path for PHP / Apache / XAMPP server

export function App() {
    // Navigation State (Matching Reference UI: 'home', 'board', 'analytics', 'audit', 'settings')
    const [activeView, setActiveView] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');

    // Basic Data State
    const [departments, setDepartments] = useState(DUMMY_DEPARTMENTS);
    const [users, setUsers] = useState(DUMMY_USERS);
    const [columns, setColumns] = useState(DUMMY_COLUMNS);
    const [tasks, setTasks] = useState(DUMMY_TASKS);

    // Active User Context for Multi-Tier RBAC & Granular Access Control (Requires login on start)
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('campussync_auth_user');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.id) return parsed;
            }
        } catch (e) {}
        return null; // Require login/sign in first!
    });

    // UI Modal & Detail State
    const [activeModal, setActiveModal] = useState(null); // 'detail', 'create', or null
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskComments, setTaskComments] = useState([]);
    const [draftTemplate, setDraftTemplate] = useState(null);
    const [activeDocument, setActiveDocument] = useState(null); // { doc, task } for viewing attached documents
    const [activityLogs, setActivityLogs] = useState([]);

    // Multi-Selection & Detailed Print State
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);
    const [printDossierTasks, setPrintDossierTasks] = useState(null);

    // HTML5 Drag-and-Drop State
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverColumnId, setDragOverColumnId] = useState(null);

    // ============================================================================
    // API DATA FETCHING (With Offline / Dummy Fallback)
    // ============================================================================

    const fetchBoardData = useCallback(async (userContext = currentUser) => {
        try {
            const headers = {
                'X-User-Id': userContext ? userContext.id : 3
            };

            // Fetch Tasks (Enforces RBAC Granular Access Control in backend payload)
            const tasksRes = await fetch(`${API_BASE}/tasks.php?board_id=1`, { headers });
            if (tasksRes.ok) {
                const tasksJson = await tasksRes.json();
                if (tasksJson.success && Array.isArray(tasksJson.data)) {
                    setTasks(tasksJson.data);
                }
            }

            // Fetch Columns
            const colsRes = await fetch(`${API_BASE}/columns.php?board_id=1`);
            if (colsRes.ok) {
                const colsJson = await colsRes.json();
                if (colsJson.success && Array.isArray(colsJson.data)) {
                    setColumns(colsJson.data);
                }
            }

            // Fetch Departments
            const deptsRes = await fetch(`${API_BASE}/departments.php`);
            if (deptsRes.ok) {
                const deptsJson = await deptsRes.json();
                if (deptsJson.success && Array.isArray(deptsJson.data)) {
                    setDepartments(deptsJson.data);
                }
            }

            // Fetch Users for Role Switcher
            const usersRes = await fetch(`${API_BASE}/users.php`);
            if (usersRes.ok) {
                const usersJson = await usersRes.json();
                if (usersJson.success && Array.isArray(usersJson.data)) {
                    setUsers(usersJson.data);
                }
            }

            // Fetch Analytics & Activity Logs
            const analyticsRes = await fetch(`${API_BASE}/analytics.php`);
            if (analyticsRes.ok) {
                const analyticsJson = await analyticsRes.json();
                if (analyticsJson.success && analyticsJson.metrics) {
                    setAnalyticsMetrics(analyticsJson.metrics);
                }
            }

            const logsRes = await fetch(`${API_BASE}/activity_logs.php`, { headers });
            if (logsRes.ok) {
                const logsJson = await logsRes.json();
                if (logsJson.success && Array.isArray(logsJson.data)) {
                    setActivityLogs(logsJson.data);
                } else {
                    setActivityLogs([]);
                }
            } else {
                setActivityLogs([]);
            }
        } catch (err) {
            console.warn("Using dummy offline fallback data:", err.message);
        }
    }, [currentUser]);

    // Initial Load & Real-Time Polling every 4 seconds
    useEffect(() => {
        fetchBoardData();

        const pollInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchBoardData();
            }
        }, 4000);

        return () => clearInterval(pollInterval);
    }, [fetchBoardData]);

    const isHigherAuthority = (user) => {
        if (!user || !user.role) return false;
        const role = user.role.toLowerCase().trim();
        const higherRoles = ['dean', 'director', 'admin', 'administrator', 'provost', 'chancellor', 'president'];
        return higherRoles.some(r => role.includes(r));
    };

    // ============================================================================
    // AUTHENTICATION & MULTI-TIER ROLE SWITCHING
    // ============================================================================

    const handleLogin = (user) => {
        setCurrentUser(user);
        try {
            localStorage.setItem('campussync_auth_user', JSON.stringify(user));
        } catch (e) {}
        fetchBoardData(user);
    };

    const handleRegister = async (newUserData) => {
        try {
            const res = await fetch(`${API_BASE}/auth.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'register',
                    name: newUserData.name,
                    email: newUserData.email,
                    role: newUserData.role,
                    department_id: newUserData.department_id
                })
            });
            if (res.ok) {
                const json = await res.json();
                if (json.success && json.user) {
                    setUsers(prev => [...prev, json.user]);
                    handleLogin(json.user);
                    return;
                }
            }
        } catch (err) {
            console.warn("Using offline user registration fallback");
        }

        // Offline / fallback registration
        setUsers(prev => [...prev, newUserData]);
        handleLogin(newUserData);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setSelectedTaskIds([]);
        try {
            localStorage.removeItem('campussync_auth_user');
        } catch (e) {}
    };

    const handleSelectUser = (newUser) => {
        setCurrentUser(newUser);
        try {
            localStorage.setItem('campussync_auth_user', JSON.stringify(newUser));
        } catch (e) {}
        if (activeView === 'audit' && !isHigherAuthority(newUser)) {
            setActiveView('home');
        }
        fetchBoardData(newUser);
    };

    // Multi-Selection Handlers for Batch Detailed Printing
    const handleToggleSelectTask = (taskId) => {
        setSelectedTaskIds(prev => 
            prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
        );
    };

    const handleSelectAllTasks = (taskIds) => {
        setSelectedTaskIds(taskIds);
    };

    const handleClearTaskSelection = () => {
        setSelectedTaskIds([]);
    };

    const handlePrintSelected = () => {
        const selected = tasks.filter(t => selectedTaskIds.includes(t.id));
        if (selected.length > 0) {
            setPrintDossierTasks(selected);
        }
    };

    const handlePrintSingleTask = (task) => {
        setPrintDossierTasks([task]);
    };

    // Filter tasks by searchQuery
    const filteredTasks = tasks.filter(t => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (t.title && t.title.toLowerCase().includes(q)) || 
               (t.description && t.description.toLowerCase().includes(q)) ||
               (t.creator_name && t.creator_name.toLowerCase().includes(q));
    });

    // ============================================================================
    // HTML5 DRAG-AND-DROP API HANDLERS
    // ============================================================================

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, columnId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverColumnId !== columnId) {
            setDragOverColumnId(columnId);
        }
    };

    const handleDragLeave = () => {
        setDragOverColumnId(null);
    };

    const handleDrop = async (e, targetColumnId) => {
        e.preventDefault();
        setDragOverColumnId(null);

        if (!draggedTask || draggedTask.column_id === targetColumnId) {
            return;
        }

        // Optimistic UI Update with Status Attribution
        const updatedTasks = tasks.map(t => {
            if (t.id === draggedTask.id) {
                return {
                    ...t,
                    column_id: targetColumnId,
                    last_moved_by_name: currentUser.name,
                    status: targetColumnId === 4 ? 'Finalized' : 
                            targetColumnId === 3 ? 'Dean Approval' : 
                            targetColumnId === 2 ? 'In Review' : 'Proposed'
                };
            }
            return t;
        });
        setTasks(updatedTasks);

        // Persist to PHP Backend API
        try {
            await fetch(`${API_BASE}/tasks.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': currentUser.id
                },
                body: JSON.stringify({
                    id: draggedTask.id,
                    column_id: targetColumnId
                })
            });
            fetchBoardData();
        } catch (err) {
            console.warn("Failed to persist task drop to API:", err);
        }
    };

    // ============================================================================
    // MODAL & TASK ACTIONS (Create, Move, Comment, Delete, Analytics)
    // ============================================================================

    const handleOpenTaskDetail = async (task) => {
        setSelectedTask(task);
        setActiveModal('detail');

        try {
            const res = await fetch(`${API_BASE}/comments.php?task_id=${task.id}`, {
                headers: { 'X-User-Id': currentUser.id }
            });
            if (res.ok) {
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    setTaskComments(json.data);
                    return;
                }
            }
        } catch (err) {
            // Fallback comments
        }
        setTaskComments(DUMMY_COMMENTS.filter(c => c.task_id === task.id));
    };

    const handleAddComment = async (taskId, text) => {
        try {
            const res = await fetch(`${API_BASE}/comments.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': currentUser.id
                },
                body: JSON.stringify({ task_id: taskId, text })
            });
            if (res.ok) {
                const json = await res.json();
                if (json.success && json.data) {
                    setTaskComments(prev => [...prev, json.data]);
                    fetchBoardData();
                    return;
                }
            }
        } catch (err) {
            const newComment = {
                id: Date.now(),
                task_id: taskId,
                user_id: currentUser.id,
                user_name: currentUser.name,
                user_role: currentUser.role,
                avatar_initials: currentUser.avatar_initials,
                dept_code: currentUser.dept_code,
                dept_color: currentUser.dept_color,
                text,
                timestamp: 'Just now'
            };
            setTaskComments(prev => [...prev, newComment]);
        }
    };

    const handleMoveTaskDetail = async (task, nextColumnId) => {
        await handleDrop({ preventDefault: () => {} }, nextColumnId);
        setActiveModal(null);
    };

    const handleDeleteTask = async (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setActiveModal(null);
        try {
            await fetch(`${API_BASE}/tasks.php?id=${taskId}`, {
                method: 'DELETE',
                headers: { 'X-User-Id': currentUser.id }
            });
        } catch (err) {
            console.warn("Delete fallback");
        }
    };

    const handleCreateTask = async (newProposal) => {
        try {
            const res = await fetch(`${API_BASE}/tasks.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': currentUser.id
                },
                body: JSON.stringify(newProposal)
            });
            if (res.ok) {
                const json = await res.json();
                if (json.success) {
                    fetchBoardData();
                    setActiveModal(null);
                    setDraftTemplate(null);
                    return;
                }
            }
        } catch (err) {
            const fallbackTask = {
                id: Date.now(),
                ...newProposal,
                creator_id: currentUser.id,
                creator_name: currentUser.name,
                creator_role: currentUser.role,
                creator_avatar: currentUser.avatar_initials,
                creator_dept_code: currentUser.dept_code,
                creator_dept_color: currentUser.dept_color,
                status: 'Proposed',
                last_moved_by_name: currentUser.name,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                comment_count: 0
            };
            setTasks(prev => [...prev, fallbackTask]);
            setActiveModal(null);
            setDraftTemplate(null);
        }
    };

    const handleResetDemo = async () => {
        try {
            await fetch(`${API_BASE}/setup.php`);
            fetchBoardData();
            alert("Database campussync_db reset and re-seeded with initial Master Blueprint demo data!");
        } catch (err) {
            alert("Demo reset complete.");
        }
    };

    // ============================================================================
    // RENDER APPLICATION (Left Sidebar + Top Header + Active Dashboard View)
    // ============================================================================

    // If user is not authenticated, render the Faculty Portal Auth Landing View
    if (!currentUser) {
        return (
            <AuthView 
                users={users}
                departments={departments}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onResetDemo={handleResetDemo}
            />
        );
    }

    return (
        <div className="app-layout">
            {/* Left Sidebar (#0F172A Deep Navy Blue matching Reference UI) */}
            <Sidebar 
                activeView={activeView} 
                onSelectView={setActiveView} 
                currentUser={currentUser}
                onLogout={handleLogout}
            />

            {/* Main Wrapper: Top Header Bar + Content View */}
            <div className="main-wrapper">
                <Header 
                    activeView={activeView}
                    users={users}
                    currentUser={currentUser}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSelectUser={handleSelectUser}
                    onOpenCreateModal={() => setActiveModal('create')}
                    onPrintBoard={() => window.print()}
                    onResetDemo={handleResetDemo}
                    logs={activityLogs}
                    onLogout={handleLogout}
                />

                {/* ACTIVE PAGE VIEW */}
                {activeView === 'home' && (
                    <HomeDashboard 
                        currentUser={currentUser}
                        tasks={filteredTasks}
                        logs={activityLogs}
                        onSelectView={setActiveView}
                        onOpenCreateModal={() => setActiveModal('create')}
                        onOpenTaskDetail={handleOpenTaskDetail}
                    />
                )}

                {activeView === 'board' && (
                    <KanbanBoard 
                        columns={columns}
                        tasks={filteredTasks}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClickCard={handleOpenTaskDetail}
                        selectedTaskIds={selectedTaskIds}
                        onToggleSelect={handleToggleSelectTask}
                        onSelectAll={handleSelectAllTasks}
                        onClearSelection={handleClearTaskSelection}
                        onPrintSelected={handlePrintSelected}
                        onOpenDocument={(doc, task) => setActiveDocument({ doc, task })}
                    />
                )}

                {activeView === 'templates' && (
                    <TemplateLibraryView 
                        onUseTemplate={(template) => {
                            setDraftTemplate(template);
                            setActiveModal('create');
                        }}
                    />
                )}

                {activeView === 'audit' && (
                    <AuditLogsView 
                        logs={activityLogs}
                        onResetDemo={handleResetDemo}
                        currentUser={currentUser}
                        onSelectView={setActiveView}
                    />
                )}

                {activeView === 'settings' && (
                    <SettingsView 
                        currentUser={currentUser}
                        onResetDemo={handleResetDemo}
                        onLogout={handleLogout}
                    />
                )}
            </div>

            {/* FLOATING MULTI-SELECTION BATCH PRINT ACTION BAR */}
            {selectedTaskIds.length > 0 && (
                <div className="selection-action-bar no-print">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>📑</span>
                        <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                            <strong>{selectedTaskIds.length}</strong> {selectedTaskIds.length === 1 ? 'Proposal' : 'Proposals'} Selected
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <button 
                            className="btn btn-primary"
                            onClick={handlePrintSelected}
                            style={{ 
                                background: '#2563EB', 
                                borderColor: '#3B82F6', 
                                padding: '0.45rem 1.1rem',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}
                        >
                            <span>🖨️ Print Detailed View ({selectedTaskIds.length})</span>
                        </button>

                        <button
                            className="btn btn-secondary"
                            onClick={() => selectedTaskIds.length === filteredTasks.length ? setSelectedTaskIds([]) : setSelectedTaskIds(filteredTasks.map(t => t.id))}
                            style={{ 
                                background: '#334155', 
                                color: '#FFFFFF', 
                                border: 'none', 
                                padding: '0.45rem 0.9rem',
                                fontSize: '0.85rem'
                            }}
                        >
                            <span>{selectedTaskIds.length === filteredTasks.length ? 'Deselect All' : 'Select All'}</span>
                        </button>

                        <button
                            className="btn btn-secondary"
                            onClick={handleClearTaskSelection}
                            style={{ 
                                background: 'transparent', 
                                color: '#94A3B8', 
                                border: '1px solid #475569', 
                                padding: '0.45rem 0.75rem',
                                fontSize: '0.85rem'
                            }}
                            title="Clear selection"
                        >
                            <span>✕</span>
                        </button>
                    </div>
                </div>
            )}

            {/* PROGRESSIVE DISCLOSURE MODAL: Task Detail */}
            {activeModal === 'detail' && selectedTask && (
                <TaskDetailModal 
                    task={selectedTask}
                    comments={taskComments}
                    columns={columns}
                    currentUser={currentUser}
                    onClose={() => setActiveModal(null)}
                    onAddComment={handleAddComment}
                    onMoveTask={handleMoveTaskDetail}
                    onDeleteTask={handleDeleteTask}
                    onPrintDetailed={handlePrintSingleTask}
                    onOpenDocument={(doc, task) => setActiveDocument({ doc, task })}
                />
            )}

            {/* PROPOSE NEW TASK MODAL */}
            {activeModal === 'create' && (
                <CreateTaskModal 
                    departments={departments}
                    columns={columns}
                    currentUser={currentUser}
                    draftTemplate={draftTemplate}
                    onClose={() => {
                        setActiveModal(null);
                        setDraftTemplate(null);
                    }}
                    onCreateTask={handleCreateTask}
                />
            )}

            {/* DEDICATED PRINT DOSSIER PREVIEW & EXPORT MODAL */}
            {printDossierTasks && (
                <PrintDossierModal 
                    tasks={printDossierTasks}
                    allComments={taskComments.length > 0 ? taskComments : DUMMY_COMMENTS}
                    onClose={() => setPrintDossierTasks(null)}
                    onPrint={() => window.print()}
                />
            )}

            {/* ACADEMIC SPECIFICATION DOCUMENT VIEWER & INSPECTOR MODAL */}
            {activeDocument && (
                <DocumentViewerModal 
                    doc={activeDocument.doc}
                    task={activeDocument.task}
                    onClose={() => setActiveDocument(null)}
                />
            )}
        </div>
    );
}
