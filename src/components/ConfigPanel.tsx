import { useWorkflowStore } from '../store/workflowStore';
import { StartForm, TaskForm, ApprovalForm, AutomatedForm, EndForm } from './NodeForms';
import type { WorkflowNodeData } from '../types';

const KIND_LABELS: Record<WorkflowNodeData['kind'], string> = {
  start:     'Start Node',
  task:      'Task Node',
  approval:  'Approval Node',
  automated: 'Automated Step',
  end:       'End Node',
};

export function ConfigPanel() {
  const { nodes, selectedNodeId, selectNode, deleteNode } = useWorkflowStore((s) => s);

  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) {
    return (
      <div className="config-panel config-empty">
        <div className="config-hint">
          <span className="config-hint-icon">←</span>
          <p>Select a node to configure it</p>
        </div>
      </div>
    );
  }

  const { data } = node;

  return (
    <div className="config-panel">
      <div className="config-header">
        <h3 className="config-title">{KIND_LABELS[data.kind]}</h3>
        <div className="config-actions">
          <button
            className="btn-danger btn-sm"
            onClick={() => deleteNode(node.id)}
          >
            Delete
          </button>
          <button
            className="btn-ghost btn-sm"
            onClick={() => selectNode(null)}
          >
            Close
          </button>
        </div>
      </div>

      <div className="config-form">
        {data.kind === 'start'     && <StartForm     nodeId={node.id} data={data} />}
        {data.kind === 'task'      && <TaskForm      nodeId={node.id} data={data} />}
        {data.kind === 'approval'  && <ApprovalForm  nodeId={node.id} data={data} />}
        {data.kind === 'automated' && <AutomatedForm nodeId={node.id} data={data} />}
        {data.kind === 'end'       && <EndForm       nodeId={node.id} data={data} />}
      </div>
    </div>
  );
}
