import React from 'react'
import ReactDOM from 'react-dom/client';
import CoolWebsitesPage from './pages/CoolWebsitesPage.tsx';
import { ThemeProvider } from 'next-themes'
import './index.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <CoolWebsitesPage />
  );
} else {
  console.error("Root element not found!");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CoolWebsitesPage />
    </ThemeProvider>
  </React.StrictMode>
)

