import { AssetImage } from '../../ui/AssetImage';
import { choiceLogic, type ChoiceConfig, type ChoiceState } from '../logic/choice';
import type { Engine, EngineProps } from './types';

function ChoiceEngine({ puzzle, state, setState, disabled }: EngineProps<ChoiceState>) {
  const { options, columns, figure } = puzzle.config as ChoiceConfig;
  return (
    <div className="engine-choice-wrap">
      {figure && <AssetImage id={figure.image} w={256} h={figure.height} className="choice-figure" />}
      <div className={`engine-choice cols-${columns}`}>
        {options.map((option, i) => (
          <button
            key={i}
            type="button"
            className={`answer-card ${state === i ? 'selected' : ''}`}
            aria-pressed={state === i}
            disabled={disabled}
            onClick={() => setState(state === i ? null : i)}
          >
            {/* Picture cards are told apart by the picture; text cards get a letter */}
            {option.image ? <AssetImage id={option.image} w={48} h={48} /> : <span className="answer-letter">{String.fromCharCode(65 + i)}</span>}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export const choiceEngine: Engine<ChoiceState> = { logic: choiceLogic, Component: ChoiceEngine, submit: 'check' };
