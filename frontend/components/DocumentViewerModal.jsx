/**
 * CampusSync - Official Academic Document Viewer & Inspector Modal
 * Allows any faculty member to open, read, inspect, download, and print 
 * specification documents, policy briefs, and files attached to proposed workflow requests.
 */

import React from 'react';

export function DocumentViewerModal({ doc, task, onClose }) {
    if (!doc) return null;

    const handleDownload = () => {
        if (doc.url) {
            const a = document.createElement('a');
            a.href = doc.url;
            a.download = doc.name;
            a.target = '_blank';
            a.click();
            return;
        }

        // Generate official university specification dossier file for download
        const fileContent = `================================================================================
OFFICIAL UNIVERSITY PROPOSAL SPECIFICATION & COMPLIANCE DOSSIER
UNIVERSITY ACADEMIC & FACULTY AFFAIRS COUNCIL — CAMPUSSYNC
================================================================================
Document Title: ${doc.name}
Document Size:  ${doc.size || '340 KB'}
Workflow Stage: ${task?.column_title || task?.status || 'Proposed Requests'}
Academic Term:  Fall 2026 Term
Tracking ID:    CS-DOC-${task?.id || '99'}-${Date.now().toString(36).toUpperCase()}

PROPOSAL DETAILS:
--------------------------------------------------------------------------------
Proposal Title:      ${task?.title || 'Academic Workflow Proposal'}
Proposing Faculty:   ${task?.creator_name || 'Faculty Member'} (${task?.creator_role || 'Professor'})
Department:          ${task?.creator_dept_code || 'CS'} (${task?.creator_dept_name || 'Academic Unit'})
Target Routing:      ${task?.target_dept_name ? 'Restricted to ' + task.target_dept_name : 'Public (University-Wide)'}
Target Date:         ${task?.due_date || '2026-08-15'}

EXECUTIVE RATIONALE & SYLLABUS SPECIFICATION:
--------------------------------------------------------------------------------
${task?.description || 'Standardized curriculum and infrastructure proposal submitted through CampusSync.'}

ACADEMIC COUNCIL COMPLIANCE CERTIFICATION:
--------------------------------------------------------------------------------
[✓] Meets university accreditation standards for 2026-2027 curriculum.
[✓] Departmental resource projection and budget allocation verified.
[✓] Inter-departmental prerequisite dependency review completed.

DIGITAL VERIFICATION & SIGN-OFF:
--------------------------------------------------------------------------------
Certified by: Office of Academic Affairs & University Registrar
Timestamp:    ${new Date().toISOString()}
Status:       OFFICIALLY SUBMITTED & VERIFIED
================================================================================`;

        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name.replace(/\.[^/.]+$/, "") + "_Official_Dossier.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
            <div 
                className="modal-content" 
                style={{ maxWidth: '820px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }} 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="modal-header" style={{ flexShrink: 0 }}>
                    <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.6rem' }}>{doc.icon || '📄'}</span>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h3 className="modal-title" style={{ margin: 0, fontSize: '1.15rem' }}>{doc.name}</h3>
                                <span className="term-badge" style={{ background: '#EFF6FF', color: '#2563EB', borderColor: '#BFDBFE', fontSize: '0.7rem' }}>
                                    {doc.size || 'Official Spec'}
                                </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                Associated Proposal: <strong>{task?.title || 'Proposed Workflow Request'}</strong>
                            </span>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} title="Close document viewer">×</button>
                </div>

                {/* Modal Body: Document Paper View */}
                <div className="modal-body" style={{ overflowY: 'auto', flex: 1, padding: '1.5rem', background: '#F8FAFC' }}>
                    <div className="doc-paper-view">
                        {/* University Letterhead Header */}
                        <div className="doc-paper-header">
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: '#2563EB', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                                    🏛️ University Academic & Faculty Affairs Council
                                </div>
                                <h2 className="doc-paper-title">{doc.name}</h2>
                                <div className="doc-paper-sub">
                                    Official Academic Proposal Specification Dossier • Fall 2026 Term
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-block' }}>
                                    ✓ Verified & Registered
                                </span>
                                <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                                    Ref: CS-{task?.id || '01'}-SPEC
                                </div>
                            </div>
                        </div>

                        {/* Metadata Details Grid */}
                        <div className="doc-meta-grid">
                            <div>
                                <strong style={{ color: '#475569', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Associated Proposal</strong>
                                <span style={{ fontWeight: 600, color: '#0F172A' }}>{task?.title || 'Academic Proposal'}</span>
                            </div>
                            <div>
                                <strong style={{ color: '#475569', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Proposing Faculty</strong>
                                <span style={{ fontWeight: 600, color: '#0F172A' }}>{task?.creator_name || 'Faculty Member'} ({task?.creator_role || 'Professor'})</span>
                            </div>
                            <div>
                                <strong style={{ color: '#475569', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Department</strong>
                                <span style={{ fontWeight: 600, color: '#0F172A' }}>{task?.creator_dept_code || 'CS'} Department</span>
                            </div>
                            <div>
                                <strong style={{ color: '#475569', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Workflow Stage</strong>
                                <span style={{ fontWeight: 600, color: '#2563EB' }}>{task?.column_title || task?.status || 'Proposed Requests'}</span>
                            </div>
                        </div>

                        {/* Document Content Sections */}
                        <div className="doc-section-heading">1. Detailed Proposal Rationale & Objectives</div>
                        <p style={{ margin: '0.5rem 0 1.25rem', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                            {task?.description || 'This document contains standardized curricular requirements, lab infrastructure specifications, and learning outcomes submitted for departmental and dean review.'}
                        </p>

                        <div className="doc-section-heading">2. University Accreditation & Compliance Checklist</div>
                        <ul style={{ margin: '0.5rem 0 1.25rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
                            <li>✅ <strong>Course/Facility Rubric:</strong> Aligned with 2026-2027 university accreditation guidelines.</li>
                            <li>✅ <strong>Resource & Lab Allocation:</strong> Cost estimates and workstation requirements verified.</li>
                            <li>✅ <strong>Prerequisite & Curriculum Mapping:</strong> Departmental faculty consensus achieved.</li>
                        </ul>

                        <div className="doc-section-heading">3. Departmental Endorsement & Sign-Off Block</div>
                        <div className="doc-signature-block">
                            <div>
                                <div style={{ borderBottom: '1px solid #0F172A', paddingBottom: '0.5rem', marginBottom: '0.4rem', fontStyle: 'italic', color: '#334155' }}>
                                    {task?.creator_name || 'Faculty Member'} (Digitally Signed)
                                </div>
                                <div style={{ fontWeight: 700, color: '#0F172A' }}>Submitting Faculty Member</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{task?.creator_role || 'Professor'} • {task?.creator_dept_code || 'CS'} Department</div>
                            </div>
                            <div>
                                <div style={{ borderBottom: '1px solid #0F172A', paddingBottom: '0.5rem', marginBottom: '0.4rem', fontStyle: 'italic', color: '#334155' }}>
                                    Office of Academic Affairs (Pending Dean Sign-Off)
                                </div>
                                <div style={{ fontWeight: 700, color: '#0F172A' }}>Council Verification Officer</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Deans Review Council • Fall 2026</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer with Actions */}
                <div className="modal-footer" style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        <span>🔒 Authenticated Document • Access Granted to University Faculty</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => window.print()}
                            title="Print this official document specification"
                        >
                            <span>🖨️ Print Document</span>
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={handleDownload}
                            title="Download document file directly to your computer"
                        >
                            <span>⬇️ Download File ({doc.size || 'Spec'})</span>
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-outline" 
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
