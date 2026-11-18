import '@fontsource/pixelify-sans/400.css';
import '@fontsource/pixelify-sans/700.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

// No StrictMode: its double effects would advance the Ink story twice.
createRoot(document.getElementById('root')!).render(<App />);
