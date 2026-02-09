const mongoose = require('mongoose');
const alertaActivaSchema = new mongoose.Schema(
  {
    id_alerta: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    id_usuario: {
      type: Number,
      required: true,
      index: true
    },
    latitud: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitud: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    },
    tipo_alerta: {
      type: String,
      required: true,
      index: true
    },
    estado: {
      type: String,
      enum: ['pendiente', 'en_proceso', 'resuelta'],
      default: 'pendiente',
      index: true
    },
    urgencia: {
      type: String,
      enum: ['baja', 'media', 'alta', 'crítica'],
      default: 'media',
      index: true
    },
    usuario_reporte: {
      id: Number,
      nombre: String,
      rol: String
    },
    descripcion: {
      type: String,
      default: ''
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
      index: true
    },
    fecha_actualizacion: Date,
    visualizaciones: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    collection: 'alertaactivas',
    timestamps: true
  }
);
module.exports = mongoose.model('AlertaActiva', alertaActivaSchema);