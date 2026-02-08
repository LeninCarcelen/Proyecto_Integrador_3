import { useState, useEffect } from 'react';
import Mapa from '../components/Mapa';
import Footer from '../components/Footer';
import './roles.css';

function Usuario() {
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

      console.log('📍 Ubicaciones:', ubData.data?.length);
      console.log('🚨 Alertas totales:', alertasData.data?.length);

      setUbicaciones(ubData.data || []);
      
      const alertasActivas = (alertasData.data || []).filter(
        a => a.estado !== 'resuelta'
      );
      
      console.log('🚨 Alertas activas:', alertasActivas.length);
      setAlertas(alertasActivas);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="app-container role-usuario">
      <h2 className="section-title">Mapa – Usuario</h2>
      <div className="map-wrapper">
        <Mapa 
          rol="usuario" 
          ubicaciones={ubicaciones}
          alertas={alertas}
        />
      </div>
      <div className="card">
        <h3>📊 Estado</h3>
        <p>Ubicaciones: {ubicaciones.length}</p>
        <p>Alertas activas: {alertas.length}</p>
      </div>
      <Footer />
    </div>
  );
}
export default Usuario;