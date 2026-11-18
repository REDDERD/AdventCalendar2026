import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { DaySession } from './core/DaySession';
import { routeAfterLogin } from './core/flow';
import { PixelStage } from './core/PixelStage';
import { go } from './core/ScreenMachine';
import { useStore, type Screen } from './core/store';
import { loadUserDoc, onAuthChange } from './services/AuthService';
import { clearEventContext, detectPlatform, logEvent, setEventContext } from './services/EventLogger';
import { loadSave } from './services/SaveService';
import { enableDebugDate, measureServerOffset } from './services/UnlockService';
import { BlockedScreen, OrientationBlock } from './screens/Blocked';
import { CalendarScreen } from './screens/Calendar';
import { ChapterCardScreen } from './screens/ChapterCard';
import { DayEndScreen } from './screens/DayEnd';
import { LoginScreen } from './screens/Login';
import { OnboardingScreen } from './screens/Onboarding';
import { PrologueStub } from './screens/prologue/PrologueStub';
import { PuzzleScreen } from './screens/Puzzle';
import { PuzzleIntroScreen } from './screens/PuzzleIntro';
import { SceneScreen } from './screens/Scene';
import { SolutionScreen } from './screens/Solution';
import { Trunk } from './screens/trunk/Trunk';
import { Layout } from './ui/Layout';

const AdminApp = lazy(() => import('./admin/AdminApp'));

const DESKTOP_OVERRIDE_KEY = 'hogwarts.allowDesktop';

/** Dev builds: `?desktop` lets the game run in a desktop browser. */
function desktopAllowed(): boolean {
  if (!import.meta.env.DEV) return false;
  try {
    if (new URLSearchParams(location.search).has('desktop')) sessionStorage.setItem(DESKTOP_OVERRIDE_KEY, '1');
    return sessionStorage.getItem(DESKTOP_OVERRIDE_KEY) === '1';
  } catch {
    return false;
  }
}

function useViewportBlock(): 'landscape' | 'desktop' | null {
  const compute = (): 'landscape' | 'desktop' | null => {
    if (desktopAllowed()) return null;
    if (window.innerWidth > 600) return 'desktop';
    if (window.innerWidth > window.innerHeight) return 'landscape';
    return null;
  };
  const [block, setBlock] = useState(compute);
  useEffect(() => {
    const update = () => setBlock(compute());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);
  return block;
}

function useHashRoute(): string {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const update = () => setHash(location.hash);
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return hash;
}

/** Login → users/{uid} → server time → save → route [AUTH-3] [DAY-2]. */
function useAuthFlow(): void {
  useEffect(() => {
    return onAuthChange(async (fbUser) => {
      const s = useStore.getState();
      if (!fbUser) {
        clearEventContext();
        DaySession.current = null;
        s.setUser(null);
        s.setSave(null);
        s.setActiveDay(null);
        s.setTrunkOpen(false);
        go('login');
        return;
      }
      go('boot');
      try {
        const user = await loadUserDoc(fbUser.uid);
        if (!user || !user.active) {
          s.setBlocked(user ? 'inactive' : 'unknown_user');
          go('blocked');
          return;
        }
        s.setUser(user);
        setEventContext(user.uid, user.runId);
        enableDebugDate(user.role === 'admin');
        await measureServerOffset(user.uid);
        logEvent('session_start', null, detectPlatform());
        s.setSave(await loadSave(user.uid, user.runId));
        await routeAfterLogin();
      } catch (e) {
        console.error('Login flow failed', e);
        s.setBlocked('unknown_user');
        go('blocked');
      }
    });
  }, []);
}

const SCREENS: Record<Screen, () => ReactNode> = {
  boot: () => <Layout bare top={<div className="center-msg">Die Eule fliegt los …</div>} />,
  login: () => <LoginScreen />,
  blocked: () => <BlockedScreen />,
  onboarding: () => <OnboardingScreen />,
  prologue: () => <PrologueStub />,
  calendar: () => <CalendarScreen />,
  chapterCard: () => <ChapterCardScreen />,
  scene: () => <SceneScreen />,
  puzzleIntro: () => <PuzzleIntroScreen />,
  puzzle: () => <PuzzleScreen />,
  solution: () => <SolutionScreen />,
  dayEnd: () => <DayEndScreen />,
  ending: () => <CalendarScreen />,
  letter: () => <CalendarScreen />,
  credits: () => <CalendarScreen />,
};

export function App() {
  useAuthFlow();
  const screen = useStore((s) => s.screen);
  const trunkOpen = useStore((s) => s.trunkOpen);
  const user = useStore((s) => s.user);
  const hash = useHashRoute();
  const block = useViewportBlock();
  const adminRoute = hash.startsWith('#/admin');

  // [ADM-1] #/admin only for the admin; everyone else lands on the calendar.
  useEffect(() => {
    if (adminRoute && user && user.role !== 'admin') location.hash = '#/';
  }, [adminRoute, user]);

  if (adminRoute && user?.role === 'admin') {
    return (
      <Suspense fallback={<div className="admin-loading">…</div>}>
        <AdminApp />
      </Suspense>
    );
  }

  if (block) return <OrientationBlock desktop={block === 'desktop'} />;

  return (
    <PixelStage>
      <div key={screen} className="screen-fade">
        {SCREENS[screen]()}
      </div>
      {trunkOpen && user && <Trunk />}
    </PixelStage>
  );
}
