import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface BaseNodeProps {
  id: string;
  selected: boolean;
  kindLabel: string;
  label: string;
  subtitle?: string;
  accentColor: string;
  hasInput?: boolean;
  hasOutput?: boolean;
  children?: React.ReactNode;
}

export function BaseNode({
  selected,
  kindLabel,
  label,
  subtitle,
  accentColor,
  hasInput = true,
  hasOutput = true,
  children,
}: BaseNodeProps) {
  return (
    <div
      style={{
        borderColor: selected ? accentColor : 'transparent',
        boxShadow: selected
          ? `0 0 0 2px ${accentColor}44, 0 4px 20px rgba(0,0,0,0.3)`
          : '0 2px 12px rgba(0,0,0,0.25)',
      }}
      className="base-node"
    >
      {hasInput && (
        <Handle type="target" position={Position.Top} className="node-handle" />
      )}

      <div className="node-accent-bar" style={{ backgroundColor: accentColor }} />

      <div className="node-header">
        <span className="node-kind-tag">{kindLabel}</span>
        <div>
          <div className="node-label">{label}</div>
          {subtitle && <div className="node-subtitle">{subtitle}</div>}
        </div>
      </div>

      {children && <div className="node-body">{children}</div>}

      {hasOutput && (
        <Handle type="source" position={Position.Bottom} className="node-handle" />
      )}
    </div>
  );
}
