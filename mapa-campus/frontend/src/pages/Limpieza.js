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
      console.log(' Ubicaciones:', ubData.data?.length);
      console.log(' Alertas totales:', alertasData.data?.length);
      setUbicaciones(ubData.data || []);
      const alertasActivas = (alertasData.data || []).filter(
        a => a.estado !== 'resuelta'
      );
      console.log(' Alertas activas:', alertasActivas.length);
      setAlertas(alertasActivas);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      console.log(' Cambiando estado:', { id, nuevoEstado });
      const response = await fetch(`http://localhost:3000/api/alertas/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevo_estado: nuevoEstado })
      });
      const data = await response.json();
      console.log(' Respuesta:', data);
      if (data.success) {
        alert(' Estado actualizado');
        if (nuevoEstado === 'resuelta') {
          setAlertas(prev => prev.filter(a => a._id !== id));
        } else {
          cargarDatos();
        }
      } else {
        alert(' Error: ' + data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      alert(' Error: ' + err.message);
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
        <h3> Alertas Activas ({alertas.length})</h3>
        {loading ? (
          <p>Cargando alertas...</p>
        ) : alertas.length > 0 ? (
          <ul className="usuarios-list">
            {alertas.map(a => (
              <li 
                key={a._id}
                style={{
                  borderLeft: `4px solid ${
                    a.urgencia === 'crítica' ? '#ef4444' : 
                    a.urgencia === 'alta' ? '#f97316' : 
                    '#eab308'
                  }`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{a.nombre_ubicacion || 'Alerta'}</strong>
                  <br />
                  <small style={{ color: 'rgba(45,55,72,0.6)' }}>
                    Tipo: {a.tipo_alerta} | Urgencia: {a.urgencia}
                  </small>
                  <br />
                  <small style={{ color: 'rgba(45,55,72,0.6)' }}>
                    {a.descripcion}
                  </small>
                </div>
                <select
                  value={a.estado}
                  onChange={e => cambiarEstado(a._id, e.target.value)}
                  className="input"
                  style={{ marginLeft: '12px', minWidth: '120px', padding: '6px' }}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="resuelta">Resuelta</option>
                </select>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#10b981', textAlign: 'center', padding: '20px' }}>
            ✓ No hay alertas pendientes
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Limpieza;
