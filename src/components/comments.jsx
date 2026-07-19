/* ============================================================
   ALERTA PATITAS — Comments.jsx
   ============================================================ */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function Comments({ mascotaId }) {
  const { usuario } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const nombreAutor = usuario?.nick || usuario?.email?.split('@')[0] || 'Usuario';

  const cargarComentarios = useCallback(async () => {
    setCargando(true);
    const { data, error: fetchError } = await supabase
      .from('comentarios')
      .select('id, autor_id, autor_nombre, texto, fecha')
      .eq('mascota_id', mascotaId)
      .order('fecha', { ascending: false });

    if (fetchError) {
      console.error('Error al cargar comentarios:', fetchError);
      setError('No se pudieron cargar los comentarios.');
    } else {
      setComentarios(data);
    }
    setCargando(false);
  }, [mascotaId]);

  useEffect(() => {
    cargarComentarios();

    // Suscripción en tiempo real: si otro usuario comenta, se actualiza solo
    const canal = supabase
      .channel(`comentarios-${mascotaId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comentarios', filter: `mascota_id=eq.${mascotaId}` },
        () => cargarComentarios()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [mascotaId, cargarComentarios]);

  async function enviarComentario(e) {
    e.preventDefault();
    setError(null);

    if (!usuario) return;
    const contenido = texto.trim();
    if (!contenido) return;

    setEnviando(true);

    const { error: insertError } = await supabase.from('comentarios').insert({
      mascota_id: mascotaId,
      autor_id: usuario.id,
      autor_nombre: nombreAutor,
      texto: contenido,
    });

    if (insertError) {
      console.error('Error al guardar comentario:', insertError);
      setError('No se pudo guardar tu comentario. Intenta de nuevo.');
    } else {
      setTexto('');
      // Si no tienes Realtime habilitado, descomenta la línea de abajo
      // para refrescar la lista manualmente:
      // await cargarComentarios();
    }

    setEnviando(false);
  }

  async function borrarComentario(id) {
    const { error: deleteError } = await supabase
      .from('comentarios')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error al borrar comentario:', deleteError);
      setError('No se pudo borrar el comentario.');
    }
  }

  return (
    <aside className="comments-panel">
      <h3 className="comments-title">💬 Comentarios ({comentarios.length})</h3>

      <div className="comments-list">
        {cargando && <p className="comments-empty">Cargando comentarios…</p>}

        {!cargando && comentarios.length === 0 && (
          <p className="comments-empty">Aún no hay comentarios. ¡Sé el primero en ayudar!</p>
        )}

        {comentarios.map((c) => (
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
            {usuario?.id === c.autor_id && (
              <button
                type="button"
                className="comment-borrar"
                onClick={() => borrarComentario(c.id)}
              >
                Borrar
              </button>
            )}
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
