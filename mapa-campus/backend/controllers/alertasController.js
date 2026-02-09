const { sql, connectSQL } = require('../config/sqlConfig');
const AlertaActiva = require('../models/AlertaActiva');

exports.crearAlerta = async (req, res) => {
  const pool = await connectSQL();
  try {
    const { id_usuario, latitud, longitud, tipo, descripcion } = req.body;

    console.log('Crear alerta:', { id_usuario, latitud, longitud, tipo });

    if (!id_usuario || latitud === undefined || longitud === undefined || !tipo) {
      return res.status(400).json({
        success: false,
        error: 'Faltan parámetros requeridos (id_usuario, latitud, longitud, tipo)'
      });
    }

    // Obtener datos del usuario
    const usuarioResult = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('SELECT u.nombre, r.nombre as rol FROM Usuario u INNER JOIN Rol r ON u.id_rol = r.id_rol WHERE u.id_usuario = @id_usuario');

    if (!usuarioResult.recordset.length) {
      pool.close();
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const usuario = usuarioResult.recordset[0];

    // GUARDAR EN SQL SERVER - Solo por coordenadas
    const alertaSQL = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('latitud', sql.Float, parseFloat(latitud))
      .input('longitud', sql.Float, parseFloat(longitud))
      .input('tipo', sql.VarChar(50), tipo)
      .input('descripcion', sql.VarChar(500), descripcion || '')
      .input('estado', sql.VarChar(30), 'pendiente')
      .input('urgencia', sql.VarChar(30), 'media')
      .input('fecha_creacion', sql.DateTime, new Date())
      .query(`
        INSERT INTO Alerta (id_usuario, latitud, longitud, tipo, descripcion, estado, urgencia, fecha_creacion)
        VALUES (@id_usuario, @latitud, @longitud, @tipo, @descripcion, @estado, @urgencia, @fecha_creacion);
        SELECT CAST(SCOPE_IDENTITY() AS INT) as id_alerta_creada;
      `);

    const id_alerta_sql = parseInt(alertaSQL.recordset[0].id_alerta_creada);
    console.log('Alerta guardada en SQL Server, ID:', id_alerta_sql);

    // GUARDAR EN MONGODB
    const alertaMongo = new AlertaActiva({
      id_alerta: id_alerta_sql,
      id_usuario: id_usuario,
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
      tipo_alerta: tipo,
      estado: 'pendiente',
      urgencia: 'media',
      usuario_reporte: {
        id: id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol
      },
      descripcion: descripcion || '',
      fecha_creacion: new Date(),
      visualizaciones: 0
    });

    await alertaMongo.save();

    console.log('Alerta guardada en MongoDB');

    pool.close();

    res.status(201).json({
      success: true,
      message: 'Alerta creada por coordenadas',
      data: alertaMongo
    });

  } catch (error) {
    console.error('Error al crear alerta:', error.message);
    if (pool) pool.close();
    res.status(500).json({
      success: false,
      error: 'Error al crear alerta: ' + error.message
    });
  }
};

exports.obtenerAlertas = async (req, res) => {
  try {
    const alertas = await AlertaActiva.find();
    
    console.log('Alertas encontradas:', alertas.length);

    res.json({ 
      success: true, 
      total: alertas.length,
      data: alertas 
    });
  } catch (error) {
    console.error('Error al obtener alertas:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.obtenerAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const alerta = await AlertaActiva.findById(id);
    
    if (!alerta) {
      return res.status(404).json({ 
        success: false,
        error: 'Alerta no encontrada'
      });
    }
    
    res.json({ success: true, data: alerta });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cambiarEstado = async (req, res) => {
  const pool = await connectSQL();
  try {
    const { id } = req.params;
    const { nuevo_estado } = req.body;

    console.log('Cambiar estado alerta:', { id, nuevo_estado });

    // ACTUALIZAR EN MONGODB
    const alerta = await AlertaActiva.findByIdAndUpdate(
      id,
      { estado: nuevo_estado },
      { new: true }
    );

    if (!alerta) {
      pool.close();
      return res.status(404).json({ 
        success: false,
        error: 'Alerta no encontrada'
      });
    }

    // ACTUALIZAR EN SQL SERVER
    await pool
      .request()
      .input('id_alerta', sql.Int, alerta.id_alerta)
      .input('nuevo_estado', sql.VarChar(30), nuevo_estado)
      .query(`
        UPDATE Alerta 
        SET estado = @nuevo_estado, fecha_actualizacion = GETDATE()
        WHERE id_alerta = @id_alerta
      `);

    console.log('Estado actualizado en ambas BDs');

    pool.close();

    res.json({ 
      success: true, 
      message: 'Estado actualizado',
      data: alerta
    });

  } catch (error) {
    console.error(' Error:', error.message);
    if (pool) pool.close();
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
exports.incrementarVisualizaciones = async (req, res) => {
  try {
    const { id } = req.params;
    const alerta = await AlertaActiva.findByIdAndUpdate(
      id,
      { $inc: { visualizaciones: 1 } },
      { new: true }
    );
    res.json({ success: true, data: alerta });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};