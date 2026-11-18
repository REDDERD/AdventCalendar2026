import { CharacterSprite } from '../../character/CharacterSprite';
import { useStore } from '../../core/store';
import { HOUSE_NAMES } from '../../dialogue/DialogueRunner';
import { AssetImage } from '../../ui/AssetImage';

const WAND: Record<string, string> = { phoenix: 'Phönixfeder', dragon: 'Drachenherzfaser', unicorn: 'Einhornhaar' };
const PET: Record<string, string> = { owl: 'Eule', cat: 'Katze', toad: 'Kröte' };

/** Character sheet ("Steckbrief"). */
export function Profile() {
  const save = useStore((s) => s.save);
  const profile = save?.profile;
  if (!profile) return <p className="muted">Noch nicht eingeschult.</p>;
  const solved = Object.values(save.puzzles).filter((p) => p.solved).length;
  return (
    <div className="profile-sheet">
      <div className="profile-portrait">
        <CharacterSprite look={profile.look} house={profile.house} scale={1} />
        <AssetImage id={`ui.crest.${profile.house}`} w={24} h={28} />
        <AssetImage id={`pet.${profile.pet}`} w={32} h={32} />
      </div>
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
        <dt>Funken</dt>
        <dd>{save.sparks}</dd>
        <dt>Rätsel</dt>
        <dd>{solved} gelöst</dd>
      </dl>
    </div>
  );
}
