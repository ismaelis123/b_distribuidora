import { pool } from '../db.js';

// Obtener todos los empleados
export const obtenerEmpleados = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Empleados');
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de los empleados.',
      error: error
    });
  }
};

// Obtener un empleado por su ID
export const obtenerEmpleado = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Empleados WHERE id_empleado = ?', [req.params.id]);
    
    if (result.length <= 0) {
      return res.status(404).json({
        mensaje: `Error al leer los datos. El ID ${req.params.id} del empleado no fue encontrado.`
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del empleado.'
    });
  }
};

// Buscar empleados por nombre, apellido o celular
export const buscarEmpleados = async (req, res) => {
  try {
    const { termino } = req.query;
    const [result] = await pool.query(
      `SELECT * FROM Empleados WHERE primer_nombre LIKE ? OR primer_apellido LIKE ? OR celular LIKE ?`,
      [`%${termino}%`, `%${termino}%`, `%${termino}%`]
    );

    if (result.length <= 0) {
      return res.status(404).json({ mensaje: 'No se encontraron resultados para la búsqueda.' });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al realizar la búsqueda.',
      error
    });
  }
};

// Registrar un nuevo empleado
export const registrarEmpleado = async (req, res) => {
  try {
    const { 
      primer_nombre, 
      segundo_nombre, 
      primer_apellido, 
      segundo_apellido, 
      celular, 
      cargo, 
      fecha_contratacion 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO Empleados 
      (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, cargo, fecha_contratacion) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, cargo, fecha_contratacion]
    );

    res.status(201).json({ id_empleado: result.insertId });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar el empleado.',
      error: error
    });
  }
};

// Actualizar empleado por ID
export const actualizarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      celular,
      cargo,
      fecha_contratacion
    } = req.body;

    const [result] = await pool.query(
      `UPDATE Empleados SET 
        primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, 
        celular = ?, cargo = ?, fecha_contratacion = ? 
      WHERE id_empleado = ?`,
      [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, cargo, fecha_contratacion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `No se encontró el empleado con ID ${id}.` });
    }

    res.json({ mensaje: `Empleado con ID ${id} actualizado correctamente.` });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar el empleado.',
      error: error
    });
  }
};

// Eliminar empleado por ID
export const eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Empleados WHERE id_empleado = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `No se encontró el empleado con ID ${id}.` });
    }

    res.json({ mensaje: `Empleado con ID ${id} eliminado correctamente.` });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al eliminar el empleado.',
      error
    });
  }
};