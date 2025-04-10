import { Router } from 'express';
import { obtenerEmpleados, obtenerEmpleado, registrarEmpleado } from '../controllers/empleados.controller.js';

const router = Router();

// Ruta para obtener todos los empleados
router.get('/empleados', obtenerEmpleados);

// Ruta para obtener un empleado por su ID
router.get('/empleado/:id', obtenerEmpleado);

// Ruta para registrar un nuevo empleado
router.post('/registrarempleado', registrarEmpleado);

export default router;