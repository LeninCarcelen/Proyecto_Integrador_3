const { sql, connectSQL } = require('../config/sqlConfig');
exports.crearContenedor = async (req, res) => {
  const pool = await connectSQL();
  try {
    const { id_usuario, tipo, latitud, longitud } = req.body;
    console.log(' Crear contenedor:', { id_usuario, tipo, latitud, longitud });
    if (!id_usuario || !tipo || latitud === undefined || longitud === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Faltan parámetros requeridos'
      });
    }
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('tipo', sql.VarChar(50), tipo)
      .input('latitud', sql.Float, parseFloat(latitud))
      .input('longitud', sql.Float, parseFloat(longitud))
      .input('estado', sql.VarChar(30), 'activo')
      .input('fecha_creacion', sql.DateTime, new Date())
      .query(`
        INSERT INTO Contenedores (id_usuario, tipo, latitud, longitud, estado, fecha_creacion)
        VALUES (@id_usuario, @tipo, @latitud, @longitud, @estado, @fecha_creacion);
        SELECT CAST(SCOPE_IDENTITY() AS INT) as id_contenedor_creado;
      `);
    const id_contenedor = parseInt(result.recordset[0].id_contenedor_creado);
    console.log('Contenedor creado:', id_contenedor);
    pool.close();
    res.status(201).json({
      success: true,
      message: 'Contenedor creado',
      data: { id_contenedor, id_usuario, tipo, latitud, longitud }
    });
  } catch (error) {
    console.error(' Error:', error.message);
    if (pool) pool.close();
    res.status(500).json({
      success: false,
      error: 'Error al crear contenedor: ' + error.message
    });
  }
};
exports.obtenerContenedores = async (req, res) => {
  const pool = await connectSQL();
  try {
    const result = await pool
      .request()
      .query(`
        SELECT id_contenedor, id_usuario, tipo, latitud, longitud, estado, fecha_creacion
        FROM Contenedores
        WHERE estado = 'activo'
        ORDER BY fecha_creacion DESC
      `);
    console.log(' Contenedores encontrados:', result.recordset.length);
    pool.close();
    res.json({
      success: true,
      total: result.recordset.length,
      data: result.recordset
    });
  } catch (error) {
    console.error(' Error:', error.message);
    if (pool) pool.close();
    res.status(500).json({
      success: false,
      error: 'Error al obtener contenedores: ' + error.message
    });
  }
};
exports.eliminarContenedor = async (req, res) => {
  const pool = await connectSQL();
  try {
    const { id } = req.params;
    await pool
      .request()
      .input('id_contenedor', sql.Int, id)
      .query('DELETE FROM Contenedores WHERE id_contenedor = @id_contenedor');
    pool.close();
    res.json({
      success: true,
      message: 'Contenedor eliminado'
    });
  } catch (error) {
    console.error(' Error:', error.message);
    if (pool) pool.close();
    res.status(500).json({
      success: false,
      error: 'Error al eliminar contenedor: ' + error.message
    });
  }
};