/**
 * CampusSync - Official Document & Policy Template Library
 * Allows faculty to start proposals from standardized forms, add custom templates, and edit existing ones.
 * Now features full document attachment support (PDF, Word, Excel specifications & forms).
 * Fully persisted via localStorage.
 */

import React, { useState, useRef } from 'react';

export const DEFAULT_TEMPLATES = [
    {
        id: 't1',
        title: 'New Course Syllabus Template',
        category: 'Academic & Curriculum',
        icon: '📚',
        description: 'Standardized 2026 format for proposing new undergraduate or graduate courses. Includes prerequisite mapping, learning outcomes, and required syllabus policy guidelines.',
        draftTitle: 'New Course Proposal: [Course Code]',
        draftDescription: 'Overview:\n[Brief summary of the course]\n\nPrerequisites:\n[List prerequisites here]\n\nLearning Outcomes:\n1. \n2. \n3. ',
        attachments: [
            { id: 'att_1a', name: 'University_Syllabus_Policy_2026.pdf', size: '1.8 MB', type: 'application/pdf', icon: '📕' },
            { id: 'att_1b', name: 'Course_Learning_Outcomes_Rubric.docx', size: '420 KB', type: 'application/docx', icon: '📝' }
        ]
    },
    {
        id: 't2',
        title: 'IT Infrastructure & Equipment Request',
        category: 'Operations & IT',
        icon: '🖥️',
        description: 'Use this for requesting lab upgrades, server allocations, or new hardware. Automatically routes to IT and Accounts with standard hardware specification sheets.',
        draftTitle: 'IT Equipment Request: [Lab/Room Name]',
        draftDescription: 'Equipment Needed:\n- [Item 1]\n- [Item 2]\n\nJustification:\n[Why is this equipment necessary?]\n\nEstimated Budget: $[Amount]',
        attachments: [
            { id: 'att_2a', name: 'IT_Hardware_Standards_Specification.pdf', size: '2.4 MB', type: 'application/pdf', icon: '📕' },
            { id: 'att_2b', name: 'Requisition_Cost_Estimation_Sheet.xlsx', size: '890 KB', type: 'application/xlsx', icon: '📊' }
        ]
    },
    {
        id: 't3',
        title: 'Grant Application Sign-Off',
        category: 'Research & Funding',
        icon: '💰',
        description: 'Routing slip for external research grant applications requiring Department Head and Dean approval before submission with compliance guidelines.',
        draftTitle: 'Grant Application: [Funding Agency]',
        draftDescription: 'Principal Investigator: [Name]\nFunding Agency: [Agency Name]\nDeadline: [Date]\n\nAbstract:\n[Brief summary of the research proposal]',
        attachments: [
            { id: 'att_3a', name: 'External_Grant_Routing_Procedure.pdf', size: '1.2 MB', type: 'application/pdf', icon: '📕' },
            { id: 'att_3b', name: 'Institutional_Endorsement_Form.docx', size: '310 KB', type: 'application/docx', icon: '📝' }
        ]
    },
    {
        id: 't4',
        title: 'Faculty Leave of Absence Request',
        category: 'Human Resources',
        icon: '✈️',
        description: 'Formal request for sabbatical, medical, or personal leave. Includes coverage plan requirements and university policy handbook handbook.',
        draftTitle: 'Leave Request: [Faculty Name]',
        draftDescription: 'Leave Type: [Sabbatical/Medical/Personal]\nDates: [Start Date] to [End Date]\n\nTeaching Coverage Plan:\n[How will your courses be covered?]',
        attachments: [
            { id: 'att_4a', name: 'Faculty_Handbook_Leave_Policy.pdf', size: '950 KB', type: 'application/pdf', icon: '📕' },
            { id: 'att_4b', name: 'Teaching_Coverage_Plan_Form.docx', size: '260 KB', type: 'application/docx', icon: '📝' }
        ]
    }
];

const PRESET_ICONS = ['📚', '🖥️', '💰', '✈️', '📋', '🔬', '🏛️', '📊', '🛡️', '⚙️', '🎓', '📝'];
const PRESET_CATEGORIES = [
    'Academic & Curriculum',
    'Operations & IT',
    'Research & Funding',
    'Human Resources',
    'Student Affairs',
    'Facilities & Infrastructure',
    'General Administrative'
];

export function TemplateLibraryView({ onUseTemplate }) {
    const fileInputRef = useRef(null);

    const [templates, setTemplates] = useState(() => {
        try {
            const saved = localStorage.getItem('campussync_document_templates');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Ensure every template has an attachments array
                    return parsed.map(t => ({
                        ...t,
                        attachments: Array.isArray(t.attachments) ? t.attachments : []
                    }));
                }
            }
        } catch (e) {
            console.warn("Could not load templates from storage", e);
        }
        return DEFAULT_TEMPLATES;
    });

    const [editingTemplate, setEditingTemplate] = useState(null); // null or template object
    const [formData, setFormData] = useState({
        title: '',
        category: 'Academic & Curriculum',
        icon: '📋',
        description: '',
        draftTitle: '',
        draftDescription: '',
        attachments: []
    });

    const saveTemplates = (newTemplates) => {
        setTemplates(newTemplates);
        try {
            localStorage.setItem('campussync_document_templates', JSON.stringify(newTemplates));
        } catch (e) {
            console.error("Failed to save templates to localStorage", e);
        }
    };

    const handleOpenAdd = () => {
        setFormData({
            title: '',
            category: 'Academic & Curriculum',
            icon: '📋',
            description: '',
            draftTitle: '',
            draftDescription: '',
            attachments: []
        });
        setEditingTemplate({ isNew: true });
    };

    const handleOpenEdit = (template) => {
        setFormData({
            title: template.title || '',
            category: template.category || 'Academic & Curriculum',
            icon: template.icon || '📋',
            description: template.description || '',
            draftTitle: template.draftTitle || '',
            draftDescription: template.draftDescription || '',
            attachments: Array.isArray(template.attachments) ? [...template.attachments] : []
        });
        setEditingTemplate(template);
    };

    const handleDelete = (templateId) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            const updated = templates.filter(t => t.id !== templateId);
            saveTemplates(updated);
        }
    };

    const handleResetDefaults = () => {
        if (window.confirm("Reset all templates back to standard university defaults with official PDF specifications? Any custom templates will be replaced.")) {
            saveTemplates(DEFAULT_TEMPLATES);
        }
    };

    // File Upload Handler for real files selected from computer
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newAttachments = files.map(file => {
            let icon = '📄';
            const ext = file.name.split('.').pop().toLowerCase();
            if (['xls', 'xlsx', 'csv'].includes(ext)) icon = '📊';
            else if (['doc', 'docx'].includes(ext)) icon = '📝';
            else if (['ppt', 'pptx'].includes(ext)) icon = '📽️';
            else if (['pdf'].includes(ext)) icon = '📕';

            const sizeKB = Math.round(file.size / 1024);
            const sizeStr = sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB';

            let blobUrl = null;
            try {
                blobUrl = URL.createObjectURL(file);
            } catch (err) {}

            return {
                id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                name: file.name,
                size: sizeStr,
                type: file.type || 'application/octet-stream',
                icon: icon,
                url: blobUrl
            };
        });

        setFormData(prev => ({
            ...prev,
            attachments: [...(prev.attachments || []), ...newAttachments]
        }));

        // Reset file input value so user can upload same file again if desired
        if (e.target) e.target.value = '';
    };

    // Quick Add Preset University Specification File
    const addQuickPreset = (presetName, presetSize, presetIcon) => {
        setFormData(prev => ({
            ...prev,
            attachments: [
                ...(prev.attachments || []),
                {
                    id: 'preset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                    name: presetName,
                    size: presetSize,
                    type: 'application/pdf',
                    icon: presetIcon
                }
            ]
        }));
    };

    // Remove Attachment
    const handleRemoveAttachment = (attId) => {
        setFormData(prev => ({
            ...prev,
            attachments: (prev.attachments || []).filter(a => a.id !== attId)
        }));
    };

    // Download / View File
    const handleDownloadFile = (att) => {
        if (att.url) {
            const a = document.createElement('a');
            a.href = att.url;
            a.download = att.name;
            a.target = '_blank';
            a.click();
        } else {
            // Generate simulated official university brief document for download
            const content = `========================================================================\n` +
                `UNIVERSITY ACADEMIC & FACULTY AFFAIRS COUNCIL\n` +
                `OFFICIAL POLICY SPECIFICATION / TEMPLATE GUIDELINES\n` +
                `========================================================================\n\n` +
                `Document Title: ${att.name}\n` +
                `Specification Size: ${att.size}\n` +
                `Academic Term: Fall 2026 Term\n\n` +
                `Overview:\n` +
                `This official template specification document provides compliance guidance,\n` +
                `accreditation standards, and resource estimation parameters for university faculty\n` +
                `submitting proposals through CampusSync.\n\n` +
                `Certified by the Dean of Academic Affairs.\n` +
                `========================================================================\n`;
            
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = att.name.replace(/\.[^/.]+$/, "") + "_Official_Spec.txt";
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert("Please provide a template title.");
            return;
        }

        if (editingTemplate.isNew) {
            const newT = {
                ...formData,
                id: 't_' + Date.now(),
                title: formData.title.trim(),
                draftTitle: formData.draftTitle.trim() || formData.title.trim(),
                draftDescription: formData.draftDescription.trim() || formData.description.trim(),
                attachments: formData.attachments || []
            };
            saveTemplates([...templates, newT]);
        } else {
            const updated = templates.map(t => {
                if (t.id === editingTemplate.id) {
                    return {
                        ...t,
                        ...formData,
                        title: formData.title.trim(),
                        draftTitle: formData.draftTitle.trim() || formData.title.trim(),
                        draftDescription: formData.draftDescription.trim() || formData.description.trim(),
                        attachments: formData.attachments || []
                    };
                }
                return t;
            });
            saveTemplates(updated);
        }

        setEditingTemplate(null);
    };

    return (
        <div className="dashboard-container" style={{ gridTemplateColumns: '1fr' }}>
            <div className="dashboard-main">
                {/* Header bar with Action Buttons */}
                <div className="section-header-bar" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="section-title-group">
                        <span style={{ fontSize: '1.4rem' }}>📄</span>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <h2 className="welcome-title">Official Document & Policy Templates</h2>
                                <span className="term-badge" style={{ background: '#EFF6FF', color: '#2563EB', borderColor: '#BFDBFE' }}>
                                    {templates.length} Templates
                                </span>
                            </div>
                            <p className="welcome-subtitle">
                                Standardized university forms, policy guidelines, and PDF specifications. Add, customize, attach reference documents, or draft proposals directly from templates.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button 
                            className="btn btn-outline" 
                            onClick={handleResetDefaults}
                            title="Reset all templates back to university defaults with PDF specs"
                        >
                            <span>🔄 Reset Defaults</span>
                        </button>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleOpenAdd}
                            title="Create a new official template with PDF or form attachments"
                        >
                            <span>+ Add Template</span>
                        </button>
                    </div>
                </div>

                {/* Templates Grid Card */}
                <div className="workspace-card">
                    {templates.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                            <span style={{ fontSize: '3rem' }}>📂</span>
                            <h3 style={{ marginTop: '1rem', color: '#0F172A' }}>No Templates Available</h3>
                            <p style={{ margin: '0.5rem 0 1.5rem' }}>Create a new document template or reset to standard university defaults.</p>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                                <button className="btn btn-primary" onClick={handleOpenAdd}>+ Add Template</button>
                                <button className="btn btn-outline" onClick={handleResetDefaults}>Reset Defaults</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
                            {templates.map(template => {
                                const templateAttachments = template.attachments || [];

                                return (
                                    <div 
                                        key={template.id} 
                                        style={{ 
                                            border: '1px solid #E2E8F0', 
                                            borderRadius: '12px', 
                                            padding: '1.4rem', 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            gap: '0.85rem', 
                                            background: '#F8FAFC',
                                            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Top Card Row: Icon, Titles & Edit/Delete Controls */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ fontSize: '2rem' }}>{template.icon || '📄'}</span>
                                                <div>
                                                    <h4 style={{ margin: 0, color: '#0F172A', fontSize: '1.05rem', fontWeight: 700, lineHeight: '1.3' }}>
                                                        {template.title}
                                                    </h4>
                                                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                        {template.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action buttons (Edit & Delete) */}
                                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                                    onClick={() => handleOpenEdit(template)}
                                                    title="Edit template fields & attachments"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', color: '#EF4444', borderColor: '#FCA5A5' }}
                                                    onClick={() => handleDelete(template.id)}
                                                    title="Delete template"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                                            {template.description}
                                        </p>

                                        {/* Pre-filled preview info badge */}
                                        <div style={{ 
                                            background: '#FFFFFF', 
                                            border: '1px solid #E2E8F0', 
                                            borderRadius: '8px', 
                                            padding: '0.5rem 0.75rem',
                                            fontSize: '0.75rem',
                                            color: '#64748B',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.2rem'
                                        }}>
                                            <div><strong>Default Title:</strong> {template.draftTitle || template.title}</div>
                                        </div>

                                        {/* Attached Reference Documents & Specs Section */}
                                        <div style={{ marginTop: '0.25rem' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span>📎 Attached Specs & Documents</span>
                                                <span style={{ fontSize: '0.7rem', color: templateAttachments.length > 0 ? '#2563EB' : '#94A3B8', fontWeight: 600 }}>
                                                    {templateAttachments.length} {templateAttachments.length === 1 ? 'file' : 'files'}
                                                </span>
                                            </div>

                                            {templateAttachments.length > 0 ? (
                                                <div className="template-attachment-pills">
                                                    {templateAttachments.map(att => (
                                                        <div 
                                                            key={att.id} 
                                                            className="template-file-pill" 
                                                            onClick={() => handleDownloadFile(att)}
                                                            title={`Click to view/download ${att.name}`}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflow: 'hidden' }}>
                                                                <span style={{ fontSize: '0.95rem' }}>{att.icon || '📄'}</span>
                                                                <span style={{ fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                                    {att.name}
                                                                </span>
                                                            </div>
                                                            <span style={{ fontSize: '0.7rem', color: '#64748B', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>
                                                                {att.size} ⬇️
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic', padding: '0.2rem 0' }}>
                                                    No specification documents attached. Click Edit to attach files.
                                                </div>
                                            )}
                                        </div>

                                        {/* Use Template Action */}
                                        <button 
                                            className="btn btn-primary" 
                                            style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                                            onClick={() => onUseTemplate(template)}
                                            title="Start a new proposal with this template's pre-filled text and attached documents"
                                        >
                                            <span>✍️ Use Template</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ADD / EDIT TEMPLATE MODAL */}
            {editingTemplate && (
                <div className="modal-overlay" onClick={() => setEditingTemplate(null)}>
                    <div 
                        className="modal-content" 
                        style={{ maxWidth: '680px' }} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingTemplate.isNew ? '+ Create Document Template' : '✏️ Edit Document Template'}
                            </h2>
                            <button className="modal-close-btn" onClick={() => setEditingTemplate(null)}>×</button>
                        </div>

                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                            <div className="modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
                                {/* Title */}
                                <div className="form-group">
                                    <label className="form-label">Template Title *</label>
                                    <input 
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Laboratory Equipment Grant Proposal"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Category & Icon Row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select 
                                            className="form-input"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {PRESET_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Icon / Emoji</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input 
                                                type="text"
                                                className="form-input"
                                                style={{ textAlign: 'center', fontSize: '1.25rem', width: '60px' }}
                                                value={formData.icon}
                                                maxLength={4}
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            />
                                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                {PRESET_ICONS.slice(0, 5).map(ico => (
                                                    <button
                                                        key={ico}
                                                        type="button"
                                                        style={{ 
                                                            background: formData.icon === ico ? '#EFF6FF' : '#F1F5F9',
                                                            border: '1px solid',
                                                            borderColor: formData.icon === ico ? '#3B82F6' : '#CBD5E1',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            padding: '0.2rem 0.4rem',
                                                            fontSize: '1rem'
                                                        }}
                                                        onClick={() => setFormData({ ...formData, icon: ico })}
                                                    >
                                                        {ico}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Overview Description */}
                                <div className="form-group">
                                    <label className="form-label">Template Overview / Guidance</label>
                                    <textarea 
                                        className="form-textarea"
                                        rows="2"
                                        placeholder="Brief summary of who should use this template and what policy it complies with..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                {/* Pre-filled Draft Title */}
                                <div className="form-group">
                                    <label className="form-label">Default Proposal Title Format</label>
                                    <input 
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Lab Safety Inspection: [Room / Building]"
                                        value={formData.draftTitle}
                                        onChange={(e) => setFormData({ ...formData, draftTitle: e.target.value })}
                                    />
                                    <small style={{ color: '#64748B', fontSize: '0.75rem' }}>
                                        This text will automatically populate the Proposal Title when a faculty member uses this template.
                                    </small>
                                </div>

                                {/* Pre-filled Draft Description */}
                                <div className="form-group">
                                    <label className="form-label">Default Proposal Content / Sections</label>
                                    <textarea 
                                        className="form-textarea"
                                        rows="5"
                                        placeholder="Provide boilerplate sections, checklist items, or questions to prompt the faculty member..."
                                        value={formData.draftDescription}
                                        onChange={(e) => setFormData({ ...formData, draftDescription: e.target.value })}
                                    />
                                    <small style={{ color: '#64748B', fontSize: '0.75rem' }}>
                                        Boilerplate text and prompts that will automatically pre-fill into the proposal rationale.
                                    </small>
                                </div>

                                {/* ATTACHED DOCUMENTS & SPECIFICATIONS SECTION */}
                                <div className="form-group" style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                        <label className="form-label" style={{ fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A' }}>
                                            <span>📎 Attached Documents & Policy Specifications</span>
                                        </label>
                                        <span style={{ fontSize: '0.75rem', color: '#2563EB', background: '#EFF6FF', padding: '0.2rem 0.55rem', borderRadius: '12px', fontWeight: 600 }}>
                                            {(formData.attachments || []).length} Files Attached
                                        </span>
                                    </div>
                                    <small style={{ color: '#64748B', fontSize: '0.78rem', display: 'block', marginBottom: '0.9rem' }}>
                                        Attach official university policy PDFs, syllabus rubrics, and financial spreadsheets. Faculty who use this template will have instant access to these files.
                                    </small>

                                    {/* Real File Input & Upload Dropzone */}
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        multiple 
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" 
                                        style={{ display: 'none' }} 
                                        onChange={handleFileSelect} 
                                    />
                                    <div 
                                        className="template-upload-dropzone"
                                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                    >
                                        <span style={{ fontSize: '2rem' }}>📁</span>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                            Click to Upload or Drag & Drop Documents Here
                                        </div>
                                        <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                            Supports PDF, Word (.docx), Excel (.xlsx), and plain text documents
                                        </span>
                                    </div>

                                    {/* Quick Preset Buttons */}
                                    <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Quick Add Standard Forms:</span>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                                            onClick={() => addQuickPreset("University_Accreditation_Rubric_2026.pdf", "1.4 MB", "📕")}
                                        >
                                            + Policy PDF
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                                            onClick={() => addQuickPreset("Requisition_Budget_Worksheet.xlsx", "640 KB", "📊")}
                                        >
                                            + Budget Excel
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                                            onClick={() => addQuickPreset("Department_Signoff_Slip.docx", "280 KB", "📝")}
                                        >
                                            + Sign-Off Doc
                                        </button>
                                    </div>

                                    {/* List of Attached Files */}
                                    {formData.attachments && formData.attachments.length > 0 && (
                                        <div className="template-attachments-list">
                                            {formData.attachments.map((att, idx) => (
                                                <div key={att.id || idx} className="template-attachment-item">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                        <span style={{ fontSize: '1.25rem' }}>{att.icon || '📄'}</span>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.85rem' }}>{att.name}</div>
                                                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{att.size} • Attached Specification</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAttachment(att.id)}
                                                        style={{ background: 'transparent', border: '1px solid #FECACA', borderRadius: '6px', color: '#DC2626', cursor: 'pointer', padding: '0.25rem 0.55rem', fontSize: '0.75rem', fontWeight: 600 }}
                                                        title="Remove this attachment"
                                                    >
                                                        ✕ Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer" style={{ flexShrink: 0 }}>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setEditingTemplate(null)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingTemplate.isNew ? 'Save New Template' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
