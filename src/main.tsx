import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely intercept and handle browser extension or MetaMask injection failures in sandboxed iframes
if (typeof window !== 'undefined') {
  // Overwrite window.ethereum fully to avoid MetaMask connection errors inside sandboxed preview iframes
  try {
    const safeEthereumStub = {
      isMetaMask: false,
      request: async (args: { method: string; params?: any[] }) => {
        console.warn('🛡️ Stubbed window.ethereum.request called inside sandbox:', args);
        if (args?.method === 'eth_accounts' || args?.method === 'eth_requestAccounts') {
          return [];
        }
        return null;
      },
      enable: async () => [],
      send: async () => [],
      sendAsync: (payload: any, callback: any) => {
        if (typeof callback === 'function') {
          callback(null, { result: [] });
        }
      },
      on: () => {},
      removeListener: () => {},
      autoRefreshOnNetworkChange: false,
      isConnected: () => false,
      providers: []
    };
    Object.defineProperty(window, 'ethereum', {
      value: safeEthereumStub,
      writable: true,
      configurable: true
    });
  } catch (e) {
    console.warn('🛡️ Failed to define window.ethereum stub:', e);
  }

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    const errMessage = (event.error && event.error.message) || '';
    const fullMsg = (msg + ' ' + errMessage).toLowerCase();
    if (
      fullMsg.includes('metamask') ||
      fullMsg.includes('ethereum') ||
      fullMsg.includes('wallet') ||
      fullMsg.includes('extension') ||
      fullMsg.includes('failed to connect') ||
      fullMsg.includes('provider')
    ) {
      console.warn('🛡️ Suppressed extension/MetaMask error inside sandbox:', msg || errMessage);
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const reasonStr = reason ? (reason.message || String(reason)) : '';
    if (
      reasonStr.toLowerCase().includes('metamask') ||
      reasonStr.toLowerCase().includes('ethereum') ||
      reasonStr.toLowerCase().includes('wallet') ||
      reasonStr.toLowerCase().includes('extension') ||
      reasonStr.toLowerCase().includes('eth_') ||
      reasonStr.toLowerCase().includes('failed to connect')
    ) {
      console.warn('🛡️ Suppressed unhandled MetaMask/wallet promise rejection inside sandbox:', reasonStr);
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
