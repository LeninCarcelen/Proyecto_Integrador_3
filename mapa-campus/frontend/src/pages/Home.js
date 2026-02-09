import { useEffect, useState } from 'react';
import Mapa from '../components/Mapa';
import Footer from '../components/Footer';
import { getUbicaciones, getAlertas } from '../api/config';
import './roles.css';
function Home() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [ubData, alertasData] = await Promise.all([
          getUbicaciones(),
          getAlertas()
        ]);
        setUbicaciones(ubData.data || []);
        setAlertas(alertasData.data || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="app-container role-usuario">
      <h1 className="section-title">Mapa interactivo del campus</h1>
      <div className="map-wrapper">
        <Mapa ubicaciones={ubicaciones} alertas={alertas} />
      </div>
      {/* Mostrar info */}
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="card">
          <h3> Ubicaciones ({ubicaciones.length})</h3>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <ul className="usuarios-list">
              {ubicaciones.map(ub => (
                <li key={ub._id}>
                  <div>
                    <strong>{ub.nombre}</strong>
                    <br />
                    <small style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      {ub.tipo} • {ub.estado}
                    </small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <small>{ub.capacidad_actual}/{ub.capacidad_total}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <h3> Alertas activas ({alertas.length})</h3>
          {loading ? (
            <p>Cargando...</p>
          ) : alertas.length > 0 ? (
            <ul className="usuarios-list">
              {alertas.map(alerta => (
                <li key={alerta._id} style={{ borderLeft: `3px solid ${alerta.urgencia === 'crítica' ? '#ef4444' : alerta.urgencia === 'alta' ? '#f97316' : '#eab308'}` }}>
                  <div>
                    <strong>{alerta.nombre_ubicacion}</strong>
                    <br />
                    <small style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      {alerta.tipo_alerta} • {alerta.urgencia}
                    </small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <small>{alerta.estado}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#10b981' }}>✓ Sin alertas</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
