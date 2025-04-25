import { Router } from 'express';
import { obtenerUsuarios, obtenerUsuario, registrarUsuario, eliminarUsuario, actualizarUsuario, buscarUsuarios } from '../controllers/usuarios.controller.js';

const router = Router();

// Ruta para obtener todos los usuarios
router.get('/usuarios', obtenerUsuarios);

// Ruta para obtener un usuario por su ID
router.get('/usuarios/:id', obtenerUsuario);

// Ruta para buscar usuarios
router.get('/buscarusuarios', buscarUsuarios);

// Ruta para registrar un nuevo usuario
router.post('/registrarusuario', registrarUsuario);

// Ruta para actualizar un usuario por su ID
router.put('/actualizarusuario/:id', actualizarUsuario);

// Ruta para eliminar un usuario por su ID
router.delete('/eliminarusuario/:id', eliminarUsuario);

export default router;