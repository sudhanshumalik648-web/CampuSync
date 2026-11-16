/**
 * CampusSync - TaskCard Component
 * Crisp white card featuring department pill with tooltip, calendar icon, avatar, drag handle, and italicized status attribution.
 */

export function TaskCard({ task, onDragStart, onClickCard, isSelected, onToggleSelect, onOpenDocument }) {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date('2026-07-29');

    return (
        <div 
            className={`task-card ${isSelected ? 'task-card-selected' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            onClick={() => onClickCard(task)}
            title="Click to view full details, threaded comments, and audit history"
            style={isSelected ? { borderColor: '#3B82F6', background: '#F0F9FF' } : {}}
        >
            <div className="task-card-top">
                <div className="task-tags-group" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    {onToggleSelect && (
                        <div 
                            className={`task-select-checkbox ${isSelected ? 'checked' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleSelect(task.id);
                            }}
                            title={isSelected ? "Deselect proposal" : "Select proposal for batch print"}
                        >
                            {isSelected ? '✓' : ''}
                        </div>
                    )}
                    {/* Shortform Color-Coded Department Tag with Tooltip */}
                    <span 
                        className="dept-tag" 
                        style={{ backgroundColor: task.creator_dept_color || '#3B82F6' }}
                        data-tooltip={task.creator_dept_name || 'Computer Science Department'}
                    >
                        {task.creator_dept_code || 'CS'}
                    </span>

                    {/* Targeted Routing Indicator for confidential/restricted tasks */}
                    {task.target_department_id && (
                        <span className="target-badge" title="Granular Access Control: Only visible to the targeted department, creator, and Deans">
                            🔒 Target: {task.target_dept_code || 'ACC'}
                        </span>
                    )}
                </div>

                {/* Visual Drag Handle (⋮⋮) */}
                <span className="drag-handle" title="Drag and drop to move between board columns">
                    ⋮⋮
                </span>
            </div>

            <div className="task-card-title">
                {task.title}
            </div>

            {/* Quick Attached Document Pill */}
            {task.attachments && task.attachments.length > 0 && (
                <div 
                    className="task-card-doc-pill"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenDocument) onOpenDocument(task.attachments[0], task);
                        else onClickCard(task);
                    }}
                    title={`Click to open document: ${task.attachments[0].name}`}
                >
                    <span>{task.attachments[0].icon || '📎'}</span>
                    <span style={{ fontWeight: 600, maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.attachments[0].name}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#2563EB', fontWeight: 700 }}>👁️ Open</span>
                </div>
            )}

            <div className="task-card-meta">
                {/* Due Date Calendar Icon */}
                <div className={`task-due-date ${isOverdue ? 'overdue' : ''}`} title="Target completion date">
                    <span>📅</span>
                    <span>{task.due_date || '2026-08-15'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {/* Comment Count Indicator */}
                    {task.comment_count > 0 && (
                        <span className="comment-counter" title={`${task.comment_count} threaded comments`}>
                            💬 {task.comment_count}
                        </span>
                    )}

                    {/* Assigned Faculty Avatar Initial Badge */}
                    <div 
                        className="avatar-badge" 
                        style={{ backgroundColor: task.creator_dept_color || '#334155' }}
                        title={`Created by ${task.creator_name} (${task.creator_role})`}
                    >
                        {task.creator_avatar || 'CS'}
                    </div>
                </div>
            </div>

            {/* Status Attribution (Italicized at the bottom) */}
            <div className="status-attribution">
                <span>Moved by {task.last_moved_by_name || task.creator_name || 'Prof. Davis'}</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>{task.status || 'Proposed'}</span>
            </div>
        </div>
    );
}
