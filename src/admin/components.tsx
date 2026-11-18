import type { ReactNode } from 'react';
import { HOUSE_COLORS } from '../assets/palette';
import { CharacterSprite } from '../character/CharacterSprite';
import type { AdminPlayer } from './data';

const HOUSE_NAME: Record<string, string> = {
  gryffindor: 'Gryffindor',
  hufflepuff: 'Hufflepuff',
  ravenclaw: 'Ravenclaw',
  slytherin: 'Slytherin',
};

/** [ADM-5] Head crop of the player's own character, or the initial before the prologue. */
export function Avatar({ player, size = 40 }: { player: AdminPlayer; size?: number }) {
  const profile = player.save?.profile;
  const color = profile ? HOUSE_COLORS[profile.house][0] : '#4a4856';
  return (
    <span className="avatar" style={{ width: size, height: size, borderColor: color }}>
      {profile ? (
        <CharacterSprite look={profile.look} house={profile.house} portrait scale={size / 32} />
      ) : (
        <span className="avatar-initial" style={{ fontSize: size * 0.5 }}>
          {player.user.displayName.slice(0, 1).toUpperCase()}
        </span>
      )}
    </span>
  );
}

export function houseName(player: AdminPlayer): string {
  const house = player.save?.profile?.house;
  return house ? HOUSE_NAME[house] : 'noch ohne Haus';
}

export function houseColor(player: AdminPlayer): string {
  const house = player.save?.profile?.house;
  return house ? HOUSE_COLORS[house][0] : 'transparent';
}

export function Chip({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'good' | 'warn' | 'bad' | 'gold' }) {
  return <span className={`chip chip-${tone}`}>{children}</span>;
}
