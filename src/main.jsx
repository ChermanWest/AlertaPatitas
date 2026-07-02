import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import FeedPrincipal from './components/FeedPrincipal';
import FormularioReporte from './components/FormularioReporte';
import Login from './components/Login'; 
import Registro from './components/Registro'; // 👈 Importamos tu nuevo componente

import '../home.css'; 

function MainApp() {
  const [vista, setVista] = useState('feed'); 

  return (
    <div className="app-container">
      {/* Barra de navegación flotante completa para tu video */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 10000, display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.95)', padding: '10px', borderRadius: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <button onClick={() => setVista('feed')} style={{ padding: '10px 14px', background: '#8b4513', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>🐾 Feed</button>
        <button onClick={() => setVista('formulario')} style={{ padding: '10px 14px', background: '#3cb371', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>📝 Reportar</button>
        <button onClick={() => setVista('login')} style={{ padding: '10px 14px', background: '#c8a040', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>🔑 Login</button>
        <button onClick={() => setVista('registro')} style={{ padding: '10px 14px', background: '#20b2aa', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>✍️ Registro</button>
      </div>

      {/* Renderizado condicional de las cuatro pantallas */}
      {vista === 'feed' && <FeedPrincipal />}
      {vista === 'formulario' && <FormularioReporte />}
      {vista === 'login' && <Login />}
      {vista === 'registro' && <Registro />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);