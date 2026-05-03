import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import App from './App';
import { ColorModeProvider } from './providers';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeProvider>
      <App />
      <Toaster position="top-right" />
    </ColorModeProvider>
  </React.StrictMode>,
);
