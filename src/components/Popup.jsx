export default function Popup({ mensaje }) {
  if (!mensaje) return null;
  return (
    <div className="auth-popup-overlay auth-popup-overlay--visible">
      <div className="auth-popup">
        <div className="auth-popup-icon">🐾</div>
        <p className="auth-popup-msg">{mensaje}</p>
      </div>
    </div>
  );
}
