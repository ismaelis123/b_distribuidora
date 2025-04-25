import { Router } from 'express';
import { obtenerProductos, obtenerProducto, registrarProducto, buscarProductos, actualizarProducto, eliminarProducto } from '../controllers/productos.controller.js';

const router = Router();

// Ruta para obtener todos los productos
router.get('/productos', obtenerProductos);

// Ruta para obtener un producto por su ID
router.get('/producto/:id', obtenerProducto);

// Ruta para buscar productos
router.get('/buscarproductos', buscarProductos);

// Ruta para registrar un nuevo producto
router.post('/registrarproductos', registrarProducto);

// Ruta para actualizar un producto por ID
router.put('/actualizarproducto/:id', actualizarProducto);

// Ruta para eliminar un producto por ID
router.delete('/eliminarproducto/:id', eliminarProducto);

export default router;