import '@xyflow/react/dist/style.css';
import './styles.css';
import { Sidebar } from './components/Sidebar';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { ConfigPanel } from './components/ConfigPanel';
import { SimulationPanel } from './components/SimulationPanel';
import { Toolbar } from './components/Toolbar';

export default function App() {
  return (
    <div className="app">
      <Toolbar />
      <div className="main-layout">
        <Sidebar />
        <WorkflowCanvas />
        <ConfigPanel />
      </div>
      <SimulationPanel />
    </div>
  );
}
