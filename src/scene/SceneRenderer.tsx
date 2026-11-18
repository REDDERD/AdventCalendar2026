import type { StageState } from '../types';
import { AssetImage } from '../ui/AssetImage';
import { Hotspot } from './Hotspot';

const ACTOR_X = { left: 56, center: 128, right: 200 } as const;
const FLOOR_Y = 176;

interface Props {
  stage: StageState;
  emotes: Record<string, string>;
  onSpark?: (id: string) => void;
}

/** Background, actors, emote bubbles and spark hotspots of the top screen. */
export function SceneRenderer({ stage, emotes, onSpark }: Props) {
  return (
    <div className="scene">
      {stage.bg && <AssetImage id={`bg.${stage.bg}`} w={256} h={192} className="scene-bg" />}
      {stage.actors.map((actor) => {
        const x = ACTOR_X[actor.pos] - 32;
        const y = FLOOR_Y - 64;
        return (
          <div key={actor.id} className="actor" style={{ left: x, top: y }}>
            <AssetImage id={`npc.${actor.id}`} w={64} h={64} />
            {emotes[actor.id] && <Emote emote={emotes[actor.id]} />}
          </div>
        );
      })}
      {stage.sparks.map((spark) => (
        <Hotspot key={spark.id} x={spark.x} y={spark.y} onTap={() => onSpark?.(spark.id)} className="spark" />
      ))}
    </div>
  );
}

export function Emote({ emote }: { emote: string }) {
  return (
    <div className="emote">
      <AssetImage id={`emote.${emote}`} w={16} h={16} />
    </div>
  );
}
