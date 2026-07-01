import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import FeedPrincipal from './components/FeedPrincipal';
import FormularioReporte from './components/FormularioReporte';

// Como el archivo home.css está afuera en la raíz, subimos un nivel con '../'
import '../home.css'; 

function MainApp() {
  const [vista, setVista] = useState('feed'); 

  return (
    <div className="app-container">
      {/* Botones flotantes para cambiar de pantalla con un clic en tu video */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setVista('feed')} 
          style={{ padding: '12px 16px', background: '#8b4513', color: '#fff', border: '2px solid #fff', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
        >
          🐾 Ver Feed
        </button>
        <button 
          onClick={() => setVista('formulario')} 
          style={{ padding: '12px 16px', background: '#3cb371', color: '#fff', border: '2px solid #fff', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
        >
          📝 Ver Formulario
        </button>
      </div>

      {/* Renderizado condicional */}
      {vista === 'feed' ? <FeedPrincipal /> : <FormularioReporte />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);