import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');
  const usuario = localStorage.getItem('usuario');

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (rol !== 'usuario' && rol !== 'limpieza' && rol !== 'admin') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="brand">Aplicación Campus</div>

      <div className="nav-actions">
        <div className="nav-user">{usuario ? usuario : ''}</div>
        <button onClick={cerrarSesion} className="btn-logout">Cerrar sesión</button>
      </div>
    </nav>
  );
}

export default Navbar;
