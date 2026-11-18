import type { CSSProperties, ReactNode } from 'react';

interface Props {
  variant?: 'parchment' | 'wood' | 'night';
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onClick?: () => void;
}

/** 9-slice-style frame drawn with CSS until `ui.frame.*` art exists. */
export function Frame({ variant = 'parchment', className, style, children, onClick }: Props) {
  return (
    <div className={`frame frame-${variant} ${className ?? ''}`} style={style} onClick={onClick}>
      {children}
    </div>
  );
}
