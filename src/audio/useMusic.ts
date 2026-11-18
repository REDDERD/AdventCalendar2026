import { useEffect } from 'react';
import { playMusic } from './AudioService';

/** The music for the screen being shown [SND-1]. */
export function useMusic(id: string | null): void {
  useEffect(() => playMusic(id), [id]);
}
