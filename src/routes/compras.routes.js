import { Router } from 'express';
import { obtenerComprasConDetalles, obtenerCompras, eliminarCompra, registrarCompra, actualizarCompra } from '../controllers/compras.controller.js';

const router = Router();

// Ruta para obtener todas las compras con detalles
router.get('/compras', obtenerComprasConDetalles);

// Ruta para obtener todas las compras
router.get('/obtenercompras', obtenerCompras);

// Ruta para eliminar una compra
router.delete('/eliminarcompra/:id_compra', eliminarCompra);

// Ruta para registrar una nueva compra
router.post('/registrarcompra', registrarCompra);

// Ruta para actualizar una compra
router.patch('/actualizarcompra/:id_compra', actualizarCompra);

export default router;