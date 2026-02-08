import { useEffect, useState } from 'react';
import Mapa from '../components/Mapa';
import Footer from '../components/Footer';
import './roles.css';

function Home() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [alertas, setAlertas] = useState([]);
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
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container role-usuario">
      <h1 className="section-title">Mapa interactivo del campus</h1>
      
      <div className="map-wrapper">
        <Mapa ubicaciones={ubicaciones} alertas={alertas} rol="usuario" />
      </div>

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
                    <small>{ub.tipo} • {ub.estado}</small>
                  </div>
                  <small>{ub.capacidad_actual}/{ub.capacidad_total}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3> Alertas ({alertas.length})</h3>
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
                  <small>{a.estado}</small>
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
