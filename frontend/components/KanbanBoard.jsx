/**
 * CampusSync - Department Workflow Board Component
 * Features distinct sections for Proposed, Review, Approve, and Final requests.
 * Includes view switching between Distinct Grouped Sections and 4-Column Board view.
 */

import React, { useState } from 'react';
import { Column } from './Column.jsx';

const SECTION_CONFIGS = [
    {
        id: 1,
        key: 'proposed',
        title: 'Proposed Requests',
        shortTitle: 'Proposed',
        icon: '💡',
        color: '#2563EB',
        bgColor: '#EFF6FF',
        badgeBg: '#DBEAFE',
        badgeColor: '#1D4ED8',
        tag: 'STAGE 1',
        description: 'New curricular changes, lab equipment proposals, and academic initiatives awaiting review.'
    },
    {
        id: 2,
        key: 'review',
        title: 'Department Review Requests',
        shortTitle: 'Review',
        icon: '👀',
        color: '#D97706',
        bgColor: '#FEF3C7',
        badgeBg: '#FDE68A',
        badgeColor: '#B45309',
        tag: 'STAGE 2',
        description: 'Proposals currently under active peer discussion and inter-departmental faculty review.'
    },
    {
        id: 3,
        key: 'approve',
        title: 'Dean Approval Requests',
        shortTitle: 'Approve',
        icon: '⚖️',
        color: '#8B5CF6',
        bgColor: '#F3E8FF',
        badgeBg: '#E9D5FF',
        badgeColor: '#7C3AED',
        tag: 'STAGE 3',
        description: 'Proposals endorsed by department heads, awaiting formal Dean & Executive sign-off.'
    },
    {
        id: 4,
        key: 'final',
        title: 'Finalized Requests',
        shortTitle: 'Final',
        icon: '✅',
        color: '#059669',
        bgColor: '#ECFDF5',
        badgeBg: '#D1FAE5',
        badgeColor: '#047857',
        tag: 'STAGE 4',
        description: 'Formally approved, scheduled, and funded academic term proposals.'
    }
];

export function KanbanBoard({ 
    columns, 
    tasks, 
    onDragStart, 
    onDragOver, 
    onDragLeave, 
    onDrop, 
    onClickCard,
    selectedTaskIds = [],
    onToggleSelect,
    onSelectAll,
    onClearSelection,
    onPrintSelected,
    onOpenDocument
}) {
    const [viewMode, setViewMode] = useState('sections'); // 'sections' | 'columns'
    const [activeSectionFilter, setActiveSectionFilter] = useState('all'); // 'all' | 1 | 2 | 3 | 4
    const [dragOverSectionId, setDragOverSectionId] = useState(null);

    // Group tasks by column_id
    const getTasksForColumn = (columnId) => {
        return tasks.filter(t => (t.column_id || 1) === columnId);
    };

    // Filter sections if activeSectionFilter is not 'all'
    const visibleSections = activeSectionFilter === 'all' 
        ? SECTION_CONFIGS 
        : SECTION_CONFIGS.filter(s => s.id === activeSectionFilter);

    const handleSectionDragOver = (e, sectionId) => {
        e.preventDefault();
        setDragOverSectionId(sectionId);
        if (onDragOver) onDragOver(e, sectionId);
    };

    const handleSectionDragLeave = (e) => {
        setDragOverSectionId(null);
        if (onDragLeave) onDragLeave(e);
    };

    const handleSectionDrop = (e, sectionId) => {
        e.preventDefault();
        setDragOverSectionId(null);
        if (onDrop) onDrop(e, sectionId);
    };

    const isAllSelected = tasks.length > 0 && selectedTaskIds.length === tasks.length;

    const handleToggleAll = () => {
        if (isAllSelected) {
            if (onClearSelection) onClearSelection();
        } else {
            if (onSelectAll) onSelectAll(tasks.map(t => t.id));
        }
    };

    return (
        <div className="board-container">
            {/* Top Bar: Title, Stats & View Controls */}
            <div className="board-header-bar" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div className="board-info">
                    <h1 className="board-title">University Department Workflow Board</h1>
                    <span className="board-stats-pill">
                        {tasks.length} Active Proposals
                    </span>
                    {selectedTaskIds.length > 0 && (
                        <span className="board-stats-pill" style={{ background: '#EFF6FF', color: '#2563EB', borderColor: '#BFDBFE' }}>
                            {selectedTaskIds.length} Selected
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {/* Batch Selection & Print Buttons */}
                    {onToggleSelect && tasks.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                            onClick={handleToggleAll}
                        >
                            <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
                        </button>
                    )}

                    {selectedTaskIds.length > 0 && onPrintSelected && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', background: '#2563EB', borderColor: '#3B82F6' }}
                            onClick={onPrintSelected}
                            title="Print detailed view of all selected requests"
                        >
                            <span>🖨️ Print Selected ({selectedTaskIds.length})</span>
                        </button>
                    )}

                    {/* View Switcher: Distinct Sections vs 4-Column Board */}
                    <div style={{ display: 'flex', background: '#F1F5F9', padding: '0.25rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <button
                            type="button"
                            className={`btn ${viewMode === 'sections' ? 'btn-primary' : ''}`}
                            style={{ 
                                padding: '0.35rem 0.75rem', 
                                fontSize: '0.82rem',
                                background: viewMode === 'sections' ? '#0F172A' : 'transparent',
                                color: viewMode === 'sections' ? '#FFFFFF' : '#475569',
                                border: 'none',
                                borderRadius: '6px'
                            }}
                            onClick={() => setViewMode('sections')}
                            title="View proposals in distinct horizontal sections"
                        >
                            📑 Distinct Sections
                        </button>
                        <button
                            type="button"
                            className={`btn ${viewMode === 'columns' ? 'btn-primary' : ''}`}
                            style={{ 
                                padding: '0.35rem 0.75rem', 
                                fontSize: '0.82rem',
                                background: viewMode === 'columns' ? '#0F172A' : 'transparent',
                                color: viewMode === 'columns' ? '#FFFFFF' : '#475569',
                                border: 'none',
                                borderRadius: '6px'
                            }}
                            onClick={() => setViewMode('columns')}
                            title="View proposals in side-by-side 4 columns"
                        >
                            📊 4-Column Board
                        </button>
                    </div>
                </div>
            </div>

            {/* Section Filter Navigation Pills */}
            <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginBottom: '1.5rem', 
                overflowX: 'auto', 
                paddingBottom: '0.4rem',
                borderBottom: '1px solid #E2E8F0' 
            }}>
                <button
                    type="button"
                    style={{
                        padding: '0.45rem 0.9rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: activeSectionFilter === 'all' ? '#0F172A' : '#E2E8F0',
                        background: activeSectionFilter === 'all' ? '#0F172A' : '#FFFFFF',
                        color: activeSectionFilter === 'all' ? '#FFFFFF' : '#64748B',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.15s ease'
                    }}
                    onClick={() => setActiveSectionFilter('all')}
                >
                    <span>All Stages</span>
                    <span style={{ 
                        background: activeSectionFilter === 'all' ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '10px',
                        fontSize: '0.72rem'
                    }}>
                        {tasks.length}
                    </span>
                </button>

                {SECTION_CONFIGS.map(section => {
                    const count = getTasksForColumn(section.id).length;
                    const isActive = activeSectionFilter === section.id;
                    return (
                        <button
                            key={section.id}
                            type="button"
                            style={{
                                padding: '0.45rem 0.9rem',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                borderRadius: '20px',
                                border: '1px solid',
                                borderColor: isActive ? section.color : '#E2E8F0',
                                background: isActive ? section.bgColor : '#FFFFFF',
                                color: isActive ? section.color : '#64748B',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                transition: 'all 0.15s ease'
                            }}
                            onClick={() => setActiveSectionFilter(section.id)}
                        >
                            <span>{section.icon}</span>
                            <span>{section.shortTitle}</span>
                            <span style={{ 
                                background: isActive ? section.badgeBg : '#F1F5F9',
                                color: isActive ? section.badgeColor : '#64748B',
                                padding: '0.1rem 0.45rem',
                                borderRadius: '10px',
                                fontSize: '0.72rem',
                                fontWeight: 700
                            }}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* MODE 1: DISTINCT GROUPED SECTIONS VIEW */}
            {viewMode === 'sections' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {visibleSections.map(section => {
                        const sectionTasks = getTasksForColumn(section.id);
                        const isDragOver = dragOverSectionId === section.id;

                        return (
                            <div 
                                key={section.id}
                                className="workspaces-section"
                                style={{
                                    border: isDragOver ? `2px dashed ${section.color}` : '1px solid #E2E8F0',
                                    borderRadius: '16px',
                                    padding: '1.25rem 1.5rem',
                                    background: isDragOver ? section.bgColor : '#FFFFFF',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s ease'
                                }}
                                onDragOver={(e) => handleSectionDragOver(e, section.id)}
                                onDragLeave={handleSectionDragLeave}
                                onDrop={(e) => handleSectionDrop(e, section.id)}
                            >
                                {/* Section Header Bar */}
                                <div className="section-header-bar" style={{ marginBottom: '1rem' }}>
                                    <div className="section-title-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span 
                                            className="section-icon" 
                                            style={{ 
                                                background: section.bgColor, 
                                                color: section.color, 
                                                padding: '0.5rem', 
                                                borderRadius: '10px',
                                                fontSize: '1.25rem' 
                                            }}
                                        >
                                            {section.icon}
                                        </span>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                <h3 className="section-title" style={{ margin: 0, fontSize: '1.15rem' }}>
                                                    {section.title}
                                                </h3>
                                                <span 
                                                    style={{ 
                                                        background: section.badgeBg, 
                                                        color: section.badgeColor, 
                                                        padding: '0.15rem 0.5rem', 
                                                        borderRadius: '6px', 
                                                        fontSize: '0.7rem', 
                                                        fontWeight: 700 
                                                    }}
                                                >
                                                    {section.tag}
                                                </span>
                                            </div>
                                            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
                                                {section.description}
                                            </p>
                                        </div>
                                    </div>

                                    <span style={{ 
                                        fontSize: '0.85rem', 
                                        color: section.color, 
                                        fontWeight: 700,
                                        background: section.bgColor,
                                        padding: '0.3rem 0.75rem',
                                        borderRadius: '20px'
                                    }}>
                                        {sectionTasks.length} {sectionTasks.length === 1 ? 'proposal' : 'proposals'}
                                    </span>
                                </div>

                                {/* Section Proposals List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {sectionTasks.length > 0 ? (
                                        sectionTasks.map(task => (
                                            <div 
                                                key={task.id}
                                                className="workspace-card"
                                                draggable
                                                onDragStart={(e) => onDragStart(e, task)}
                                                onClick={() => onClickCard(task)}
                                                style={{ 
                                                    padding: '1.1rem 1.4rem', 
                                                    marginBottom: '0', 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center', 
                                                    cursor: 'pointer',
                                                    borderLeft: `4px solid ${section.color}`,
                                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                                                }}
                                                title="Click to view details, discussion, and documents. Drag to advance stage."
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1, paddingRight: '1.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                        {onToggleSelect && (
                                                            <div 
                                                                className={`task-select-checkbox ${selectedTaskIds.includes(task.id) ? 'checked' : ''}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onToggleSelect(task.id);
                                                                }}
                                                                title={selectedTaskIds.includes(task.id) ? "Deselect proposal" : "Select proposal for batch print"}
                                                            >
                                                                {selectedTaskIds.includes(task.id) ? '✓' : ''}
                                                            </div>
                                                        )}
                                                        <span 
                                                            className="dept-tag" 
                                                            style={{ 
                                                                backgroundColor: task.creator_dept_color || '#3B82F6', 
                                                                padding: '0.2rem 0.6rem', 
                                                                fontSize: '0.75rem' 
                                                            }}
                                                        >
                                                            {task.creator_dept_code || 'UNIV'}
                                                        </span>
                                                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '1.02rem' }}>
                                                            {task.title}
                                                        </span>
                                                        {task.target_department_id && (
                                                            <span style={{ 
                                                                fontSize: '0.7rem', 
                                                                background: '#FEF3C7', 
                                                                color: '#B45309', 
                                                                padding: '0.15rem 0.45rem', 
                                                                borderRadius: '4px',
                                                                fontWeight: 600
                                                            }}>
                                                                🔒 Routed to {task.target_dept_code || 'Accounts'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {task.description && (
                                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                                                            {task.description.length > 140 
                                                                ? task.description.substring(0, 140) + '...' 
                                                                : task.description}
                                                        </p>
                                                    )}

                                                    <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '1.2rem', alignItems: 'center', marginTop: '0.2rem' }}>
                                                        <span>👤 {task.creator_name} ({task.creator_role})</span>
                                                        <span>📅 Due: {task.due_date || '2026-08-15'}</span>
                                                        {task.last_moved_by_name && (
                                                            <span style={{ fontStyle: 'italic', color: '#94A3B8' }}>
                                                                Moved by {task.last_moved_by_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    {/* Quick Open Document Button */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline"
                                                        style={{
                                                            padding: '0.35rem 0.75rem',
                                                            fontSize: '0.76rem',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.4rem',
                                                            color: '#1D4ED8',
                                                            borderColor: '#BFDBFE',
                                                            background: '#EFF6FF',
                                                            fontWeight: 600,
                                                            borderRadius: '6px'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const docToOpen = (task.attachments && task.attachments.length > 0)
                                                                ? task.attachments[0]
                                                                : { id: 'brief_' + task.id, name: 'Proposal_Brief_' + task.id + '.pdf', size: '245 KB', type: 'application/pdf', icon: '📕' };
                                                            if (onOpenDocument) onOpenDocument(docToOpen, task);
                                                        }}
                                                        title="Open, read, and inspect the attached proposal specification document"
                                                    >
                                                        <span>📄 Read Document</span>
                                                    </button>

                                                    {task.comment_count > 0 && (
                                                        <span style={{ 
                                                            fontSize: '0.8rem', 
                                                            color: '#64748B', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '0.3rem',
                                                            background: '#F1F5F9',
                                                            padding: '0.25rem 0.6rem',
                                                            borderRadius: '12px'
                                                        }}>
                                                            💬 {task.comment_count}
                                                        </span>
                                                    )}

                                                    <div 
                                                        className="avatar-stack-item" 
                                                        style={{ 
                                                            backgroundColor: task.creator_dept_color || '#3B82F6',
                                                            width: '36px',
                                                            height: '36px',
                                                            fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        {task.creator_avatar || 'CS'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div 
                                            style={{ 
                                                padding: '2.5rem', 
                                                textAlign: 'center', 
                                                color: '#94A3B8', 
                                                border: '2px dashed #E2E8F0', 
                                                borderRadius: '12px',
                                                background: '#F8FAFC' 
                                            }}
                                        >
                                            <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.5rem' }}>{section.icon}</span>
                                            <p style={{ margin: 0, fontWeight: 500 }}>
                                                No requests currently in {section.title}.
                                            </p>
                                            <small style={{ color: '#CBD5E1' }}>
                                                Drag proposals from other stages and drop here to advance.
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODE 2: 4-COLUMN KANBAN BOARD VIEW */}
            {viewMode === 'columns' && (
                <div 
                    className="kanban-grid"
                    style={{
                        gridTemplateColumns: activeSectionFilter !== 'all' 
                            ? '1fr' 
                            : 'repeat(4, 1fr)'
                    }}
                >
                    {columns
                        .filter(col => activeSectionFilter === 'all' || col.id === activeSectionFilter)
                        .map((col) => (
                            <Column 
                                key={col.id}
                                column={col}
                                tasks={getTasksForColumn(col.id)}
                                onDragStart={onDragStart}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                onClickCard={onClickCard}
                                selectedTaskIds={selectedTaskIds}
                                onToggleSelect={onToggleSelect}
                                onOpenDocument={onOpenDocument}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
