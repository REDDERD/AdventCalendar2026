interface Props {
  x: number;
  y: number;
  /** Visual size; the touch target is never smaller than 20×20 [UI-4]. */
  size?: number;
  className?: string;
  onTap: () => void;
}

export function Hotspot({ x, y, size = 8, className, onTap }: Props) {
  const target = Math.max(20, size);
  return (
    <button
      type="button"
      className={`hotspot ${className ?? ''}`}
      style={{ left: x - target / 2, top: y - target / 2, width: target, height: target }}
      onClick={(e) => {
        e.stopPropagation();
        onTap();
      }}
    >
      <span style={{ width: size, height: size }} />
    </button>
  );
}
