import { CharacterSprite } from '../character/CharacterSprite';
import { useStore } from '../core/store';
import { getPersonal } from '../services/PersonalService';
import { AssetImage } from '../ui/AssetImage';

/** 96 × 72 photo shown at 2×. */
const W = 192;
const H = 144;

/**
 * `# photo: mirror` (day 18, Section 12 [PRS-1]): the mirror shows the personal
 * photo from `personal/{uid}`; without one, the player's figure with Ellis and Quill.
 */
export function MirrorPhoto() {
  const profile = useStore((s) => s.save?.profile);
  const photo = getPersonal().mirrorPhoto;
  return (
    <div className="mirror-photo" role="img" aria-label="Der Spiegel zeigt, was du dir wünschst">
      <div className="mirror-photo-glass" style={{ width: W, height: H }}>
        {photo ? (
          <img src={photo} alt="" width={W} height={H} className="pixelated" />
        ) : (
          <div className="mirror-photo-default">
            <AssetImage id="portrait.ellis" w={64} h={64} />
            {profile && <CharacterSprite look={profile.look} house={profile.house} portrait scale={2} />}
            <AssetImage id="portrait.quill" w={64} h={64} />
          </div>
        )}
      </div>
    </div>
  );
}
