export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-logo">
          <img src="/dist/Mask-group@2x.png" alt="Alerta Patitas" className="logo-img" />
          <span className="logo-text">Alerta Patitas</span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Alerta Patitas – Ayudando a reunir familias con sus mascotas.</p>
      </div>
    </footer>
  );
}
