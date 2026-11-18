import { useEffect, useState } from 'react';
import { HOUSE_COLORS } from '../assets/palette';
import { LAST_DAY } from '../content/schedule';
import { go } from '../core/ScreenMachine';
import { startDay } from '../core/flow';
import { useStore } from '../core/store';
import { doorState, formatCountdown, isPlayable, nextPlayableDay, unlockAtMs, waitingChapters } from '../core/time';
import { hasStory } from '../services/ContentService';
import { now } from '../services/UnlockService';
import { AssetImage } from '../ui/AssetImage';
import { Frame } from '../ui/Frame';
import { Layout } from '../ui/Layout';
import { PixelButton } from '../ui/PixelButton';

function useNow(): number {
  const clockVersion = useStore((s) => s.clockVersion);
  const [t, setT] = useState(now);
  useEffect(() => {
    setT(now());
    const id = setInterval(() => setT(now()), 1000);
    return () => clearInterval(id);
  }, [clockVersion]);
  return t;
}

/** Section 4, step 1: the Advent clock with 24 doors. */
export function CalendarScreen() {
  const save = useStore((s) => s.save)!;
  const showToast = useStore((s) => s.showToast);
  const t = useNow();
  const completed = save.progress.completedDays;
  const prologueDone = completed.includes(0);
  const waiting = waitingChapters(t, completed);
  const next = nextPlayableDay(t, completed);
  const seal = save.profile ? HOUSE_COLORS[save.profile.house][0] : undefined;

  const nextLocked = Array.from({ length: LAST_DAY + 1 }, (_, d) => d).find((d) => t < unlockAtMs(d));

  const open = (day: number) => {
    const state = doorState(day, t, completed);
    if (state === 'done') {
      showToast('Dieses Türchen ist schon offen.');
    } else if (state === 'locked') {
      if (t < unlockAtMs(day)) showToast(`Noch ${formatCountdown(unlockAtMs(day) - t)}`);
      else showToast('Erst das vorige Kapitel spielen.');
    } else if (!hasStory(day)) {
      showToast('Dieses Kapitel wird gerade noch geschrieben …');
    } else {
      void startDay(day);
    }
  };

  let headline: string;
  if (!prologueDone) headline = isPlayable(0, t, completed) ? 'Dein Brief ist angekommen!' : 'Der Brief ist unterwegs …';
  else if (waiting > 1) headline = `${waiting} Kapitel warten auf dich`;
  else if (waiting === 1) headline = 'Ein Kapitel wartet auf dich';
  else if (completed.includes(LAST_DAY)) headline = 'Frohe Weihnachten!';
  else headline = 'Alle Türchen sind offen';

  return (
    <Layout
      top={
        <div className="calendar-top">
          <AssetImage id="ui.clock" w={96} h={120} className="calendar-clock" />
          <Frame className="calendar-info">
            <div className="calendar-headline">{headline}</div>
            {next === null && nextLocked !== undefined && (
              <div className="calendar-countdown">
                Nächstes Kapitel in
                <br />
                {formatCountdown(unlockAtMs(nextLocked) - t)}
              </div>
            )}
          </Frame>
        </div>
      }
      bottom={
        !prologueDone ? (
          <div className="center-msg">
            {isPlayable(0, t, completed) ? (
              <PixelButton variant="wax" onClick={() => go('prologue')}>
                Brief öffnen
              </PixelButton>
            ) : (
              <Frame className="msg-frame">
                Der Prolog beginnt am 30. November um 18 Uhr.
                <br />
                Noch {formatCountdown(unlockAtMs(0) - t)}
              </Frame>
            )}
          </div>
        ) : (
          <div className="doors">
            {Array.from({ length: LAST_DAY }, (_, i) => i + 1).map((day) => {
              const state = doorState(day, t, completed);
              return (
                <button
                  key={day}
                  type="button"
                  className={`door door-${state}`}
                  onClick={() => open(day)}
                  style={state === 'done' && seal ? { ['--seal' as string]: seal } : undefined}
                >
                  <span>{day}</span>
                </button>
              );
            })}
          </div>
        )
      }
    />
  );
}
