import { useState } from 'react';
import { crearAlerta } from '../api/config';
export default function CrearAlerta() {
  const [formData, setFormData] = useState({
    id_usuario: 1,
    id_ubicacion: 1,
    tipo: 'basura',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : parseInt(value)
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await crearAlerta(formData);
      setMessage(`✓ Alerta creada: ${response.idAlerta}`);
      setFormData({
        id_usuario: 1,
        id_ubicacion: 1,
        tipo: 'basura',
        descripcion: ''
      });
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Crear Alerta</h3>
      
      <div className="usuarios-form">
        <input
          type="number"
          name="id_usuario"
          placeholder="ID Usuario"
          value={formData.id_usuario}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div className="usuarios-form">
        <input
          type="number"
          name="id_ubicacion"
          placeholder="ID Ubicación"
          value={formData.id_ubicacion}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div className="usuarios-form">
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="basura">Basura</option>
          <option value="reciclaje">Reciclaje</option>
        </select>
      </div>
      <div className="usuarios-form">
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción (opcional)"
          value={formData.descripcion}
          onChange={handleChange}
          className="input"
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Alerta'}
      </button>

      {message && (
        <p className={message.includes('✓') ? '' : 'error'}>
          {message}
        </p>
      )}
    </form>
  );
}