import { pool } from '../db.js';

// Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Categorias');
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de las categorías.',
      error: error
    });
  }
};

// Obtener una categoría por su ID
export const obtenerCategoria = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Categorias WHERE id_categoria = ?', [req.params.id]);
    
    if (result.length <= 0) {
      return res.status(404).json({
        mensaje: `Error al leer los datos. El ID ${req.params.id} de la categoría no fue encontrado.`
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de la categoría.',
      error: error
    });
  }
};

// Buscar categorías por nombre o descripción
export const buscarCategorias = async (req, res) => {
  try {
    const { termino } = req.query;
    const [result] = await pool.query(
      `SELECT * FROM Categorias WHERE nombre_categoria LIKE ? OR descripcion_categoria LIKE ?`,
      [`%${termino}%`, `%${termino}%`]
    );

    if (result.length <= 0) {
      return res.status(404).json({ mensaje: 'No se encontraron resultados para la búsqueda.' });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al realizar la búsqueda.',
      error: error
    });
  }
};

// Registrar una nueva categoría
export const registrarCategoria = async (req, res) => {
  try {
    const { nombre_categoria, descripcion_categoria } = req.body;

    const [result] = await pool.query(
      'INSERT INTO Categorias (nombre_categoria, descripcion_categoria) VALUES (?, ?)',
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

// Actualizar una categoría por ID
export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_categoria, descripcion_categoria } = req.body;

    const [result] = await pool.query(
      `UPDATE Categorias SET 
        nombre_categoria = ?, descripcion_categoria = ? 
      WHERE id_categoria = ?`,
      [nombre_categoria, descripcion_categoria, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `No se encontró la categoría con ID ${id}.` });
    }

    res.json({ mensaje: `Categoría con ID ${id} actualizada correctamente.` });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar la categoría.',
      error: error
    });
  }
};

// Eliminar una categoría por ID
export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Categorias WHERE id_categoria = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `No se encontró la categoría con ID ${id}.` });
    }

    res.json({ mensaje: `Categoría con ID ${id} eliminada correctamente.` });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al eliminar la categoría.',
      error: error
    });
  }
};