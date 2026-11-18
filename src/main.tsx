import '@fontsource/jersey-10/400.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

// No StrictMode: its double effects would advance the Ink story twice.
createRoot(document.getElementById('root')!).render(<App />);
