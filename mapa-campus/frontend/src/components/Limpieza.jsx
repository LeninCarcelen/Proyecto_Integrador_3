import { useEffect, useState } from 'react';
import Mapa from '../components/Mapa';
import Footer from '../components/Footer';
import './roles.css';

function Limpieza() {
  const [alertas, setAlertas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [ubRes, alertasRes] = await Promise.all([
        fetch('http://localhost:3000/api/ubicaciones'),
        fetch('http://localhost:3000/api/alertas')
      ]);

      const ubData = await ubRes.json();
      const alertasData = await alertasRes.json();

      setUbicaciones(ubData.data || []);
      setAlertas(alertasData.data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:3000/api/alertas/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevo_estado: nuevoEstado })
      });

      if (response.ok) {
        alert('✅ Estado actualizado');
        cargarDatos();
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="app-container role-limpieza">
      <h2 className="section-title">Mapa – Equipo de Limpieza</h2>

      <div className="map-wrapper">
        <Mapa 
          rol="limpieza"
          ubicaciones={ubicaciones}
          alertas={alertas}
        />
      </div>

      <div className="card">
        <h3>🚨 Alertas Activas ({alertas.length})</h3>

        {loading ? (
          <p>Cargando...</p>
        ) : alertas.length > 0 ? (
          <ul className="usuarios-list">
            {alertas.map(a => (
              <li key={a._id}>
                <div>
                  <strong>{a.nombre_ubicacion}</strong>
                  <br />
                  <small>{a.tipo_alerta} • {a.urgencia}</small>
                </div>
                <select
                  value={a.estado}
                  onChange={e => cambiarEstado(a._id, e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="resuelta">Resuelta</option>
                </select>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#10b981' }}>✓ Sin alertas</p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Limpieza;