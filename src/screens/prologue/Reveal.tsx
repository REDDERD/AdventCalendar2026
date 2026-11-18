import { useEffect, useState } from 'react';
import { CharacterSprite } from '../../character/CharacterSprite';
import { DEFAULT_LOOK } from '../../character/layers';
import { AssetImage } from '../../ui/AssetImage';
import { Frame } from '../../ui/Frame';
import { Layout } from '../../ui/Layout';
import { PixelButton } from '../../ui/PixelButton';
import { finishPrologue, HOUSE_LABEL, useDraft } from './prologueFlow';

/** Grey robe from behind → flash → house colours → turn to the front. */
const RECOLOR_MS = 900;
const TURN_MS = 2100;

const CHEER: Record<string, string> = {
  gryffindor: 'Der rote Tisch springt auf und jubelt so laut, dass die Kerzen flackern.',
  hufflepuff: 'Am gelben Tisch wird dir sofort ein Platz und ein Stück Kuchen freigeräumt.',
  ravenclaw: 'Der blaue Tisch applaudiert – und jemand fragt sofort nach deinem Lieblingsbuch.',
  slytherin: 'Der grüne Tisch nickt dir anerkennend zu. Ein paar lächeln sogar.',
};

/** Section 6.1 step 7: the grey robe takes on the house colours [CHAR-2]. */
export function RevealScreen() {
  const draft = useDraft();
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const house = draft.house;

  useEffect(() => {
    const a = setTimeout(() => setPhase(1), RECOLOR_MS);
    const b = setTimeout(() => setPhase(2), TURN_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  if (!house) return <Layout bare />;
  const revealed = phase > 0;

  return (
    <Layout bare className="reveal-screen">
      <div className={`reveal-top ${revealed ? 'revealed' : ''}`}>
        <div className="scene-world">
          <AssetImage id="bg.great_hall" w={256} h={512} />
        </div>
        <div className="reveal-figure">
          <CharacterSprite
            look={draft.look ?? DEFAULT_LOOK}
            house={revealed ? house : null}
            direction={phase === 2 ? 'down' : 'up'}
            scale={2}
          />
        </div>
        {revealed && (
          <div className="reveal-crest">
            <AssetImage id={`ui.crest.${house}`} w={48} h={56} />
          </div>
        )}
        {revealed && <div className="reveal-sparkles" />}
      </div>
      <div className="center-msg">
        <Frame className="msg-frame">
          <h2>{revealed ? `Willkommen in ${HOUSE_LABEL[house]}!` : '…'}</h2>
          {revealed && <p>{CHEER[house]}</p>}
        </Frame>
        {phase === 2 && (
          <PixelButton variant="wax" onClick={finishPrologue}>
            Zum Kalender
          </PixelButton>
        )}
      </div>
    </Layout>
  );
}
