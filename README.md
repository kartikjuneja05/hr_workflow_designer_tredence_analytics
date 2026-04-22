# HR Workflow Designer

A visual workflow builder for HR processes. Drag nodes onto a canvas, configure them, and simulate the flow.

## Stack

Vite, React 19, TypeScript, @xyflow/react, Zustand.

## Getting Started

    npm install
    npm run dev      # http://localhost:5173
    npm run build

## Architecture

    src/
    ├── types/          discriminated union for all node data shapes
    ├── mocks/          api.ts with GET /automations and POST /simulate
    ├── store/          workflowStore.ts via Zustand
    ├── hooks/          useAutomations loads the action list once on mount
    ├── nodes/          BaseNode shell and the 5 custom node components
    └── components/
        ├── Sidebar.tsx          drag sources using HTML5 DnD
        ├── WorkflowCanvas.tsx   React Flow wrapper and drop handler
        ├── ConfigPanel.tsx      swaps form based on selected node kind
        ├── NodeForms.tsx        5 controlled forms, each patching their own fields
        ├── SimulationPanel.tsx  modal with BFS execution log and validation errors
        ├── Toolbar.tsx          export JSON and open simulation
        ├── FormPrimitives.tsx   Input, TextArea, Select, Toggle
        └── KeyValueEditor.tsx   reusable key-value pair editor

## Design Notes

WorkflowNodeData is a discriminated union with a `kind` field on each interface. TypeScript narrows the type at every switch, so forms and the simulator can never access the wrong fields.

The store uses Zustand selectors so components only re-render when the slice they subscribe to changes.

Each form calls `updateNodeData(id, patch)` which spreads onto existing data. Adding a new node type does not require touching the store.

The mock API functions have a small artificial delay so the async patterns are real and swapping in a live API later is a one-line change.

The simulation does a BFS from the Start node. It checks for missing Start/End nodes and disconnected nodes before walking the graph.

## Features

- 5 custom node types with configurable forms
- Drag from sidebar onto canvas
- Connect nodes with animated edges
- Select node to open config panel
- Delete nodes via button or Delete key
- KeyValue editor for metadata and custom fields
- Dynamic param fields in automated node form
- Simulation modal with execution log and validation errors
- Export workflow as JSON
- MiniMap and zoom controls

## What I Would Add With More Time

- Undo/redo via Zustand temporal middleware
- Explicit cycle detection with a DFS gray-set check
- Import JSON back into the canvas
- Visual error highlighting on nodes directly in the canvas
- Auto-layout with Dagre
