import { CLUES, ITEMS } from '../content/catalog';
import { getEntry, LAST_DAY } from '../content/schedule';
import { DaySession } from '../core/DaySession';
import { go } from '../core/ScreenMachine';
import { useStore } from '../core/store';
import { formatCountdown, unlockAtMs } from '../core/time';
import { now } from '../services/UnlockService';
import { Frame } from '../ui/Frame';
import { Layout } from '../ui/Layout';
import { PixelButton } from '../ui/PixelButton';

/** Section 4, step 8: points, sparks, new clues/items, countdown to the next chapter. */
export function DayEndScreen() {
  const save = useStore((s) => s.save)!;
  const summary = DaySession.lastSummary;
  const day = summary?.day ?? 0;
  const points = getEntry(day).puzzleIds.reduce((sum, id) => sum + (save.puzzles[id]?.points ?? 0), 0);
  const nextDay = day + 1;
  const t = now();

  return (
    <Layout>
      <div className="center-msg">
        <Frame className="dayend-frame">
          <h2>Kapitel {day} geschafft!</h2>
          <div>+{points} Hauspunkte</div>
          {!!summary?.sparks && <div>+{summary.sparks} Zauberfunken</div>}
          {summary?.clues.map((id) => <div key={id}>Neuer Hinweis: {CLUES[id] ?? id}</div>)}
          {summary?.items.map((id) => <div key={id}>Neuer Gegenstand: {ITEMS[id] ?? id}</div>)}
        </Frame>
        {nextDay <= LAST_DAY && (
          <Frame className="msg-frame">
            {t < unlockAtMs(nextDay)
              ? `Kapitel ${nextDay} öffnet sich in ${formatCountdown(unlockAtMs(nextDay) - t)}`
              : `Kapitel ${nextDay} wartet schon auf dich.`}
          </Frame>
        )}
        <PixelButton variant="wax" onClick={() => go('calendar')}>
          Zum Kalender
        </PixelButton>
      </div>
    </Layout>
  );
}
