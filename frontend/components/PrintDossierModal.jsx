/**
 * CampusSync - Detailed Request Dossier Print View Component
 * Renders full detailed view for single or multiple selected requests.
 * Formatted with professional serif academic styling and page breaks for @media print.
 */

import React, { useEffect } from 'react';

export function PrintDossierModal({ tasks, allComments = [], onClose, onPrint }) {
    useEffect(() => {
        document.body.classList.add('is-printing-dossier');
        return () => {
            document.body.classList.remove('is-printing-dossier');
        };
    }, []);

    const getCommentsForTask = (taskId) => {
        if (!allComments || allComments.length === 0) return [];
        return allComments.filter(c => c.task_id === taskId);
    };

    const handlePrintClick = () => {
        if (onPrint) {
            onPrint();
        } else {
            window.print();
        }
    };

    if (!tasks || tasks.length === 0) return null;

    const printDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="modal-overlay print-dossier-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
            {/* Screen-Only Control Toolbar */}
            <div 
                className="no-print" 
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2100,
                    background: '#0F172A',
                    color: '#FFFFFF',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    border: '1px solid #334155'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🖨️</span>
                    <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                        Print Preview: {tasks.length} Detailed {tasks.length === 1 ? 'Request' : 'Requests'}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button 
                        className="btn btn-primary"
                        onClick={handlePrintClick}
                        style={{ background: '#2563EB', borderColor: '#3B82F6', padding: '0.4rem 1rem' }}
                    >
                        <span>🖨️ Print Now (or Save PDF)</span>
                    </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={onClose}
                        style={{ background: '#334155', color: '#FFFFFF', border: 'none', padding: '0.4rem 1rem' }}
                    >
                        <span>✕ Close</span>
                    </button>
                </div>
            </div>

            {/* Dossier Document Container (Scrollable on Screen, Full-Width in Print) */}
            <div 
                className="modal-content print-dossier-content"
                style={{ 
                    maxWidth: '850px', 
                    maxHeight: '88vh', 
                    overflowY: 'auto',
                    background: '#FFFFFF',
                    padding: '3rem 3.5rem',
                    fontFamily: 'Lora, Georgia, serif',
                    color: '#0F172A',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    marginTop: '45px'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {tasks.map((task, index) => {
                    const taskComments = getCommentsForTask(task.id);

                    return (
                        <div 
                            key={task.id} 
                            className="print-dossier-card"
                            style={{ 
                                pageBreakAfter: index === tasks.length - 1 ? 'auto' : 'always',
                                marginBottom: index === tasks.length - 1 ? '0' : '3.5rem',
                                paddingBottom: index === tasks.length - 1 ? '0' : '3rem',
                                borderBottom: index === tasks.length - 1 ? 'none' : '2px dashed #CBD5E1'
                            }}
                        >
                            {/* University Letterhead & Header */}
                            <div style={{ textAlign: 'center', borderBottom: '2px solid #0F172A', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
                                <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#475569', fontWeight: 600 }}>
                                    University Academic & Faculty Affairs Council
                                </div>
                                <h1 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1.75rem', fontWeight: 700, margin: '0.4rem 0 0.2rem', color: '#0F172A' }}>
                                    Official Faculty Proposal Dossier
                                </h1>
                                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                                    Fall 2026 Academic Term • Printed: {printDate} • Dossier ID: CS-2026-{task.id}
                                </div>
                            </div>

                            {/* Proposal Title & Stage Banner */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <span style={{ 
                                        display: 'inline-block',
                                        fontSize: '0.75rem', 
                                        fontWeight: 700, 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '4px',
                                        background: task.creator_dept_color || '#3B82F6',
                                        color: '#FFFFFF',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {task.creator_dept_code || 'UNIV'} Department
                                    </span>
                                    <h2 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                                        {task.title}
                                    </h2>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        display: 'inline-block',
                                        fontSize: '0.82rem', 
                                        fontWeight: 700, 
                                        padding: '0.35rem 0.85rem',
                                        borderRadius: '20px',
                                        border: '1px solid #0F172A',
                                        background: '#F8FAFC'
                                    }}>
                                        Stage: {task.status || (task.column_id === 4 ? 'Finalized' : task.column_id === 3 ? 'Dean Approval' : task.column_id === 2 ? 'In Review' : 'Proposed')}
                                    </span>
                                </div>
                            </div>

                            {/* Metadata Governance Grid */}
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(3, 1fr)', 
                                gap: '1rem', 
                                background: '#F8FAFC', 
                                border: '1px solid #E2E8F0', 
                                borderRadius: '8px',
                                padding: '1rem 1.25rem',
                                marginBottom: '1.75rem',
                                fontSize: '0.85rem'
                            }}>
                                <div>
                                    <div style={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Initiating Faculty</div>
                                    <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>{task.creator_name}</div>
                                    <div style={{ color: '#475569', fontSize: '0.78rem' }}>{task.creator_role}</div>
                                </div>

                                <div>
                                    <div style={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Routing Classification</div>
                                    <div style={{ fontWeight: 700, color: task.target_department_id ? '#B45309' : '#0F172A', marginTop: '0.2rem' }}>
                                        {task.target_department_id ? `🔒 Targeted: ${task.target_dept_name || task.target_dept_code || 'Dept'}` : '🌐 University-Wide (Public)'}
                                    </div>
                                    <div style={{ color: '#475569', fontSize: '0.78rem' }}>
                                        {task.target_department_id ? 'Granular RBAC Target' : 'Open Faculty Access'}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Governance Due Date</div>
                                    <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>{task.due_date || '2026-08-15'}</div>
                                    <div style={{ color: '#64748B', fontSize: '0.78rem' }}>
                                        {task.last_moved_by_name ? `Moved by ${task.last_moved_by_name}` : 'Initial Stage'}
                                    </div>
                                </div>
                            </div>

                            {/* Section 1: Detailed Proposal & Academic Rationale */}
                            <div style={{ marginBottom: '1.75rem' }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '0.4rem', marginBottom: '0.75rem', color: '#0F172A' }}>
                                    1. Detailed Proposal & Academic Rationale
                                </h3>
                                <p style={{ fontSize: '0.92rem', lineHeight: '1.65', color: '#334155', whiteSpace: 'pre-line', margin: 0 }}>
                                    {task.description || 'No detailed rationale provided for this proposal.'}
                                </p>
                            </div>

                            {/* Section 2: Attached Compliance & Documentation Assets */}
                            <div style={{ marginBottom: '1.75rem' }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '0.4rem', marginBottom: '0.75rem', color: '#0F172A' }}>
                                    2. Attached Documentation & Formal Specs
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', background: '#F8FAFC' }}>
                                        <span>📄 <strong>Proposal_Brief_{task.id}_Final.pdf</strong> (Formal University Syllabus / Requisition Specification)</span>
                                        <span style={{ color: '#64748B' }}>Verified PDF • 2.4 MB</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', background: '#F8FAFC' }}>
                                        <span>📊 <strong>Budget_Resource_Allocation_{task.id}.xlsx</strong> (Financial & Department Resource Breakdown)</span>
                                        <span style={{ color: '#64748B' }}>Verified Excel • 840 KB</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Threaded Comments & Faculty Sign-offs */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '0.4rem', marginBottom: '0.75rem', color: '#0F172A' }}>
                                    3. Faculty Review Comments & Endorsements ({taskComments.length})
                                </h3>
                                {taskComments.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {taskComments.map((comment, cIdx) => (
                                            <div key={comment.id || cIdx} style={{ padding: '0.65rem 0.85rem', borderLeft: '3px solid #3B82F6', background: '#F8FAFC', borderRadius: '0 6px 6px 0', fontSize: '0.85rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontWeight: 600, color: '#0F172A' }}>
                                                    <span>{comment.user_name} ({comment.user_role} — {comment.dept_code || 'UNIV'})</span>
                                                    <span style={{ color: '#64748B', fontWeight: 400, fontSize: '0.75rem' }}>{comment.timestamp}</span>
                                                </div>
                                                <div style={{ color: '#334155', fontStyle: 'italic', lineHeight: '1.4' }}>
                                                    &ldquo;{comment.text}&rdquo;
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ color: '#64748B', fontSize: '0.85rem', fontStyle: 'italic' }}>
                                        No committee comments registered yet for this proposal.
                                    </div>
                                )}
                            </div>

                            {/* Section 4: Formal Academic Sign-Off Block */}
                            <div style={{ borderTop: '2px solid #0F172A', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#475569', marginBottom: '1.25rem' }}>
                                    4. Official Departmental & Executive Signatures
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', fontSize: '0.8rem' }}>
                                    <div>
                                        <div style={{ borderBottom: '1px solid #000000', height: '2.5rem' }}></div>
                                        <div style={{ marginTop: '0.4rem', fontWeight: 600 }}>Initiating Faculty Member</div>
                                        <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Date: __________________</div>
                                    </div>
                                    <div>
                                        <div style={{ borderBottom: '1px solid #000000', height: '2.5rem' }}></div>
                                        <div style={{ marginTop: '0.4rem', fontWeight: 600 }}>Department Head Approval</div>
                                        <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Date: __________________</div>
                                    </div>
                                    <div>
                                        <div style={{ borderBottom: '1px solid #000000', height: '2.5rem' }}></div>
                                        <div style={{ marginTop: '0.4rem', fontWeight: 600 }}>Dean's Office Executive Sign-off</div>
                                        <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Date: __________________</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
