import { useEffect, useState } from 'react';
import { getUbicaciones } from '../api/config';
export default function UbicacionesList() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const cargarUbicaciones = async () => {
      try {
        setLoading(true);
        const data = await getUbicaciones();
        setUbicaciones(data.data || []);
        setError(null);
      } catch (err) {
        setError('Error al cargar ubicaciones: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    cargarUbicaciones();
  }, []);
  if (loading) return <p>Cargando ubicaciones...</p>;
  if (error) return <p style={{ color: '#ef4444' }}>{error}</p>;
  return (
    <div>
      <h3>Ubicaciones ({ubicaciones.length})</h3>
      <ul className="usuarios-list">
        {ubicaciones.map(ub => (
          <li key={ub.id_ubicacion}>
            <div>
              <strong>{ub.nombre}</strong>
              <br />
              <small>Tipo: {ub.tipo} | Estado: {ub.estado}</small>
            </div>
            <div>
              {ub.capacidad_actual}/{ub.capacidad_total}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}