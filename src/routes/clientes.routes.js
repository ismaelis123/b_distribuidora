import { Router } from 'express';
import {  obtenerClientes, registrarCliente  } from '../controllers/clientes.controller.js';

const router = Router();

// Ruta para obtener todos los clientes
router.get('/clientes', obtenerClientes);

router.post('/registrarcliente', registrarCliente);



export default router;