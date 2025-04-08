import { Router } from 'express';
import {obtenerCategorias, obtenerCategoria, registrarCategoria } from '../controllers/categorias.controller.js';

const router = Router();

// Ruta para obtener todas las categorías
router.get('/categorias', obtenerCategorias);

router.get('/categoria/:id', obtenerCategoria);

// Ruta para registrar una nueva categoría
router.post('/registrarcategoria', registrarCategoria);



export default router;
