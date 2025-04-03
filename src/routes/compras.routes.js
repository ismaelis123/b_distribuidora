import { Router } from 'express';
import { obtenerComprasConDetalles, registrarCompra,  } from '../controllers/compras.controller.js';

const router = Router();

// Ruta para obtener todas las compras con detalles
router.get('/compras', obtenerComprasConDetalles);

// Ruta para registrar una nueva compra
router.post('/registrarcompra', registrarCompra);



export default router;
