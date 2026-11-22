import type { User } from 'firebase/auth';
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { unlockAudio } from './audio/AudioService';
import { DaySession } from './core/DaySession';
import { routeAfterLogin } from './core/flow';
import { PixelStage } from './core/PixelStage';
import { go } from './core/ScreenMachine';
import { useStore, type Screen } from './core/store';
import { loadUserDoc, onAuthChange } from './services/AuthService';
import { clearEventContext, detectPlatform, logEvent, setEventContext } from './services/EventLogger';
import { auth } from './services/firebase';
import { isInviteLoginPending, runInviteLogin } from './services/inviteLogin';
import { loadSave } from './services/SaveService';
import { enableDebugDate, measureServerOffset } from './services/UnlockService';
import { BlockedScreen, OrientationBlock } from './screens/Blocked';
import { CalendarScreen } from './screens/Calendar';
import { ChapterCardScreen } from './screens/ChapterCard';
import { DayEndScreen } from './screens/DayEnd';
import { CreditsScreen } from './screens/Credits';
import { EndingScreen } from './screens/Ending';
import { PersonalLetterScreen } from './screens/Letter';
import { LoginScreen } from './screens/Login';
import { OnboardingScreen } from './screens/Onboarding';
import { LetterScreen } from './screens/prologue/Letter';
import { MirrorScreen } from './screens/prologue/Mirror';
import { PetScreen } from './screens/prologue/Pet';
import { RevealScreen } from './screens/prologue/Reveal';
import { SortingScreen } from './screens/prologue/Sorting';
import { WandScreen } from './screens/prologue/Wand';
import { PuzzleScreen } from './screens/Puzzle';
import { PuzzleIntroScreen } from './screens/PuzzleIntro';
import { SceneScreen } from './screens/Scene';
import { SolutionScreen } from './screens/Solution';
import { Trunk } from './screens/trunk/Trunk';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { Layout } from './ui/Layout';
import { PixelButton } from './ui/PixelButton';

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

/** Counts auth-flow runs; a newer sign-in makes older runs stop. */
let flowRun = 0;

/** Login → users/{uid} → server time → save → route [AUTH-3] [DAY-2]. */
async function handleAuth(fbUser: User | null): Promise<void> {
  const run = ++flowRun;
  const current = () => run === flowRun;
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
    if (!current()) return;
    if (!user || !user.active) {
      s.setBlocked(user ? 'inactive' : 'unknown_user');
      go('blocked');
      return;
    }
    s.setUser(user);
    setEventContext(user.uid, user.runId);
    enableDebugDate(user.role === 'admin');
    await measureServerOffset(user.uid);
    if (!current()) return;
    logEvent('session_start', null, detectPlatform());
    const save = await loadSave(user.uid, user.runId);
    if (!current()) return;
    s.setSave(save);
    await routeAfterLogin();
  } catch (e) {
    console.error('Login flow failed', e);
    if (!current()) return;
    s.setBlocked('unknown_user');
    go('blocked');
  }
}

function useAuthFlow(): void {
  useEffect(() => {
    const unsubscribe = onAuthChange((fbUser) => {
      // While an invitation link logs in, wait for its result (handled below).
      if (isInviteLoginPending()) return;
      void handleAuth(fbUser);
    });
    void runInviteLogin().then(({ attempted, error }) => {
      if (!attempted) return;
      if (error) useStore.getState().setLoginNotice(error);
      void handleAuth(auth.currentUser);
    });
    return unsubscribe;
  }, []);
}

const SCREENS: Record<Screen, () => ReactNode> = {
  boot: () => (
    <Layout bare>
      <div className="center-msg">Die Eule fliegt los …</div>
    </Layout>
  ),
  login: () => <LoginScreen />,
  blocked: () => <BlockedScreen />,
  onboarding: () => <OnboardingScreen />,
  'prologue.letter': () => <LetterScreen />,
  'prologue.mirror': () => <MirrorScreen />,
  'prologue.wand': () => <WandScreen />,
  'prologue.pet': () => <PetScreen />,
  'prologue.train': () => <SceneScreen />,
  'prologue.sorting': () => <SortingScreen />,
  'prologue.reveal': () => <RevealScreen />,
  calendar: () => <CalendarScreen />,
  chapterCard: () => <ChapterCardScreen />,
  scene: () => <SceneScreen />,
  puzzleIntro: () => <PuzzleIntroScreen />,
  puzzle: () => <PuzzleScreen />,
  solution: () => <SolutionScreen />,
  dayEnd: () => <DayEndScreen />,
  ending: () => <EndingScreen />,
  letter: () => <PersonalLetterScreen />,
  credits: () => <CreditsScreen />,
};

/** [SND-3] Audio may only start after a touch. */
function useAudioUnlock(): void {
  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener('pointerdown', unlock);
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);
}

export function App() {
  useAuthFlow();
  useAudioUnlock();
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
      {trunkOpen && user && (
        <ErrorBoundary
          fallback={(reset) => (
            <div className="trunk">
              <div className="center-msg">
                Die Truhe klemmt. Versuch es noch einmal.
                <PixelButton onClick={() => { reset(); useStore.getState().setTrunkOpen(false); }}>Schließen</PixelButton>
              </div>
            </div>
          )}
        >
          <Trunk />
        </ErrorBoundary>
      )}
    </PixelStage>
  );
}
