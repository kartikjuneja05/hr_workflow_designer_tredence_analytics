const NODE_PALETTE = [
  { kind: 'start',     label: 'Start',          hint: 'Entry point'   },
  { kind: 'task',      label: 'Task',            hint: 'Human task'    },
  { kind: 'approval',  label: 'Approval',        hint: 'Sign-off step' },
  { kind: 'automated', label: 'Automated Step',  hint: 'System action' },
  { kind: 'end',       label: 'End',             hint: 'Completion'    },
] as const;

export function Sidebar() {
  const onDragStart = (e: React.DragEvent, kind: string) => {
    e.dataTransfer.setData('application/workflow-node', kind);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">HR</span>
        <span className="sidebar-title">Workflow Designer</span>
      </div>

      <p className="sidebar-section-label">Drag to canvas</p>

      <div className="palette">
        {NODE_PALETTE.map((item) => (
          <div
            key={item.kind}
            className="palette-item"
            draggable
            onDragStart={(e) => onDragStart(e, item.kind)}
          >
            <div>
              <div className="palette-label">{item.label}</div>
              <div className="palette-hint">{item.hint}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <p className="sidebar-tip">Click a node to edit it</p>
        <p className="sidebar-tip">Drag between handles to connect</p>
      </div>
    </aside>
  );
}
