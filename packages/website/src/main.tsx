import {createRoot} from 'react-dom/client';

import './main.css';

import {App} from './app/App';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(<App />);
