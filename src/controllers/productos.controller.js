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

// Buscar productos por nombre o descripción
export const buscarProductos = async (req, res) => {
  try {
    const { termino } = req.query;
    const [result] = await pool.query(
      `SELECT * FROM Productos WHERE nombre_producto LIKE ? OR descripcion_producto LIKE ?`,
      [`%${termino}%`, `%${termino}%`]
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

// Registrar un nuevo producto
export const registrarProducto = async (req, res) => {
  try {
    const { 
      nombre_producto, 
      descripcion_producto, 
      id_categoria, 
      precio_unitario, 
      stock, 
      imagen 
    } = req.body;

    // Validación básica de campos requeridos
    if (!nombre_producto || !id_categoria || !precio_unitario || !stock) {
      return res.status(400).json({
        mensaje: 'Faltan campos requeridos: nombre, categoría, precio o stock.'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO Productos (nombre_producto, descripcion_producto, id_categoria, precio_unitario, stock, imagen) VALUES (?, ?, ?, ?, ?, ?)',
      [
        nombre_producto,
        descripcion_producto || null,
        id_categoria,
        precio_unitario,
        stock,
        imagen || null
      ]
    );

    res.status(201).json({ 
      id_producto: result.insertId,
      mensaje: 'Producto registrado exitosamente'
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar el producto.',
      error: error.message
    });
  }
};

// Actualizar producto por ID
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_producto,
      descripcion_producto,
      id_categoria,
      precio_unitario,
      stock,
      imagen
    } = req.body;

    // Validación básica de campos requeridos
    if (!nombre_producto || !id_categoria || !precio_unitario || !stock) {
      return res.status(400).json({
        mensaje: 'Faltan campos requeridos: nombre, categoría, precio o stock.'
      });
    }

    const [result] = await pool.query(
      `UPDATE Productos SET 
        nombre_producto = ?, 
        descripcion_producto = ?, 
        id_categoria = ?, 
        precio_unitario = ?, 
        stock = ?, 
        imagen = ? 
      WHERE id_producto = ?`,
      [
        nombre_producto,
        descripcion_producto || null,
        id_categoria,
        precio_unitario,
        stock,
        imagen || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `No se encontró el producto con ID ${id}.` });
    }

    res.json({ mensaje: `Producto con ID ${id} actualizado correctamente.` });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar el producto.',
      error: error.message
    });
  }
};

// Eliminar producto por ID
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Productos WHERE id_producto = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `No se encontró el producto con ID ${id}.` });
    }

    res.json({ mensaje: `Producto con ID ${id} eliminado correctamente.` });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al eliminar el producto.',
      error: error.message
    });
  }
};