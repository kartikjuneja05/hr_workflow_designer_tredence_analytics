import { useState } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { simulateWorkflow } from '../mocks/api';
import type { SimulationResult } from '../types';
import type { Node } from '@xyflow/react';
import type { WorkflowNodeData } from '../types';

export function SimulationPanel() {
  const { nodes, edges, simulationOpen, setSimulationOpen } = useWorkflowStore((s) => s);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  if (!simulationOpen) return null;

  const run = async () => {
    setLoading(true);
    setResult(null);
    const res = await simulateWorkflow(nodes as Node<WorkflowNodeData>[], edges);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="sim-overlay">
      <div className="sim-panel">
        <div className="sim-header">
          <h3>Workflow Sandbox</h3>
          <button className="btn-ghost btn-sm" onClick={() => setSimulationOpen(false)}>Close</button>
        </div>

        <div className="sim-info">
          <span>{nodes.length} nodes</span>
          <span>{edges.length} edges</span>
        </div>

        <button className="btn-primary" onClick={run} disabled={loading}>
          {loading ? 'Running...' : 'Run Simulation'}
        </button>

        {result && (
          <div className="sim-results">
            {result.errors.length > 0 && (
              <div className="sim-errors">
                <p className="sim-section-title">Validation Errors</p>
                {result.errors.map((err, i) => (
                  <div key={i} className="sim-error-item">{err}</div>
                ))}
              </div>
            )}

            {result.steps.length > 0 && (
              <div className="sim-steps">
                <p className="sim-section-title">Execution Log</p>
                {result.steps.map((step, i) => (
                  <div key={step.nodeId} className={`sim-step sim-step-${step.status}`}>
                    <span className="sim-step-num">{i + 1}</span>
                    <span className="sim-step-status">{step.status}</span>
                    <div>
                      <div className="sim-step-label">{step.label}</div>
                      <div className="sim-step-msg">{step.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={`sim-outcome ${result.success ? 'success' : 'failure'}`}>
              {result.success ? 'Simulation passed' : 'Simulation failed'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
