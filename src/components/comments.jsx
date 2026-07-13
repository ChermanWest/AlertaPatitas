/* ============================================================
   ALERTA PATITAS — Comments.jsx
   ============================================================ */

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function Comments({ mascotaId, comentariosIniciales }) {
  const { usuario } = useAuth();
  const [comentarios, setComentarios] = useState(
    Array.isArray(comentariosIniciales) ? comentariosIniciales : []
  );
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const nombreAutor = usuario?.nick || usuario?.email?.split('@')[0] || 'Usuario';

  async function enviarComentario(e) {
    e.preventDefault();
    setError(null);

    if (!usuario) return;
    const contenido = texto.trim();
    if (!contenido) return;

    setEnviando(true);

    const nuevoComentario = {
      id: crypto.randomUUID(),
      autor_id: usuario.id,
      autor_nombre: nombreAutor,
      texto: contenido,
      fecha: new Date().toISOString(),
    };

    const comentariosActualizados = [...comentarios, nuevoComentario];

    try {
      const { error: updateError } = await supabase
        .from('mascotas')
        .update({ comentarios: comentariosActualizados })
        .eq('id', mascotaId);

      if (updateError) throw updateError;

      setComentarios(comentariosActualizados);
      setTexto('');
    } catch (err) {
      console.error('Error al guardar comentario:', err);
      setError('No se pudo guardar tu comentario. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <aside className="comments-panel">
      <h3 className="comments-title">💬 Comentarios ({comentarios.length})</h3>

      <div className="comments-list">
        {comentarios.length === 0 && (
          <p className="comments-empty">Aún no hay comentarios. ¡Sé el primero en ayudar!</p>
        )}

        {[...comentarios]
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-autor">{c.autor_nombre}</span>
                <span className="comment-fecha">
                  {new Date(c.fecha).toLocaleDateString('es-CL', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="comment-texto">{c.texto}</p>
            </div>
          ))}
      </div>

      {usuario ? (
        <form className="comment-form" onSubmit={enviarComentario}>
          <textarea
            className="comment-textarea"
            placeholder="Escribe un comentario…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={3}
          />
          {error && <p className="comment-error">{error}</p>}
          <button type="submit" className="comment-submit" disabled={enviando || !texto.trim()}>
            {enviando ? 'Enviando…' : 'Comentar'}
          </button>
        </form>
      ) : (
        <p className="comments-login-notice">
          Debes iniciar sesión para comentar.
        </p>
      )}
    </aside>
  );
}