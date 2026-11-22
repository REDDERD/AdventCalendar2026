import { useState } from 'react';
import { HOUSE_COLORS } from '../assets/palette';
import { useMusic } from '../audio/useMusic';
import { ENDING_CARDS, epilogueLines, HOUSE_CUP_SPEECH, houseCup } from '../content/finale';
import { go } from '../core/ScreenMachine';
import { useStore } from '../core/store';
import { HOUSES } from '../types';
import { AssetImage } from '../ui/AssetImage';
import { Frame } from '../ui/Frame';
import { Layout } from '../ui/Layout';
import { PixelButton } from '../ui/PixelButton';

const HOUSE_NAME: Record<string, string> = { gryffindor: 'Gryffindor', hufflepuff: 'Hufflepuff', ravenclaw: 'Ravenclaw', slytherin: 'Slytherin' };

/**
 * Section 8.6 / 8.7 and [PLAN-1]: after day 24 – the end card, the house cup and
 * the epilogue. Everything here may be skipped; the letter (next screen) may not.
 */
export function EndingScreen() {
  useMusic('finale');
  const save = useStore((s) => s.save)!;
  const [step, setStep] = useState(0);
  const ending = save.ending ?? 'C_B';
  const card = ENDING_CARDS[ending];
  const profile = save.profile;
  const house = profile?.house ?? 'gryffindor';
  const cup = houseCup(house, save.housePoints, HOUSES);
  const max = Math.max(1, ...cup.map((c) => c.points));
  const steps = 3;
  const next = () => (step + 1 < steps ? setStep(step + 1) : go('letter'));

  return (
    <Layout>
      <div className="center-msg ending">
        {step === 0 && (
          <Frame className="ending-card">
            <div className="ending-kicker">Dein Ende</div>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </Frame>
        )}
        {step === 1 && (
          <Frame className="house-cup">
            <h2>Der Hauspokal</h2>
            {cup.map((c, i) => (
              <div key={c.house} className={`cup-row ${i === 0 ? 'winner' : ''}`}>
                <AssetImage id={`ui.crest.${c.house}`} w={24} h={28} />
                <div className="cup-bar">
                  <div style={{ width: `${(c.points / max) * 100}%`, background: HOUSE_COLORS[c.house][0] }} />
                  <span>
                    {HOUSE_NAME[c.house]} · {c.points}
                  </span>
                </div>
              </div>
            ))}
            <p className="cup-speech">
              Der Hut: „{HOUSE_NAME[house]} gewinnt. {HOUSE_CUP_SPEECH[house]}“
            </p>
          </Frame>
        )}
        {step === 2 && (
          <Frame className="epilogue">
            <h2>Und danach …</h2>
            {epilogueLines(save.vars, profile).map((line, i) => (
              <p key={i} style={{ animationDelay: `${i * 0.6}s` }}>
                {line}
              </p>
            ))}
          </Frame>
        )}
        <div className="ending-buttons">
          {step < steps - 1 && (
            <PixelButton small onClick={() => go('letter')}>
              Überspringen
            </PixelButton>
          )}
          <PixelButton variant="wax" onClick={next}>
            {step < steps - 1 ? 'Weiter' : 'Ein Brief für dich'}
          </PixelButton>
        </div>
      </div>
    </Layout>
  );
}
