import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from '@xyflow/react';
import type { Node, NodeMouseHandler } from '@xyflow/react';
import { useWorkflowStore } from '../store/workflowStore';
import { nodeTypes } from '../nodes';
import type { WorkflowNodeData, NodeKind } from '../types';

// Default data shapes for each node kind — used when dropping from the sidebar
function makeDefaultData(kind: NodeKind): WorkflowNodeData {
  switch (kind) {
    case 'start':     return { kind, title: 'Start', metadata: [] };
    case 'task':      return { kind, title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval':  return { kind, title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 0 };
    case 'automated': return { kind, title: 'Automated Step', actionId: '', params: {} };
    case 'end':       return { kind, endMessage: 'Workflow Complete', summaryFlag: false };
  }
}

export function WorkflowCanvas() {
  const { nodes, edges, setNodes, setEdges, connect, selectNode } = useWorkflowStore((s) => s);

  const onNodeClick: NodeMouseHandler = useCallback((_e, node) => {
    selectNode(node.id);
  }, [selectNode]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  // Drop handler — reads the node kind from dataTransfer and places the node at cursor
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const kind = e.dataTransfer.getData('application/workflow-node') as NodeKind;
      if (!kind) return;

      const bounds = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - bounds.left - 90,
        y: e.clientY - bounds.top - 30,
      };

      const id = `node-${Date.now()}`;
      const newNode: Node<WorkflowNodeData> = {
        id,
        type: kind,
        position,
        data: makeDefaultData(kind),
      };

      useWorkflowStore.getState().addNode(newNode);
      selectNode(id);
    },
    [selectNode]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="canvas-wrapper" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        onConnect={connect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        deleteKeyCode="Delete"
        defaultEdgeOptions={{ animated: true, style: { stroke: '#4f5464', strokeWidth: 2 } }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2a2d3a" />
        <Controls className="flow-controls" />
        <MiniMap
          className="flow-minimap"
          nodeColor={(n) => {
            const kind = (n.data as WorkflowNodeData).kind;
            return { start: '#606c38', task: '#dda15e', approval: '#bc6c25', automated: '#8a9a50', end: '#4a3520' }[kind] ?? '#888';
          }}
          maskColor="rgba(15,17,26,0.7)"
        />
      </ReactFlow>
    </div>
  );
}
