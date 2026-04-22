import type { NodeProps } from '@xyflow/react';
import type { StartData, TaskData, ApprovalData, AutomatedData, EndData } from '../types';
import { BaseNode } from './BaseNode';

// Palette from coolors.co/palette/606c38-283618-fefae0-dda15e-bc6c25
const C = {
  start:     '#606c38',
  task:      '#dda15e',
  approval:  '#bc6c25',
  automated: '#8a9a50',
  end:       '#4a3520',
};

export function StartNode({ id, selected, data }: NodeProps & { data: StartData }) {
  return (
    <BaseNode id={id} selected={selected} kindLabel="start" label={data.title || 'Start'} accentColor={C.start} hasInput={false} />
  );
}

export function TaskNode({ id, selected, data }: NodeProps & { data: TaskData }) {
  return (
    <BaseNode id={id} selected={selected} kindLabel="task" label={data.title || 'Task'} subtitle={data.assignee ? data.assignee : 'Unassigned'} accentColor={C.task}>
      {data.description && <p className="node-desc">{data.description}</p>}
    </BaseNode>
  );
}

export function ApprovalNode({ id, selected, data }: NodeProps & { data: ApprovalData }) {
  return (
    <BaseNode id={id} selected={selected} kindLabel="approval" label={data.title || 'Approval'} subtitle={data.approverRole || 'Approver'} accentColor={C.approval} />
  );
}

export function AutomatedNode({ id, selected, data }: NodeProps & { data: AutomatedData }) {
  return (
    <BaseNode id={id} selected={selected} kindLabel="auto" label={data.title || 'Automated Step'} subtitle={data.actionId || 'No action set'} accentColor={C.automated} />
  );
}

export function EndNode({ id, selected, data }: NodeProps & { data: EndData }) {
  return (
    <BaseNode id={id} selected={selected} kindLabel="end" label={data.endMessage || 'End'} accentColor={C.end} hasOutput={false} />
  );
}
