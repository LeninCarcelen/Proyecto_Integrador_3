const express = require('express');
const router = express.Router();

const ubicacionesController = require('../controllers/ubicacionesController');
const alertasController = require('../controllers/alertasController');
const authController = require('../controllers/authController');
const contenedoresController = require('../controllers/contenedoresController');

router.post('/auth/login', authController.login);

router.get('/ubicaciones', ubicacionesController.obtenerUbicaciones);
router.get('/ubicaciones/:id', ubicacionesController.obtenerUbicacion);
router.get('/ubicaciones/estado/:estado', ubicacionesController.obtenerPorEstado);
router.put('/ubicaciones/:id/capacidad', ubicacionesController.actualizarCapacidad);
router.get('/ubicaciones/cerca', ubicacionesController.obtenerCerca);

router.post('/alertas', alertasController.crearAlerta);
router.get('/alertas', alertasController.obtenerAlertas);
router.get('/alertas/:id', alertasController.obtenerAlerta);
router.put('/alertas/:id/estado', alertasController.cambiarEstado);
router.put('/alertas/:id/visualizar', alertasController.incrementarVisualizaciones);

router.post('/contenedores', contenedoresController.crearContenedor);
router.get('/contenedores', contenedoresController.obtenerContenedores);
router.delete('/contenedores/:id', contenedoresController.eliminarContenedor);

const usuariosController = require('../controllers/usuariosController');

router.post('/usuarios', usuariosController.crearUsuario);
router.get('/usuarios', usuariosController.obtenerUsuarios);
router.delete('/usuarios/:id', usuariosController.eliminarUsuario);

module.exports = router;