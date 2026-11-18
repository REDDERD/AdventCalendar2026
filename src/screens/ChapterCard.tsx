import { resolveDay } from '../content/schedule';
import { DaySession } from '../core/DaySession';
import { go } from '../core/ScreenMachine';
import { useStore } from '../core/store';
import { Frame } from '../ui/Frame';
import { Layout } from '../ui/Layout';

/** Section 4, step 2: "Kapitel 7 – Die Eulerei". */
export function ChapterCardScreen() {
  const day = useStore((s) => s.activeDay) ?? 0;
  const route = useStore((s) => s.save?.vars.route);
  const { title } = resolveDay(day, typeof route === 'string' ? route : undefined);

  const next = () => {
    DaySession.current?.setScreen('scene');
    go('scene');
  };

  return (
    <Layout>
      <div className="chapter-card" onClick={next}>
        <Frame className="chapter-frame">
          <div className="chapter-number">Kapitel {day}</div>
          <div className="chapter-title">{title}</div>
        </Frame>
        <div className="tap-hint">Tippen zum Beginnen</div>
      </div>
    </Layout>
  );
}
