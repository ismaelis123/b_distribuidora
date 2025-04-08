import { Router } from 'express';
import { obtenerClientes, obtenerCliente, registrarCliente, eliminarCliente, actualizarCliente, buscarClientes } from '../controllers/clientes.controller.js';

const router = Router();

router.get('/clientes', obtenerClientes);
router.get('/clientes/:id', obtenerCliente);
router.get('/buscarclientes', buscarClientes); // Nueva ruta para búsqueda
router.post('/registrarcliente', registrarCliente);
router.put('/actualizarcliente/:id', actualizarCliente); // Ruta para actualizar cliente
router.delete('/eliminarcliente/:id', eliminarCliente);

export default router;
