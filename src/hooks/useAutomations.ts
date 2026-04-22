import { useEffect } from 'react';
import { getAutomations } from '../mocks/api';
import { useWorkflowStore } from '../store/workflowStore';

// I want all automation data loaded once at startup,
// not fetched every time the AutomatedNode form renders
export function useAutomations() {
  const setAutomations = useWorkflowStore((s) => s.setAutomations);
  const automations = useWorkflowStore((s) => s.automations);

  useEffect(() => {
    if (automations.length > 0) return; // already loaded
    getAutomations().then(setAutomations);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return automations;
}
