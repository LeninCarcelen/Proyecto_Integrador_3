import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Usuario from './pages/Usuario';
import Admin from './pages/Admin';
import Limpieza from './pages/Limpieza';
import { getHealth } from './api/config';
import './App.css';
function App() {
  const [rol, setRol] = useState(localStorage.getItem('rol'));
  const [apiConnected, setApiConnected] = useState(false);
  useEffect(() => {
    getHealth()
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false));
  }, []);
  return (
    <BrowserRouter>
      <div className="App">
        {/* Navbar solo si está logueado */}
        {rol && <Navbar />}
        {/* Mostrar si API no está disponible */}
        {!apiConnected && (
          <div style={{
            padding: '12px',
            background: '#ef4444',
            color: '#fff',
            textAlign: 'center',
            margin: '12px'
          }}>
             Backend no disponible. Asegúrate que `node index.js` está corriendo en puerto 3000
          </div>
        )}
        <Routes>
          <Route path="/login" element={<Login setRol={setRol} />} />
          <Route
            path="/"
            element={rol === 'usuario' ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/usuario"
            element={rol === 'usuario' ? <Usuario /> : <Navigate to="/login" />}
          />
          <Route
            path="/limpieza"
            element={rol === 'limpieza' ? <Limpieza /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={rol === 'admin' ? <Admin /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;