import { Router } from 'express';
import { obtenerComprasConDetalles } from '../controllers/compras.controller.js';

const router = Router();

// Ruta para obtener todas las compras con detalles
router.get('/compras', obtenerComprasConDetalles);

export default router;