import { Router } from 'express';
import { obtenerVentasConDetalles, obtenerVentas  } from '../controllers/ventas.controller.js';

const router = Router();

// Ruta para obtener todos los clientes
router.get('/ventas', obtenerVentasConDetalles);
router.get('/obtenerventas', obtenerVentas);



export default router;