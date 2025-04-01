import { pool } from '../db.js';

// Obtener todas las categorias
export const obtenerCategorias= async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Categorias');
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de las categorias.',
      error: error
    });
  }
};

// Obtener una categoria por su id
export const obtenerCategoria = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Categorias WHERE id_categoria = ?', [req.params.id]);
    
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
export const registrarCategoria = async (req, res) => {
  try {
    const { nombre_categoria, descripcion_categoria } = req.body;

    const [result] = await pool.query(
      'INSERT INTO categorias (nombre_categoria, descripcion_categoria) VALUES (?, ?)',
      [nombre_categoria, descripcion_categoria]
    );

    res.status(201).json({ id_categoria: result.insertId });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar la categoría.',
      error: error
    });
  }
};