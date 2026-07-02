import React from 'react';

export default function DetallePublicacion() {
  return (
    <div className="detalle-publicacion-container">
      <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="publicacion-card" style={{ background: '#fff', padding: '40px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center', marginTop: '80px' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '48px' }}>🐾</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-fredoka)', color: '#555', marginBottom: '10px' }}>
            No se encontró la publicación.
          </h2>
          <p style={{ color: '#888' }}>Vuelve al inicio y selecciona una mascota desde el feed.</p>
        </div>
      </main>
    </div>
  );
}