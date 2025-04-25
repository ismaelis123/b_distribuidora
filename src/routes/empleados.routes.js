import { Router } from 'express';
import { obtenerEmpleados, obtenerEmpleado, registrarEmpleado, buscarEmpleados, actualizarEmpleado, eliminarEmpleado } from '../controllers/empleados.controller.js';

const router = Router();

// Ruta para obtener todos los empleados
router.get('/empleados', obtenerEmpleados);

// Ruta para obtener un empleado por su ID
router.get('/empleado/:id', obtenerEmpleado);

// Ruta para buscar empleados
router.get('/buscarempleados', buscarEmpleados);

// Ruta para registrar un nuevo empleado
router.post('/registrarempleado', registrarEmpleado);

// Ruta para actualizar un empleado por ID
router.put('/actualizarempleado/:id', actualizarEmpleado);

// Ruta para eliminar un empleado por ID
router.delete('/eliminarempleado/:id', eliminarEmpleado);

export default router;