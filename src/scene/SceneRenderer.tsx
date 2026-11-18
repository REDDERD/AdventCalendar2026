import { IDLE_FRAME } from '../assets/manifest';
import { CharacterSprite } from '../character/CharacterSprite';
import { useStore } from '../core/store';
import type { StageState } from '../types';
import { AssetImage } from '../ui/AssetImage';
import { Hotspot } from './Hotspot';

/** Backgrounds are 256 × 512, anchored to the bottom of the scene (DECISIONS.md #32). */
export const WORLD_W = 256;
export const WORLD_H = 512;
/** Characters are drawn at 2× (128 px). */
export const ACTOR_SCALE = 2;
const ACTOR_SIZE = 64 * ACTOR_SCALE;
const ACTOR_X = { left: 60, center: 128, right: 196 } as const;
/** Default distance of the actors' feet from the scene bottom: just above the dialogue box. */
export const DEFAULT_FLOOR = 104;

interface Props {
  stage: StageState;
  emotes: Record<string, string>;
  onSpark?: (id: string) => void;
  /** Feet line in logical px from the bottom of the scene. */
  floor?: number;
}

/** Background, actors, emote bubbles and spark hotspots of a scene. */
export function SceneRenderer({ stage, emotes, onSpark, floor = DEFAULT_FLOOR }: Props) {
  const profile = useStore((s) => s.save?.profile);
  const draft = useStore((s) => s.save?.prologueDraft);
  const look = profile?.look ?? draft?.look;
  const house = profile?.house ?? null;

  return (
    <div className="scene">
      <div className="scene-world">
        {stage.bg && <AssetImage id={`bg.${stage.bg}`} w={WORLD_W} h={WORLD_H} />}
        {/* `# spark: id x y` uses world coordinates (256 × 512) */}
        {stage.sparks.map((spark) => (
          <Hotspot key={spark.id} x={spark.x} y={spark.y} onTap={() => onSpark?.(spark.id)} className="spark" />
        ))}
      </div>
      {stage.actors.map((actor) => (
        <div key={actor.id} className="actor" style={{ left: ACTOR_X[actor.pos] - ACTOR_SIZE / 2, bottom: floor }}>
          {actor.id === 'player' && look ? (
            <CharacterSprite look={look} house={house} scale={ACTOR_SCALE} />
          ) : (
            <AssetImage id={`npc.${actor.id}`} w={ACTOR_SIZE} h={ACTOR_SIZE} frame={IDLE_FRAME} />
          )}
          {emotes[actor.id] && <Emote emote={emotes[actor.id]} />}
        </div>
      ))}
    </div>
  );
}

export function Emote({ emote }: { emote: string }) {
  return (
    <div className="emote">
      <AssetImage id={`emote.${emote}`} w={24} h={24} />
    </div>
  );
}
