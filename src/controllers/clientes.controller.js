import { pool } from '../db.js';

// Obtener todos los clientes
export const obtenerClientes= async (req, res) => {
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

export const obtenerCliente = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Clientes WHERE id_categoria = ?', [req.params.id]);
    
    if (result.length <= 0) {
      return res.status(404).json({
        mensaje: `Error al leer los datos. El ID ${req.params.id} de la categoria no encontrado.`
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del cliente.'
    });
  }
};// Registrar una nueva categoría

export const registrarCliente = async (req, res) => {
  try {
    // Extrae todos los campos del cuerpo de la solicitud
    const {
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      celular,
      direccion,
      cedula
    } = req.body;

    // Ejecutar la consulta para insertar los datos del cliente
    const [result] = await pool.query(
      `INSERT INTO Clientes 
      (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, direccion, cedula) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, direccion, cedula]
    );

    // Responder con el id del cliente insertado
    res.status(201).json({ id_cliente: result.insertId });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar el cliente.',
      error: error
    });
  }
};