import type { KeyValue } from '../types';

interface Props {
  pairs: KeyValue[];
  onChange: (pairs: KeyValue[]) => void;
}

export function KeyValueEditor({ pairs, onChange }: Props) {
  const update = (i: number, field: keyof KeyValue, value: string) => {
    const next = pairs.map((p, idx) =>
      idx === i ? { ...p, [field]: value } : p
    );
    onChange(next);
  };

  const add = () => onChange([...pairs, { key: '', value: '' }]);
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));

  return (
    <div className="kv-editor">
      {pairs.map((p, i) => (
        <div key={i} className="kv-row">
          <input
            className="field-input kv-input"
            placeholder="key"
            value={p.key}
            onChange={(e) => update(i, 'key', e.target.value)}
          />
          <input
            className="field-input kv-input"
            placeholder="value"
            value={p.value}
            onChange={(e) => update(i, 'value', e.target.value)}
          />
          <button className="kv-remove" onClick={() => remove(i)}>×</button>
        </div>
      ))}
      <button className="btn-ghost btn-sm" onClick={add}>+ Add field</button>
    </div>
  );
}
