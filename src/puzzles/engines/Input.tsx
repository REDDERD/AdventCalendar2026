import { AssetImage } from '../../ui/AssetImage';
import { PixelKeyboard } from '../../ui/PixelKeyboard';
import { inputLogic, type InputConfig } from '../logic/input';
import type { Engine, EngineProps } from './types';

function InputEngine({ puzzle, state, setState, disabled, onSubmit }: EngineProps<string>) {
  const config = puzzle.config as InputConfig;

  const submit = () => {
    if (!state.trim()) return;
    onSubmit(state);
    setState('');
  };

  return (
    <div className="engine-input">
      {config.figure && <AssetImage id={config.figure.image} w={256} h={config.figure.height} className="input-figure" />}
      <div className="input-display">{state || <span className="input-cursor">_</span>}</div>
      <PixelKeyboard
        mode={config.inputMode}
        disabled={disabled}
        onKey={(k) => setState(state.length < config.maxLength ? state + k : state)}
        onDelete={() => setState(state.slice(0, -1))}
        onSubmit={submit}
      />
    </div>
  );
}

export const inputEngine: Engine<string> = { logic: inputLogic, Component: InputEngine, submit: 'direct' };
