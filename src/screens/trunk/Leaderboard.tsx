import { useEffect, useState } from 'react';
import { HOUSE_COLORS } from '../../assets/palette';
import { rankHouses, rankPlayers, type LeaderboardEntry } from '../../core/ranking';
import { useStore } from '../../core/store';
import { HOUSE_NAMES } from '../../dialogue/DialogueRunner';
import { loadLeaderboard } from '../../services/LeaderboardService';
import { AssetImage } from '../../ui/AssetImage';

type View = 'players' | 'houses';

/** Loads the Rangliste once; the player's own line comes straight from the save so it is never behind. */
export function useLeaderboard(): { entries: LeaderboardEntry[] | null; failed: boolean } {
  const save = useStore((s) => s.save);
  const user = useStore((s) => s.user);
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    loadLeaderboard()
      .then((e) => live && setEntries(e))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);
  if (!entries || !save?.profile || !user || user.isTest) return { entries, failed };
  const own = { uid: save.uid, name: save.profile.name, house: save.profile.house, points: save.housePoints };
  return { entries: [...entries.filter((e) => e.uid !== save.uid), own], failed };
}

/** Trunk → Rangliste (DECISIONS.md #78): players and houses ranked by house points. */
export function Leaderboard() {
  const uid = useStore((s) => s.save?.uid);
  const isTest = useStore((s) => s.user?.isTest ?? false);
  const [view, setView] = useState<View>('players');
  const { entries, failed } = useLeaderboard();

  return (
    <div className="leaderboard">
      <div className="segmented">
        <button type="button" className={view === 'players' ? 'active' : ''} onClick={() => setView('players')}>
          Spieler
        </button>
        <button type="button" className={view === 'houses' ? 'active' : ''} onClick={() => setView('houses')}>
          Häuser
        </button>
      </div>
      {isTest && <p className="muted rank-note">Testkonten stehen nicht in der Rangliste.</p>}
      {!entries && !failed && <p className="muted rank-note">Die Eule holt die Liste …</p>}
      {failed && <p className="muted rank-note">Die Rangliste ist gerade nicht erreichbar. Bist du offline?</p>}
      {entries && entries.length === 0 && <p className="muted rank-note">Noch steht niemand auf der Liste.</p>}
      {entries && entries.length > 0 && view === 'players' && (
        <ol className="rank-list">
          {rankPlayers(entries).map((p) => (
            <li key={p.uid} className={`rank-row ${p.uid === uid ? 'me' : ''}`} style={{ borderLeftColor: HOUSE_COLORS[p.house][0] }}>
              <span className={`rank-no place-${p.rank}`}>{p.rank}.</span>
              <AssetImage id={`ui.crest.${p.house}`} w={24} h={28} />
              <span className="rank-name">
                {p.name}
                {p.uid === uid && <small> (du)</small>}
              </span>
              <span className="rank-points">
                <span className="stat-icon stat-points" /> {p.points}
              </span>
            </li>
          ))}
        </ol>
      )}
      {entries && entries.length > 0 && view === 'houses' && <Houses entries={entries} />}
    </div>
  );
}

function Houses({ entries }: { entries: LeaderboardEntry[] }) {
  const houses = rankHouses(entries);
  const max = Math.max(1, ...houses.map((h) => h.average));
  return (
    <div className="rank-houses">
      <p className="muted rank-note">Durchschnittliche Hauspunkte pro Spieler</p>
      {houses.map((h) => (
        <div key={h.house} className={`cup-row ${h.rank === 1 ? 'winner' : ''}`}>
          <span className={`rank-no place-${h.rank ?? 0}`}>{h.rank ? `${h.rank}.` : '–'}</span>
          <AssetImage id={`ui.crest.${h.house}`} w={24} h={28} />
          <div className="cup-bar">
            <div style={{ width: `${(h.average / max) * 100}%`, background: HOUSE_COLORS[h.house][0] }} />
            <span>
              {HOUSE_NAMES[h.house]} · {h.players ? h.average : 'noch niemand'}
            </span>
          </div>
          <span className="rank-count">{h.players ? `${h.players} Sp.` : ''}</span>
        </div>
      ))}
    </div>
  );
}
