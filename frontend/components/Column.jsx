/**
 * CampusSync - Column Component (#F1F5F9 Light Gray Background)
 * Handles HTML5 drag-and-drop target zones and displays task count with distinct stage badges.
 */
import { TaskCard } from './TaskCard.jsx';

export function Column({ 
    column, 
    tasks, 
    onDragStart, 
    onDragOver, 
    onDragLeave, 
    onDrop, 
    onClickCard,
    selectedTaskIds = [],
    onToggleSelect,
    onOpenDocument
}) {
    const stageDetails = {
        1: { icon: '💡', title: 'Proposed Requests', tag: 'Stage 1', dot: '#3B82F6', desc: 'New submissions' },
        2: { icon: '👀', title: 'Department Review', tag: 'Stage 2', dot: '#F59E0B', desc: 'Faculty evaluation' },
        3: { icon: '⚖️', title: 'Dean Approval', tag: 'Stage 3', dot: '#8B5CF6', desc: 'Executive sign-off' },
        4: { icon: '✅', title: 'Finalized Requests', tag: 'Stage 4', dot: '#10B981', desc: 'Approved & scheduled' }
    };

    const details = stageDetails[column.position_order || column.id] || {
        icon: '📋',
        title: column.title,
        tag: 'Workflow',
        dot: '#3B82F6',
        desc: ''
    };

    return (
        <div 
            className="kanban-column"
            onDragOver={(e) => onDragOver(e, column.id)}
            onDragLeave={(e) => onDragLeave(e)}
            onDrop={(e) => onDrop(e, column.id)}
        >
            <div className="column-header">
                <div className="column-title-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem' }}>{details.icon}</span>
                        <h3 className="column-title">{details.title}</h3>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                        {details.desc}
                    </span>
                </div>

                <span className="column-count" title="Total tasks in this stage">
                    {tasks.length}
                </span>
            </div>

            <div className="column-task-list">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onDragStart={onDragStart} 
                            onClickCard={onClickCard} 
                            isSelected={selectedTaskIds.includes(task.id)}
                            onToggleSelect={onToggleSelect}
                            onOpenDocument={onOpenDocument}
                        />
                    ))
                ) : (
                    <div className="empty-drop-zone">
                        Drop {details.title.toLowerCase()} here
                    </div>
                )}
            </div>
        </div>
    );
}
