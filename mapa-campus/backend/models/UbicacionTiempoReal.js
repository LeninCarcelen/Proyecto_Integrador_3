const mongoose = require('mongoose');
const ubicacionSchema = new mongoose.Schema(
  {
    id_ubicacion: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    nombre: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
      index: true
    },
    tipo: {
      type: String,
      enum: ['contenedor_basura', 'contenedor_reciclaje', 'facultad', 'baño', 'oficina'],
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
    capacidad_total: {
      type: Number,
      required: true,
      min: 0
    },
    capacidad_actual: {
      type: Number,
      required: true,
      min: 0
    },
    estado: {
      type: String,
      enum: ['disponible', 'casi_lleno', 'lleno', 'mantenimiento'],
      default: 'disponible',
      index: true
    },
    temperatura: {
      type: Number,
      min: -50,
      max: 50
    },
    ultima_actualizacion: {
      type: Date,
      default: Date.now,
      index: true
    },
    actualizado_por: {
      type: Number
    },
    notas: {
      type: String,
      maxlength: 500
    },
    activo: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    collection: 'ubicaciones_tiempo_real',
    timestamps: true
  }
);
ubicacionSchema.pre('save', function(next) {
  this.ultima_actualizacion = Date.now();
  next();
});
module.exports = mongoose.model('UbicacionTiempoReal', ubicacionSchema);