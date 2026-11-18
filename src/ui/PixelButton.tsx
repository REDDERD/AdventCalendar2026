import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'wood' | 'wax' | 'parchment';
  small?: boolean;
}

export function PixelButton({ variant = 'wood', small, className, ...rest }: Props) {
  return (
    <button
      type="button"
      className={`pbtn pbtn-${variant} ${small ? 'pbtn-small' : ''} ${className ?? ''}`}
      {...rest}
    />
  );
}
