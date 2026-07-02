import React from 'react';

export default function Login() {
  return (
    <div className="auth-container">
      <header className="site-header">
        <div className="header-topbar"></div>
        <nav className="header-nav">
          <a href="#" className="logo">
            <div className="logo-icon">
              <img src="dist/Mask-group@2x.png" alt="Logo Alerta Patitas" className="logo-icon-img" />
            </div>
            <span className="logo-text">Alerta Patitas</span>
          </a>
          <ul className="nav-links">
            <li className="nav-item"><span>Inicio</span></li>
            <li className="nav-item"><a href="#">Acerca de nosotros</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero-auth" style={{ background: 'linear-gradient(135deg, #8b4513 0%, #c8a040 100%)', padding: '40px 0', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontFamily: 'var(--font-fredoka)', fontSize: '36px' }}>Iniciar sesión</h1>
      </section>

      <main style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="login-card" style={{ background: '#fff', padding: '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
            <button style={{ padding: '8px 16px', background: '#c8a040', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold' }}>Iniciar Sesión</button>
            <button style={{ padding: '8px 16px', background: '#fff', color: '#888', border: '1px solid #ddd', borderRadius: '20px' }}>Registrarse</button>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-box" style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', padding: '10px 14px', borderRadius: '8px' }}>
              <input type="email" placeholder="Correo electrónico" style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} />
            </div>
            <div className="input-box" style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', padding: '10px 14px', borderRadius: '8px' }}>
              <input type="password" placeholder="Contraseña" style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#555', cursor: 'pointer' }}>
              <input type="checkbox" /> Recordar cuenta
            </label>

            <button type="submit" style={{ background: '#8b4513', color: '#fff', border: 'none', padding: '12px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Iniciar Sesión
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
            <a href="#" style={{ color: '#c8a040', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>¿Olvidaste tu contraseña?</a>
            <span style={{ color: '#888' }}>¿No tienes cuenta? <a href="#" style={{ color: '#c8a040', fontWeight: 'bold', textDecoration: 'none' }}>Regístrate aquí</a></span>
          </div>
        </div>
      </main>
    </div>
  );
}