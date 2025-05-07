import { pool } from '../db.js';

// Controlador para obtener los detalles de una compra por id_compra
export const obtenerDetallesCompra = async (req, res) => {
  const { id } = req.params; // Obtiene el id de los parámetros de la URL
  try {
    const [result] = await pool.query(
      `
      SELECT 
        dc.id_detalle_compra,
        dc.id_compra,
        dc.id_producto,
        dc.cantidad,
        dc.precio_unitario,
        p.nombre_producto,
        p.descripcion_producto,
        (dc.cantidad * dc.precio_unitario) AS subtotal
      FROM Detalles_Compras dc
      INNER JOIN Productos p ON dc.id_producto = p.id_producto
      WHERE dc.id_compra = ?
    `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron detalles para esta compra.',
      });
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener los detalles de la compra.',
      error: error.message,
    });
  }
};