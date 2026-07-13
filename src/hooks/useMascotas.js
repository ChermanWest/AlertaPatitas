/* ============================================================
   ALERTA PATITAS — useMascotas.js

   ============================================================ */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('mascotas')
        .select('*')
        .order('fecha', { ascending: false });

      if (sbError) throw sbError;
      setMascotas(data || []);
    } catch (err) {
      console.error('Error cargando mascotas:', err);
      setError('No se pudieron cargar las publicaciones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { mascotas, loading, error, recargar: cargar };
}
