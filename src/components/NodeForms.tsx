import { useWorkflowStore } from '../store/workflowStore';
import { useAutomations } from '../hooks/useAutomations';
import { Field, Input, TextArea, Select, Toggle } from './FormPrimitives';
import { KeyValueEditor } from './KeyValueEditor';
import type {
  StartData, TaskData, ApprovalData, AutomatedData, EndData, WorkflowNodeData,
} from '../types';

interface FormProps<T extends WorkflowNodeData> {
  nodeId: string;
  data: T;
}

// Each form only patches what it owns — spread keeps other keys intact
function usePatch(nodeId: string) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  return (patch: Partial<WorkflowNodeData>) => updateNodeData(nodeId, patch);
}

export function StartForm({ nodeId, data }: FormProps<StartData>) {
  const patch = usePatch(nodeId);
  return (
    <>
      <Field label="Title *">
        <Input
          value={data.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="e.g. Employee Onboarding"
        />
      </Field>
      <Field label="Metadata">
        <KeyValueEditor
          pairs={data.metadata}
          onChange={(metadata) => patch({ metadata })}
        />
      </Field>
    </>
  );
}

export function TaskForm({ nodeId, data }: FormProps<TaskData>) {
  const patch = usePatch(nodeId);
  return (
    <>
      <Field label="Title *">
        <Input
          value={data.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Task name"
        />
      </Field>
      <Field label="Description">
        <TextArea
          value={data.description}
          onChange={(e) => patch({ description: e.target.value })}
          placeholder="What needs to be done"
        />
      </Field>
      <Field label="Assignee">
        <Input
          value={data.assignee}
          onChange={(e) => patch({ assignee: e.target.value })}
          placeholder="e.g. HR Admin"
        />
      </Field>
      <Field label="Due Date">
        <Input
          type="date"
          value={data.dueDate}
          onChange={(e) => patch({ dueDate: e.target.value })}
        />
      </Field>
      <Field label="Custom Fields">
        <KeyValueEditor
          pairs={data.customFields}
          onChange={(customFields) => patch({ customFields })}
        />
      </Field>
    </>
  );
}

export function ApprovalForm({ nodeId, data }: FormProps<ApprovalData>) {
  const patch = usePatch(nodeId);
  return (
    <>
      <Field label="Title *">
        <Input
          value={data.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Approval step name"
        />
      </Field>
      <Field label="Approver Role">
        <Select
          value={data.approverRole}
          onChange={(e) => patch({ approverRole: e.target.value })}
        >
          <option value="">Select role…</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="CEO">CEO</option>
        </Select>
      </Field>
      <Field label="Auto-approve threshold (days)">
        <Input
          type="number"
          min={0}
          value={data.autoApproveThreshold}
          onChange={(e) => patch({ autoApproveThreshold: Number(e.target.value) })}
        />
      </Field>
    </>
  );
}

export function AutomatedForm({ nodeId, data }: FormProps<AutomatedData>) {
  const patch = usePatch(nodeId);
  const automations = useAutomations();

  const selected = automations.find((a) => a.id === data.actionId);

  const handleActionChange = (id: string) => {
    // Reset params when action changes so stale keys don't hang around
    patch({ actionId: id, params: {} });
  };

  return (
    <>
      <Field label="Title *">
        <Input
          value={data.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Step name"
        />
      </Field>
      <Field label="Action">
        <Select
          value={data.actionId}
          onChange={(e) => handleActionChange(e.target.value)}
        >
          <option value="">Select action…</option>
          {automations.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </Select>
      </Field>
      {/* Dynamic param fields — driven by the action definition */}
      {selected?.params.map((param) => (
        <Field key={param} label={param}>
          <Input
            value={data.params[param] ?? ''}
            onChange={(e) => patch({ params: { ...data.params, [param]: e.target.value } })}
            placeholder={param}
          />
        </Field>
      ))}
    </>
  );
}

export function EndForm({ nodeId, data }: FormProps<EndData>) {
  const patch = usePatch(nodeId);
  return (
    <>
      <Field label="End Message">
        <Input
          value={data.endMessage}
          onChange={(e) => patch({ endMessage: e.target.value })}
          placeholder="e.g. Onboarding Complete"
        />
      </Field>
      <Toggle
        label="Show Summary"
        checked={data.summaryFlag}
        onChange={(summaryFlag) => patch({ summaryFlag })}
      />
    </>
  );
}
