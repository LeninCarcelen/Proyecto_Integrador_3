const { sql, connectSQL } = require('../config/sqlConfig');
const bcrypt = require('bcryptjs');

exports.crearUsuario = async (req, res) => {
  const pool = await connectSQL();

  try {
    const { nombre, correo, password, id_rol } = req.body;

    console.log('Crear usuario:', { nombre, correo, id_rol });

    if (!nombre || !correo || !password || !id_rol) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos'
      });
    }

    // Guardar contraseña en texto plano (sin bcrypt por ahora)
    const result = await pool
      .request()
      .input('nombre', sql.VarChar(100), nombre)
      .input('correo', sql.VarChar(100), correo)
      .input('password_hash', sql.VarChar(255), password)
      .input('id_rol', sql.Int, id_rol)
      .input('estado', sql.VarChar(20), 'activo')
      .query(`
        INSERT INTO Usuario (nombre, correo, password_hash, id_rol, estado)
        VALUES (@nombre, @correo, @password_hash, @id_rol, @estado)
      `);

    console.log('Usuario creado en SQL Server');

    pool.close();

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente'
    });

  } catch (error) {
    console.error('Error al crear usuario:', error.message);
    pool.close();
    res.status(500).json({
      success: false,
      error: 'Error al crear usuario: ' + error.message
    });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  const pool = await connectSQL();
  try {
    const result = await pool
      .request()
      .query(`
        SELECT u.id_usuario, u.nombre, u.correo, u.estado, r.nombre as rol
        FROM Usuario u
        INNER JOIN Rol r ON u.id_rol = r.id_rol
        ORDER BY u.id_usuario DESC
      `);
    pool.close();
    res.json({
      success: true,
      total: result.recordset.length,
      data: result.recordset
    });
  } catch (error) {
    console.error('Error:', error.message);
    pool.close();
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios'
    });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const pool = await connectSQL();
  try {
    const { id } = req.params;
    await pool
      .request()
      .input('id_usuario', sql.Int, id)
      .query('DELETE FROM Usuario WHERE id_usuario = @id_usuario');
    pool.close();
    res.json({
      success: true,
      message: 'Usuario eliminado'
    });
  } catch (error) {
    console.error('Error:', error.message);
    pool.close();
    res.status(500).json({
      success: false,
      error: 'Error al eliminar usuario'
    });
  }
};