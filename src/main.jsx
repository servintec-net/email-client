import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-v19-helmet-async';
import './index.css';
import './website/styles/globals.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('App error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600 }}>
          <h2 style={{ color: '#c00' }}>Something went wrong</h2>
          <pre style={{ background: '#f5f5f5', padding: 12, overflow: 'auto' }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <p style={{ fontSize: 14, color: '#666' }}>Check the browser console (F12) for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  document.body.innerHTML = '<p style="padding:24px;font-family:sans-serif">Root element #root not found.</p>';
} else {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  );
  reportWebVitals();
}
