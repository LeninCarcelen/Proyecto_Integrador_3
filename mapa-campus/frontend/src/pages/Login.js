import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setRol }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Llamar a la API del backend
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuario,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar datos en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('usuario', data.usuario);
        localStorage.setItem('id_usuario', data.id_usuario);
        
        setRol(data.rol);

        // Redirigir según rol
        if (data.rol === 'usuario') navigate('/');
        if (data.rol === 'limpieza') navigate('/limpieza');
        if (data.rol === 'admin') navigate('/admin');
      } else {
        setError(data.error || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor. Verifica que está corriendo en puerto 3000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className={`login-card ${shake ? 'shake' : ''}`}>
        <div className="brand">Aplicación Campus</div>

        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleLogin} className="login-form" noValidate>
          <label className="input-group">
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              required
              disabled={loading}
            />
            <span className="underline" />
          </label>

          <label className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <span className="underline" />
          </label>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
export default Login;