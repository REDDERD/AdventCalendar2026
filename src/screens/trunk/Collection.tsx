import { CLUE_ICONS, CLUES, HOUSE_TOKENS, ITEM_ICONS, ITEMS } from '../../content/catalog';
import { useStore } from '../../core/store';
import { AssetImage } from '../../ui/AssetImage';

const PICTURE = 64; // 32 px sprites at ×2

/** One collected thing: its picture with the name always visible underneath. */
function Card({ icon, name }: { icon: string; name: string }) {
  return (
    <li className="item-card">
      <AssetImage id={icon} w={PICTURE} h={PICTURE} className="item-picture" />
      <span className="item-name">{name}</span>
    </li>
  );
}

/** A clue not found yet: a dark card with a question mark. */
function UnknownCard() {
  return (
    <li className="item-card missing">
      <span className="item-picture item-unknown" aria-hidden="true">
        ?
      </span>
    </li>
  );
}

/** Inventory (items as pictures) or investigation clues (objects as pictures, observations as text). */
export function Collection({ kind }: { kind: 'items' | 'clues' }) {
  const value = useStore((s) => s.save?.vars[kind]);
  const house = useStore((s) => s.save?.profile?.house);
  const owned = Array.isArray(value) ? value : [];

  if (kind === 'items') {
    if (!owned.length) return <p className="muted">Deine Truhe ist noch leer.</p>;
    return (
      <ul className="item-grid">
        {owned.map((id) => {
          const token = id === 'house_token' && house ? HOUSE_TOKENS[house] : undefined;
          const icon = token?.icon ?? ITEM_ICONS[id];
          const name = token?.name ?? ITEMS[id] ?? id;
          return icon ? <Card key={id} icon={icon} name={name} /> : <li key={id} className="item-card"><span className="item-name">{name}</span></li>;
        })}
      </ul>
    );
  }

  const objects = Object.keys(CLUES).filter((id) => id in CLUE_ICONS);
  const observations = Object.keys(CLUES).filter((id) => !(id in CLUE_ICONS));
  return (
    <>
      <h3>Gegenstände</h3>
      <ul className="item-grid">
        {objects.map((id) => (owned.includes(id) ? <Card key={id} icon={CLUE_ICONS[id]} name={CLUES[id]} /> : <UnknownCard key={id} />))}
      </ul>
      <h3>Beobachtungen</h3>
      <ul className="collection">
        {observations.map((id) => (
          <li key={id} className={owned.includes(id) ? '' : 'missing'}>
            {owned.includes(id) ? CLUES[id] : '???'}
          </li>
        ))}
      </ul>
    </>
  );
}
