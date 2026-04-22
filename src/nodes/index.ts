import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from './WorkflowNodes';

// Keeping this in one place means I only import nodeTypes from here
export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
} as const;
