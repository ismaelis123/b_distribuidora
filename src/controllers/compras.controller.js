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


// Obtener todas las compras
export const obtenerCompras = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT 
        c.id_compra,
        c.fecha_compra,
        CONCAT(e.primer_nombre, ' ', e.primer_apellido) AS nombre_empleado,
        c.total_compra
      FROM Compras c
      INNER JOIN Empleados e ON c.id_empleado = e.id_empleado
    `);
    
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de las compras.',
      error: error.message
    });
  }
};

// Eliminar una compra (los detalles se eliminan automáticamente por ON DELETE CASCADE)
export const eliminarCompra = async (req, res) => {
  try {
    const { id_compra } = req.params;

    const [result] = await pool.query('DELETE FROM Compras WHERE id_compra = ?', [id_compra]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Compra no encontrada' });
    }

    res.json({ mensaje: 'Compra y sus detalles eliminados correctamente' });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al eliminar la compra',
      error: error.message
    });
  }
};

// Registrar una nueva compra con detalles
export const registrarCompra = async (req, res) => {
  const { id_empleado, fecha_compra, total_compra, detalles } = req.body;

  try {
    const fechaCompraFormateada = new Date(fecha_compra).toISOString().slice(0, 19).replace('T', ' '); // Convierte a 'YYYY-MM-DD HH:mm:ss'
    const [compraResult] = await pool.query(
      'INSERT INTO Compras (id_empleado, fecha_compra, total_compra) VALUES (?, ?, ?)',
      [id_empleado, fechaCompraFormateada, total_compra]
    );

    const id_compra = compraResult.insertId;

    for (const detalle of detalles) {
      await pool.query(
        'INSERT INTO Detalles_Compras (id_compra, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [id_compra, detalle.id_producto, detalle.cantidad, detalle.precio_unitario]
      );
      await pool.query(
        'UPDATE Productos SET stock = stock + ? WHERE id_producto = ?',
        [detalle.cantidad, detalle.id_producto]
      );
    }

    res.json({ mensaje: 'Compra registrada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar la compra', error: error.message });
  }
};

// Actualizar una compra con sus detalles
export const actualizarCompra = async (req, res) => {
  const { id_compra } = req.params;
  const { id_empleado, fecha_compra, total_compra, detalles } = req.body;

  try {
    // Formatear la fecha al formato MySQL
    const fechaCompraFormateada = new Date(fecha_compra).toISOString().slice(0, 19).replace('T', ' ');

    // Actualizar la compra
    const [compraResult] = await pool.query(
      'UPDATE Compras SET id_empleado = ?, fecha_compra = ?, total_compra = ? WHERE id_compra = ?',
      [id_empleado, fechaCompraFormateada, total_compra, id_compra]
    );

    if (compraResult.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Compra no encontrada' });
    }

    // Obtener detalles actuales para restaurar stock
    const [detallesActuales] = await pool.query(
      'SELECT id_producto, cantidad FROM Detalles_Compras WHERE id_compra = ?',
      [id_compra]
    );

    // Restaurar stock de productos anteriores (restar porque se elimina la compra previa)
    for (const detalle of detallesActuales) {
      await pool.query(
        'UPDATE Productos SET stock = stock - ? WHERE id_producto = ?',
        [detalle.cantidad, detalle.id_producto]
      );
    }

    // Eliminar detalles actuales
    await pool.query('DELETE FROM Detalles_Compras WHERE id_compra = ?', [id_compra]);

    // Insertar nuevos detalles y actualizar stock
    for (const detalle of detalles) {
      await pool.query(
        'INSERT INTO Detalles_Compras (id_compra, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [id_compra, detalle.id_producto, detalle.cantidad, detalle.precio_unitario]
      );
      await pool.query(
        'UPDATE Productos SET stock = stock + ? WHERE id_producto = ?',
        [detalle.cantidad, detalle.id_producto]
      );
    }

    res.json({ mensaje: 'Compra actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la compra', error: error.message });
  }
};