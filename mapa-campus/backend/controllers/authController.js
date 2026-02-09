const { sql, connectSQL } = require('../config/sqlConfig');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const pool = await connectSQL();

  try {
    const { usuario, password } = req.body;

    console.log('Login intento:', { usuario });

    if (!usuario || !password) {
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    const result = await pool
      .request()
      .input('usuario', sql.VarChar(100), usuario)
      .query(`
        SELECT u.id_usuario, u.nombre, u.correo, u.password_hash, 
               r.nombre as rol
        FROM Usuario u
        INNER JOIN Rol r ON u.id_rol = r.id_rol
        WHERE (u.correo = @usuario OR u.nombre = @usuario) 
        AND u.estado = 'activo'
      `);

    if (result.recordset.length === 0) {
      pool.close();
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const usuarioDB = result.recordset[0];

    console.log('Usuario encontrado:', usuarioDB.nombre);
    console.log('Password BD:', usuarioDB.password_hash);
    console.log('Password ingresado:', password);

    // Validar contraseña (texto plano)
    if (usuarioDB.password_hash !== password) {
      console.log('Contraseña incorrecta');
      pool.close();
      return res.status(401).json({
        success: false,
        error: 'Contraseña incorrecta'
      });
    }

    console.log('Contraseña correcta');

    const token = jwt.sign(
      {
        id_usuario: usuarioDB.id_usuario,
        usuario: usuarioDB.correo,
        rol: usuarioDB.rol
      },
      process.env.JWT_SECRET || 'tu_clave_secreta',
      { expiresIn: '8h' }
    );

    pool.close();

    res.json({
      success: true,
      message: 'Login exitoso',
      token: token,
      id_usuario: usuarioDB.id_usuario,
      usuario: usuarioDB.correo,
      rol: usuarioDB.rol
    });

  } catch (error) {
    console.error('Error:', error.message);
    pool.close();
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión'
    });
  }
};