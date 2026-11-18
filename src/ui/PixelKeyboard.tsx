const NUMBER_ROWS = [['1', '2', '3', '4', '5'], ['6', '7', '8', '9', '0']];
const TEXT_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
  ['Y', 'X', 'C', 'V', 'B', 'N', 'M', 'ß', '-'],
];

interface Props {
  mode: 'number' | 'text';
  onKey: (key: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

/** Own pixel keyboard for `input` puzzles – no system keyboard (Section 10). */
export function PixelKeyboard({ mode, onKey, onDelete, onSubmit, disabled }: Props) {
  const rows = mode === 'number' ? NUMBER_ROWS : TEXT_ROWS;
  return (
    <div className={`keyboard keyboard-${mode}`}>
      {rows.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map((key) => (
            <button key={key} type="button" className="key" disabled={disabled} onClick={() => onKey(key)}>
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        {mode === 'text' && (
          <button type="button" className="key key-wide" disabled={disabled} onClick={() => onKey(' ')}>
            Leer
          </button>
        )}
        <button type="button" className="key key-wide" disabled={disabled} onClick={onDelete}>
          ←
        </button>
        <button type="button" className="key key-wide key-ok" disabled={disabled} onClick={onSubmit}>
          OK
        </button>
      </div>
    </div>
  );
}
