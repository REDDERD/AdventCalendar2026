import { useState } from 'react';
import { PixelKeyboard } from '../../ui/PixelKeyboard';
import { matchesAnswer } from '../normalize';
import type { InputConfig } from '../schema';
import type { Engine, EngineProps } from './types';

function InputEngine({ puzzle, disabled, onSubmit }: EngineProps) {
  const config = puzzle.config as InputConfig;
  const [value, setValue] = useState('');

  const submit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
  };

  return (
    <div className="engine-input">
      <div className="input-display">{value || <span className="input-cursor">_</span>}</div>
      <PixelKeyboard
        mode={config.inputMode}
        disabled={disabled}
        onKey={(k) => setValue((v) => (v.length < config.maxLength ? v + k : v))}
        onDelete={() => setValue((v) => v.slice(0, -1))}
        onSubmit={submit}
      />
    </div>
  );
}

export const inputEngine: Engine = {
  Component: InputEngine,
  check: (puzzle, input) => matchesAnswer(String(input), puzzle.solution as string[]),
  describe: (input) => String(input),
};
