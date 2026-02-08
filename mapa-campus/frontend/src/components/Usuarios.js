import { useEffect, useState } from 'react';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');

  // GET
  const cargarUsuarios = () => {
    fetch('http://localhost:3001/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data));
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // POST / PUT
  const guardarUsuario = () => {
    if (nombre.trim() === '') {
      setError('El nombre es obligatorio');
      return;
    }

    setError('');

    if (editando) {
      // PUT
      fetch(`http://localhost:3001/usuarios/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      })
        .then(() => {
          setEditando(null);
          setNombre('');
          cargarUsuarios();
        });
    } else {
      // POST
      fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      })
        .then(() => {
          setNombre('');
          cargarUsuarios();
        });
    }
  };

  // DELETE
  const eliminarUsuario = (id) => {
    fetch(`http://localhost:3001/usuarios/${id}`, {
      method: 'DELETE'
    })
      .then(() => cargarUsuarios());
  };

  return (
    <div className="card">
      <h3 className="section-title">CRUD Usuarios</h3>

      <div className="usuarios-form">
        <input
          className="input"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre"
        />

        <button className="btn btn-primary" onClick={guardarUsuario}>
          {editando ? 'Actualizar' : 'Agregar'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <ul className="usuarios-list">
        {usuarios.map(u => (
          <li key={u.id}>
            <span>{u.nombre}</span>
            <span>
              <button className="btn" onClick={() => {
                setEditando(u.id);
                setNombre(u.nombre);
              }}>
                Editar
              </button>
              <button className="btn btn-danger" onClick={() => eliminarUsuario(u.id)}>
                Eliminar
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;
