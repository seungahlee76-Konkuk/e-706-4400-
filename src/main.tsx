import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely intercept and handle browser extension or MetaMask injection failures in sandboxed iframes
if (typeof window !== 'undefined') {
  const isExtensionNoise = (text: string) => {
    const t = text.toLowerCase();
    return (
      t.includes('chrome-extension://') ||
      t.includes('inpage.js') ||
      t.includes('metamask') ||
      t.includes('ethereum') ||
      t.includes('wallet') ||
      t.includes('failed to connect')
    );
  };

  window.addEventListener('error', (event) => {
    const details = [
      event.message || '',
      event.filename || '',
      event.error?.message || '',
      event.error?.stack || '',
    ].join(' ');
    if (isExtensionNoise(details)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const details = reason
      ? [reason.message || '', reason.stack || '', String(reason)].join(' ')
      : '';
    if (isExtensionNoise(details)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
