const { sql, connectSQL } = require('../config/sqlConfig');
const UbicacionTiempoReal = require('../models/UbicacionTiempoReal');
exports.obtenerUbicaciones = async (req, res) => {
  try {
    const ubicaciones = await UbicacionTiempoReal.find({ activo: true }).sort({ tipo: 1 });
    res.json({
      success: true,
      total: ubicaciones.length,
      data: ubicaciones
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener ubicaciones'
    });
  }
};
exports.obtenerUbicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const ubicacion = await UbicacionTiempoReal.findOne({ id_ubicacion: id });
    if (!ubicacion) {
      return res.status(404).json({
        success: false,
        error: 'Ubicación no encontrada'
      });
    }
    res.json({
      success: true,
      data: ubicacion
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener ubicación'
    });
  }
};
exports.obtenerPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const ubicaciones = await UbicacionTiempoReal.find({
      estado: estado,
      activo: true
    });
    res.json({
      success: true,
      total: ubicaciones.length,
      estado: estado,
      data: ubicaciones
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener ubicaciones por estado'
    });
  }
};
exports.actualizarCapacidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { capacidad_actual } = req.body;

    if (capacidad_actual === undefined) {
      return res.status(400).json({
        success: false,
        error: 'capacidad_actual es requerida'
      });
    }
    const ubicacion = await UbicacionTiempoReal.findOneAndUpdate(
      { id_ubicacion: id },
      {
        capacidad_actual: capacidad_actual,
        ultima_actualizacion: new Date()
      },
      { new: true }
    );
    if (!ubicacion) {
      return res.status(404).json({
        success: false,
        error: 'Ubicación no encontrada'
      });
    }
    res.json({
      success: true,
      message: 'Capacidad actualizada exitosamente',
      data: ubicacion
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar capacidad'
    });
  }
};
exports.obtenerCerca = async (req, res) => {
  try {
    const { latitud, longitud, distancia = 1000 } = req.query;
    if (!latitud || !longitud) {
      return res.status(400).json({
        success: false,
        error: 'latitud y longitud son requeridas'
      });
    }
    const ubicaciones = await UbicacionTiempoReal.find({
      latitud: { $gte: latitud - 0.01, $lte: latitud + 0.01 },
      longitud: { $gte: longitud - 0.01, $lte: longitud + 0.01 },
      activo: true
    });
    res.json({
      success: true,
      total: ubicaciones.length,
      data: ubicaciones
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener ubicaciones cercanas'
    });
  }
};