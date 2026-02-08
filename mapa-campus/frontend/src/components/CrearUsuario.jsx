import { useState } from 'react';
import { apiCall } from '../api/config';
export default function CrearUsuario() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    id_rol: 2
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'id_rol' ? parseInt(value) : value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(' Enviando datos:', formData);
      
      const response = await apiCall('/usuarios', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      console.log(' Respuesta del servidor:', response);
      setMessage(' Usuario creado');
      setFormData({ nombre: '', correo: '', password: '', id_rol: 2 });
    } catch (error) {
      console.error(' Error en la solicitud:', error);
      setMessage(' Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };  
  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Crear Usuario</h3>
      <div className="usuarios-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div className="usuarios-form">
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div className="usuarios-form">
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div className="usuarios-form">
        <select name="id_rol" value={formData.id_rol} onChange={handleChange} className="input" required>
          <option value={6}>Usuario</option>
          <option value={7}>Limpieza</option>
          <option value={5}>Admin</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Usuario'}
      </button>
      {message && <p className={message.includes('✓') ? '' : 'error'}>{message}</p>}
    </form>
  );

}
