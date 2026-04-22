// Core node types for the workflow designer

export type NodeKind = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface KeyValue {
  key: string;
  value: string;
}

// React Flow requires data to satisfy Record<string, unknown>
export interface StartData extends Record<string, unknown> {
  kind: 'start';
  title: string;
  metadata: KeyValue[];
}

export interface TaskData extends Record<string, unknown> {
  kind: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValue[];
}

export interface ApprovalData extends Record<string, unknown> {
  kind: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedData extends Record<string, unknown> {
  kind: 'automated';
  title: string;
  actionId: string;
  params: Record<string, string>;
}

export interface EndData extends Record<string, unknown> {
  kind: 'end';
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData =
  | StartData
  | TaskData
  | ApprovalData
  | AutomatedData
  | EndData;

// What the mock /simulate API returns
export interface SimulationStep {
  nodeId: string;
  label: string;
  status: 'success' | 'skipped' | 'error';
  message: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
}

// Shape returned by GET /automations
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}
