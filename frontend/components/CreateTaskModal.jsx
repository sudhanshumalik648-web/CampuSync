/**
 * CampusSync - CreateTaskModal Component
 * Allows faculty to propose tasks with Public vs. Targeted Department routing (Granular RBAC).
 */

export function CreateTaskModal({ 
    departments, 
    columns, 
    currentUser, 
    onClose, 
    onCreateTask,
    draftTemplate
}) {
    const fileInputRef = React.useRef(null);
    const [title, setTitle] = React.useState(draftTemplate ? draftTemplate.draftTitle : '');
    const [description, setDescription] = React.useState(draftTemplate ? draftTemplate.draftDescription : '');
    const [columnId, setColumnId] = React.useState(1);
    const [targetDeptId, setTargetDeptId] = React.useState('');
    const [dueDate, setDueDate] = React.useState('2026-08-15');
    const [attachments, setAttachments] = React.useState(draftTemplate?.attachments ? [...draftTemplate.attachments] : []);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newAtts = files.map(file => {
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
                id: 'task_att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                name: file.name,
                size: sizeStr,
                type: file.type || 'application/octet-stream',
                icon: icon,
                url: blobUrl
            };
        });

        setAttachments(prev => [...prev, ...newAtts]);
        if (e.target) e.target.value = '';
    };

    const handleRemoveAttachment = (attId) => {
        setAttachments(prev => prev.filter(a => a.id !== attId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onCreateTask({
            title: title.trim(),
            description: description.trim(),
            column_id: parseInt(columnId, 10),
            target_department_id: targetDeptId ? parseInt(targetDeptId, 10) : null,
            due_date: dueDate,
            attachments: attachments
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Propose New Academic Workflow Task</h2>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    <div className="modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
                        <div className="form-group">
                            <label className="form-label">Proposal Title *</label>
                            <input 
                                type="text"
                                className="form-input"
                                placeholder="e.g. CS202 Advanced Algorithms Lab Modernization"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Detailed Proposal & Rationale</label>
                            <textarea 
                                className="form-textarea"
                                rows="4"
                                placeholder="Provide background, resource requirements, and department sign-off details..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Initial Workflow Column</label>
                                <select 
                                    className="form-select"
                                    value={columnId}
                                    onChange={(e) => setColumnId(e.target.value)}
                                >
                                    {columns.map(col => (
                                        <option key={col.id} value={col.id}>
                                            {col.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Target Completion Date</label>
                                <input 
                                    type="date"
                                    className="form-input"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Attached Documentation & Specification Files */}
                        <div className="form-group" style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <label className="form-label" style={{ fontWeight: 600, margin: 0 }}>
                                    📎 Attached Documentation & Specifications ({attachments.length})
                                </label>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    multiple 
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" 
                                    style={{ display: 'none' }} 
                                    onChange={handleFileSelect} 
                                />
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                >
                                    + Attach PDF / Document
                                </button>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginBottom: '0.6rem' }}>
                                Reference documents or templates attached to this academic proposal.
                            </span>

                            {attachments.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                    {attachments.map(att => (
                                        <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                                <span>{att.icon || '📄'}</span>
                                                <span style={{ fontWeight: 600, color: '#0F172A' }}>{att.name}</span>
                                                <span style={{ color: '#64748B', fontSize: '0.72rem' }}>({att.size})</span>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveAttachment(att.id)}
                                                style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
                                    No documents attached yet. Click "+ Attach PDF / Document" to upload guidelines or specs.
                                </div>
                            )}
                        </div>

                        {/* Granular Access Control: Targeted Routing */}
                        <div className="form-group" style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span>🔒 Granular Access Routing (Optional Privacy Restriction)</span>
                            </label>
                            <span style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.4rem' }}>
                                By default, proposals are Public. Selecting a target department restricts visibility exclusively to that department, the creator, and Deans.
                            </span>
                            <select 
                                className="form-select"
                                value={targetDeptId}
                                onChange={(e) => setTargetDeptId(e.target.value)}
                            >
                                <option value="">🌐 Public (Visible to All Faculty & Departments)</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>
                                        🔒 Restrict Exclusively to {d.name} ({d.short_code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>ℹ️</span>
                            <span>
                                Proposing as <strong>{currentUser ? currentUser.name : 'Faculty Member'}</strong> ({currentUser ? currentUser.role : 'Professor'}).
                            </span>
                        </div>
                    </div>

                    <div className="modal-footer" style={{ flexShrink: 0 }}>
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}>
                            <span>🚀 Submit Proposal (Send for Review)</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
