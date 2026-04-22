import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react';
import type { WorkflowNodeData, AutomationAction } from '../types';

interface WorkflowStore {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  automations: AutomationAction[];
  simulationOpen: boolean;

  setNodes: (changes: NodeChange[]) => void;
  setEdges: (changes: EdgeChange[]) => void;
  connect: (connection: Connection) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  addNode: (node: Node<WorkflowNodeData>) => void;
  setAutomations: (actions: AutomationAction[]) => void;
  setSimulationOpen: (open: boolean) => void;
}

// Default canvas starts with a start + task + end to give a sense of the UX
const initialNodes: Node<WorkflowNodeData>[] = [
  {
    id: 'node-1',
    type: 'start',
    position: { x: 300, y: 60 },
    data: { kind: 'start', title: 'Employee Onboarding', metadata: [] },
  },
  {
    id: 'node-2',
    type: 'task',
    position: { x: 280, y: 200 },
    data: {
      kind: 'task',
      title: 'Collect Documents',
      description: 'Gather required onboarding documents from employee.',
      assignee: 'HR Admin',
      dueDate: '',
      customFields: [],
    },
  },
  {
    id: 'node-3',
    type: 'end',
    position: { x: 300, y: 360 },
    data: { kind: 'end', endMessage: 'Onboarding Complete', summaryFlag: true },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'node-1', target: 'node-2' },
  { id: 'e2-3', source: 'node-2', target: 'node-3' },
];

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  automations: [],
  simulationOpen: false,

  setNodes: (changes) =>
    set((s) => ({ nodes: (applyNodeChanges(changes, s.nodes as unknown as Node[]) as unknown) as Node<WorkflowNodeData>[] })),

  setEdges: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

  connect: (connection) =>
    set((s) => ({ edges: addEdge({ ...connection, animated: true }, s.edges) })),

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, patch) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...patch } as WorkflowNodeData } : n
      ),
    })),

  deleteNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),

  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),

  setAutomations: (actions) => set({ automations: actions }),

  setSimulationOpen: (open) => set({ simulationOpen: open }),
}));
