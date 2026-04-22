import type { AutomationAction, SimulationResult } from '../types';
import type { Node, Edge } from '@xyflow/react';
import type { WorkflowNodeData } from '../types';

// Simulating network latency so the async patterns feel real
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(200);
  return [
    { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
    { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
    { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
    { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary'] },
    { id: 'trigger_webhook', label: 'Trigger Webhook', params: ['url', 'payload'] },
  ];
}

export async function simulateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): Promise<SimulationResult> {
  await delay(600);

  const errors: string[] = [];

  // Basic structural checks
  const startNodes = nodes.filter((n) => n.data.kind === 'start');
  const endNodes = nodes.filter((n) => n.data.kind === 'end');

  if (startNodes.length === 0) errors.push('Workflow must have a Start node.');
  if (startNodes.length > 1) errors.push('Only one Start node is allowed.');
  if (endNodes.length === 0) errors.push('Workflow must have an End node.');

  // Check for disconnected nodes (except start)
  const connectedIds = new Set<string>();
  edges.forEach((e) => {
    connectedIds.add(e.source);
    connectedIds.add(e.target);
  });
  nodes.forEach((n) => {
    if (n.data.kind !== 'start' && !connectedIds.has(n.id)) {
      errors.push(`Node "${(n.data as { title?: string; endMessage?: string }).title ?? 'End'}" is disconnected.`);
    }
  });

  if (errors.length > 0) {
    return { success: false, steps: [], errors };
  }

  // Walk the graph from start — simple BFS
  const adjMap = new Map<string, string[]>();
  edges.forEach((e) => {
    if (!adjMap.has(e.source)) adjMap.set(e.source, []);
    adjMap.get(e.source)!.push(e.target);
  });

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const steps: SimulationResult['steps'] = [];
  const visited = new Set<string>();
  const queue = [startNodes[0].id];

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const node = nodeMap.get(id)!;
    const data = node.data;

    const label =
      data.kind === 'end'
        ? data.endMessage || 'Workflow Complete'
        : (data as { title: string }).title;

    steps.push({
      nodeId: id,
      label,
      status: 'success',
      message: getStepMessage(data),
    });

    (adjMap.get(id) ?? []).forEach((next) => queue.push(next));
  }

  return { success: true, steps, errors: [] };
}

function getStepMessage(data: WorkflowNodeData): string {
  switch (data.kind) {
    case 'start':     return 'Workflow initiated.';
    case 'task':      return `Assigned to ${data.assignee || 'unassigned'}.`;
    case 'approval':  return `Pending approval from ${data.approverRole || 'approver'}.`;
    case 'automated': return `Executing action: ${data.actionId || 'none'}.`;
    case 'end':       return 'Workflow completed successfully.';
  }
}
