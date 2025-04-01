import { Router } from 'express';
import { obtenerVentasConDetalles,  } from '../controllers/ventas.controller.js';

const router = Router();

// Ruta para obtener todos los clientes
router.get('/ventas', obtenerVentasConDetalles);



export default router;