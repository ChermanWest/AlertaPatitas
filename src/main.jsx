import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

/* ── Tus hojas de estilo reutilizadas van acá ──
   Copia home.css / auth.css (y cualquier otro .css que quieras
   reutilizar) dentro de src/styles/ e impórtalas aquí, por ejemplo:

   import './styles/home.css';
   import './styles/auth.css';
*/

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
