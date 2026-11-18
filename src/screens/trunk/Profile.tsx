import { useStore } from '../../core/store';
import { HOUSE_NAMES } from '../../dialogue/DialogueRunner';

const WAND: Record<string, string> = { phoenix: 'Phönixfeder', dragon: 'Drachenherzfaser', unicorn: 'Einhornhaar' };
const PET: Record<string, string> = { owl: 'Eule', cat: 'Katze', toad: 'Kröte' };

/** Character sheet ("Steckbrief"). */
export function Profile() {
  const save = useStore((s) => s.save);
  const profile = save?.profile;
  if (!profile) return <p className="muted">Noch nicht eingeschult.</p>;
  return (
    <dl className="profile">
      <dt>Name</dt>
      <dd>{profile.name}</dd>
      <dt>Haus</dt>
      <dd>{HOUSE_NAMES[profile.house]}</dd>
      <dt>Zauberstab</dt>
      <dd>{WAND[profile.wand]}</dd>
      <dt>Haustier</dt>
      <dd>{PET[profile.pet]}</dd>
      <dt>Hauspunkte</dt>
      <dd>{save.housePoints}</dd>
    </dl>
  );
}
