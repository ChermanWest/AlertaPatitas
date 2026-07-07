import { useCallback, useEffect, useState } from 'react';

// Apuntamos directo al puerto e IP donde Django está activo
const API_URL = 'http://127.0.0.1:8000/api/mascotas/';

export function useMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMascotas(data);
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