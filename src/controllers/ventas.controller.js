import { pool } from '../db.js';

// Obtener todas las ventas con sus detalles, mostrando nombres, IDs y subtotal
export const obtenerVentasConDetalles = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT 
        v.id_venta,
        dv.id_detalle_venta,
        v.fecha_venta,
        CONCAT(c.primer_nombre, ' ', c.primer_apellido) AS nombre_cliente,
        CONCAT(e.primer_nombre, ' ', e.primer_apellido) AS nombre_empleado,
        p.nombre_producto,
        dv.cantidad,
        dv.precio_unitario,
        (dv.cantidad * dv.precio_unitario) AS subtotal
      FROM Ventas v
      INNER JOIN Clientes c ON v.id_cliente = c.id_cliente
      INNER JOIN Empleados e ON v.id_empleado = e.id_empleado
      INNER JOIN Detalles_Ventas dv ON v.id_venta = dv.id_venta
      INNER JOIN Productos p ON dv.id_producto = p.id_producto
    `);
    
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de las ventas.',
      error: error
    });
  }
};