import { Router } from 'express';
import {  obtenerDetallesVenta } from '../controllers/detalles_ventas.controller.js';

const router = Router();

// Ruta para obtener los detalles de una venta
router.get('/obtenerdetallesventa/:id', obtenerDetallesVenta);


export default router;
