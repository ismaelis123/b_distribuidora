import { Router } from 'express';
import { obtenerCategorias, obtenerCategoria, registrarCategoria, actualizarCategoria, eliminarCategoria, buscarCategorias } from '../controllers/categorias.controller.js';

const router = Router();

// Ruta para obtener todas las categorías
router.get('/categorias', obtenerCategorias);

// Ruta para obtener una categoría por ID
router.get('/categorias/:id', obtenerCategoria);

// Ruta para buscar categorías por nombre o descripción
router.get('/buscarcategorias', buscarCategorias);

// Ruta para registrar una nueva categoría
router.post('/registrarcategoria', registrarCategoria);

// Ruta para actualizar una categoría por ID
router.put('/actualizarcategoria/:id', actualizarCategoria);

// Ruta para eliminar una categoría por ID
router.delete('/eliminarcategoria/:id', eliminarCategoria);

export default router;