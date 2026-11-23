import { useState, type CSSProperties } from 'react';
import { HOUSE_COLORS } from '../../assets/palette';
import { CharacterSprite } from '../../character/CharacterSprite';
import { badgeStates } from '../../core/badges';
import { rankPlayers } from '../../core/ranking';
import { useStore } from '../../core/store';
import { HOUSE_NAMES } from '../../dialogue/DialogueRunner';
import { AssetImage } from '../../ui/AssetImage';
import { useLeaderboard } from './Leaderboard';

const WAND: Record<string, string> = { phoenix: 'Phönixfeder', dragon: 'Drachenherzfaser', unicorn: 'Einhornhaar' };
const PET: Record<string, string> = { owl: 'Eule', cat: 'Katze', toad: 'Kröte' };
const DAYS = 24;

/** Steckbrief as a Hogwarts student ID with progress and badges (DECISIONS.md #79). */
export function Profile() {
  const save = useStore((s) => s.save);
  const isTest = useStore((s) => s.user?.isTest ?? false);
  const { entries } = useLeaderboard();
  const [picked, setPicked] = useState<string | null>(null);
  const profile = save?.profile;
  if (!save || !profile) return <p className="muted">Noch nicht eingeschult.</p>;

  const solved = Object.values(save.puzzles).filter((p) => p.solved).length;
  const days = save.progress.completedDays.length;
  const place = isTest ? null : entries ? (rankPlayers(entries).find((p) => p.uid === save.uid)?.rank ?? null) : undefined;
  const badges = badgeStates(save);
  const earned = badges.filter((b) => b.earned).length;
  const shown = badges.find((b) => b.badge.id === picked);
  const [main, alt] = HOUSE_COLORS[profile.house];

  return (
    <div className="student-id-page">
      <div className="student-id" style={{ '--house': main, '--house-alt': alt } as CSSProperties}>
        <div className="student-id-band">
          <span>Hogwarts</span>
          <span>Schülerausweis</span>
        </div>
        <AssetImage id={`ui.crest.${profile.house}`} w={72} h={84} className="student-id-watermark" />
        <div className="student-id-main">
          <div className="student-id-photo">
            <CharacterSprite look={profile.look} house={profile.house} scale={1} />
          </div>
          <div className="student-id-facts">
            <div className="student-id-name">{profile.name}</div>
            <div className="student-id-house">
              <span className="student-id-pill">{HOUSE_NAMES[profile.house]}</span> 1. Jahr
            </div>
            <div className="student-id-row">
              <AssetImage id={`ui.wand.${profile.wand}`} w={48} h={12} />
              <span>{WAND[profile.wand]}</span>
            </div>
            <div className="student-id-row">
              <AssetImage id={`pet.${profile.pet}`} w={32} h={32} />
              <span>{PET[profile.pet]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="student-stats">
        <div className="student-stat">
          <span className="stat-icon stat-points" />
          <strong>{save.housePoints}</strong> Hauspunkte
          {place !== null && <span className="student-place">{place === undefined ? '…' : `Platz ${place}`}</span>}
        </div>
        <div className="student-stat">
          <span className="stat-icon stat-sparks" />
          <strong>{save.sparks}</strong> Funken · {save.foundSparks.length} versteckte gefunden
        </div>
        <Progress label="Tage" value={days} max={DAYS} />
        <Progress label="Rätsel" value={solved} max={DAYS} />
      </div>

      <h3>
        Abzeichen <small>{earned}/{badges.length}</small>
      </h3>
      <div className="badge-grid">
        {badges.map(({ badge, earned: has }) => (
          <button
            key={badge.id}
            type="button"
            className={`badge ${has ? 'earned' : 'locked'} ${picked === badge.id ? 'picked' : ''}`}
            aria-label={has || !badge.secret ? badge.name : 'Geheimes Abzeichen'}
            onClick={() => setPicked(picked === badge.id ? null : badge.id)}
          >
            <AssetImage id={`ui.badge.${badge.id}`} w={40} h={40} />
            {!has && badge.secret && <span className="badge-secret">?</span>}
          </button>
        ))}
      </div>
      <p className="badge-caption">
        {!shown && 'Tippe auf ein Abzeichen.'}
        {shown && (shown.earned || !shown.badge.secret) && (
          <>
            <strong>{shown.badge.name}</strong> – {shown.badge.text}
            {!shown.earned && ` (${shown.value}/${shown.badge.goal})`}
          </>
        )}
        {shown && !shown.earned && shown.badge.secret && 'Ein Geheimnis. Vielleicht hast du schon eine Ahnung …'}
      </p>
    </div>
  );
}

function Progress({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="student-progress">
      <span className="student-progress-label">{label}</span>
      <span className="student-progress-bar">
        <span style={{ width: `${Math.round((value / max) * 100)}%` }} />
      </span>
      <span className="student-progress-value">
        {value}/{max}
      </span>
    </div>
  );
}
