import { pool } from '../db.js';

// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Clientes');
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de los clientes.',
      error: error
    });
  }
};

// Obtener un cliente por ID
export const obtenerCliente = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Clientes WHERE id_cliente = ?', [req.params.id]);
    
    if (result.length <= 0) {
      return res.status(404).json({
        mensaje: `Error al leer los datos. El ID ${req.params.id} no fue encontrado.`
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del cliente.'
    });
  }
};

// Buscar clientes por nombre, apellido o cédula
export const buscarClientes = async (req, res) => {
  try {
    const { termino } = req.query;
    const [result] = await pool.query(
      `SELECT * FROM Clientes WHERE primer_nombre LIKE ? OR primer_apellido LIKE ? OR cedula LIKE ?`,
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

// Registrar un nuevo cliente
export const registrarCliente = async (req, res) => {
  try {
    const {
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      celular,
      direccion,
      cedula
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO Clientes 
      (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, direccion, cedula) 
      VALUES (?, ?, ?, ?, ?, ?, ?)` ,
      [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, direccion, cedula]
    );

    res.status(201).json({ id_cliente: result.insertId });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar el cliente.',
      error: error
    });
  }
};

// Actualizar cliente por ID
export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      celular,
      direccion,
      cedula
    } = req.body;

    const [result] = await pool.query(
      `UPDATE Clientes SET 
        primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, 
        celular = ?, direccion = ?, cedula = ? 
      WHERE id_cliente = ?`,
      [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, direccion, cedula, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `No se encontró el cliente con ID ${id}.` });
    }

    res.json({ mensaje: `Cliente con ID ${id} actualizado correctamente.` });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar el cliente.',
      error: error
    });
  }
};

// Eliminar cliente por ID
export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Clientes WHERE id_cliente = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `No se encontró el cliente con ID ${id}.` });
    }

    res.json({ mensaje: `Cliente con ID ${id} eliminado correctamente.` });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al eliminar el cliente.',
      error
    });
  }
};
