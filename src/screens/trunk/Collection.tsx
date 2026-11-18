import { CLUES, ITEMS } from '../../content/catalog';
import { useStore } from '../../core/store';

/** Inventory (items) or investigation clues; missing clues are shown as "???". */
export function Collection({ kind }: { kind: 'items' | 'clues' }) {
  const value = useStore((s) => s.save?.vars[kind]);
  const owned = Array.isArray(value) ? value : [];
  const catalog = kind === 'items' ? ITEMS : CLUES;

  if (kind === 'items') {
    if (!owned.length) return <p className="muted">Deine Truhe ist noch leer.</p>;
    return (
      <ul className="collection">
        {owned.map((id) => (
          <li key={id}>{catalog[id] ?? id}</li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="collection">
      {Object.entries(catalog).map(([id, label]) => (
        <li key={id} className={owned.includes(id) ? '' : 'missing'}>
          {owned.includes(id) ? label : '???'}
        </li>
      ))}
    </ul>
  );
}
