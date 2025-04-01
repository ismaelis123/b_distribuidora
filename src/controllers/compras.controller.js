import { pool } from '../db.js';

// Obtener todas las compras con sus detalles, mostrando nombres, IDs y subtotal
export const obtenerComprasConDetalles = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT 
        c.id_compra,
        dc.id_detalle_compra,
        c.fecha_compra,
        CONCAT(e.primer_nombre, ' ', e.primer_apellido) AS nombre_empleado,
        p.nombre_producto,
        dc.cantidad,
        dc.precio_unitario,
        (dc.cantidad * dc.precio_unitario) AS subtotal
      FROM Compras c
      INNER JOIN Empleados e ON c.id_empleado = e.id_empleado
      INNER JOIN Detalles_Compras dc ON c.id_compra = dc.id_compra
      INNER JOIN Productos p ON dc.id_producto = p.id_producto
    `);
    
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de las compras.',
      error: error
    });
  }
};