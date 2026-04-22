import { useWorkflowStore } from '../store/workflowStore';

export function Toolbar() {
  const { nodes, edges, setSimulationOpen } = useWorkflowStore((s) => s);

  const exportJSON = () => {
    const payload = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-brand">HR Workflow Designer</span>
      </div>
      <div className="toolbar-right">
        <button className="btn-ghost btn-sm" onClick={exportJSON}>
          Export JSON
        </button>
        <button className="btn-primary" onClick={() => setSimulationOpen(true)}>
          Run Simulation
        </button>
      </div>
    </header>
  );
}
