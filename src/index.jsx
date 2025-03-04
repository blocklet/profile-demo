import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

localStorage.setItem('CONSOLA_LEVEL', 999);

const root = createRoot(document.getElementById('app'));
root.render(<App />);

// import('https://esm.sh/vconsole').then(({ default: vConsole }) => {
//   new vConsole();
// });
