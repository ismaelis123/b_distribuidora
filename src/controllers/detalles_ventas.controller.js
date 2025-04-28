import { pool } from '../db.js';

// Controlador para obtener los detalles de una venta por id_venta
export const obtenerDetallesVenta = async (req, res) => {
  const { id } = req.params; // Obtiene el id de los parámetros de la URL
  try {
    const [result] = await pool.query(
      `
      SELECT 
        dv.id_detalle_venta,
        dv.id_venta,
        dv.id_producto,
        dv.cantidad,
        dv.precio_unitario,
        p.nombre_producto,
        p.descripcion_producto,
        (dv.cantidad * dv.precio_unitario) AS subtotal
      FROM Detalles_Ventas dv
      INNER JOIN Productos p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
    `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron detalles para esta venta.',
      });
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener los detalles de la venta.',
      error: error.message,
    });
  }
};
