import type { ChoiceOption } from './DialogueRunner';

interface Props {
  options: ChoiceOption[];
  onChoose: (index: number) => void;
}

export function ChoiceList({ options, onChoose }: Props) {
  return (
    <div className="choices">
      {options.map((o) => (
        <button key={o.index} type="button" className="choice" onClick={() => onChoose(o.index)}>
          {o.text}
        </button>
      ))}
    </div>
  );
}
