
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add meta tag to ensure proper viewport
document.querySelector('head')?.insertAdjacentHTML(
  'beforeend',
  `<link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`
);

createRoot(document.getElementById("root")!).render(<App />);
