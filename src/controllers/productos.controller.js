import { pool } from '../db.js';

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Productos');
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de los productos.',
      error: error
    });
  }
};

// Obtener un producto por su ID
export const obtenerProducto = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Productos WHERE id_producto = ?', [req.params.id]);
    
    if (result.length <= 0) {
      return res.status(404).json({
        mensaje: `Error al leer los datos. El ID ${req.params.id} del producto no fue encontrado.`
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del producto.'
    });
  }
};