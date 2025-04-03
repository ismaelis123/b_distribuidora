import { pool } from '../db.js';

// Obtener todas las compras con sus detalles
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

    // Si no hay compras, retornar un mensaje indicando que no se encontraron
    if (result.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron compras.' });
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de las compras.',
      error: error.message,
    });
  }
};

// Registrar una nueva compra
export const registrarCompra = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const { id_empleado, productos } = req.body;

    // Validación simple de los datos
    if (!id_empleado || !productos || productos.length === 0) {
      return res.status(400).json({ mensaje: 'Empleado y productos son requeridos.' });
    }

    // Insertar en la tabla Compras
    const [compraResult] = await connection.query(
      'INSERT INTO Compras (id_empleado, fecha_compra) VALUES (?, NOW())',
      [id_empleado]
    );

    const id_compra = compraResult.insertId;

    // Insertar en la tabla Detalles_Compras
    for (const producto of productos) {
      const { id_producto, cantidad, precio_unitario } = producto;

      if (!id_producto || !cantidad || !precio_unitario) {
        return res.status(400).json({ mensaje: 'Producto, cantidad y precio unitario son requeridos.' });
      }

      await connection.query(
        `INSERT INTO Detalles_Compras (id_compra, id_producto, cantidad, precio_unitario) 
         VALUES (?, ?, ?, ?)`,
        [id_compra, id_producto, cantidad, precio_unitario]
      );
    }

    await connection.commit();
    res.status(201).json({ mensaje: 'Compra registrada exitosamente', id_compra });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ mensaje: 'Ha ocurrido un error al registrar la compra.', error: error.message });
  } finally {
    connection.release();
  }
};

// Obtener una compra específica por su ID
export const obtenerCompraPorId = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT 
        c.id_compra,
        c.fecha_compra,
        CONCAT(e.primer_nombre, ' ', e.primer_apellido) AS nombre_empleado,
        dc.id_detalle_compra,
        p.nombre_producto,
        dc.cantidad,
        dc.precio_unitario,
        (dc.cantidad * dc.precio_unitario) AS subtotal
      FROM Compras c
      INNER JOIN Empleados e ON c.id_empleado = e.id_empleado
      INNER JOIN Detalles_Compras dc ON c.id_compra = dc.id_compra
      INNER JOIN Productos p ON dc.id_producto = p.id_producto
      WHERE c.id_compra = ?`,
      [req.params.id]
    );

    // Si no se encuentra la compra, devolver un mensaje de error
    if (result.length === 0) {
      return res.status(404).json({ mensaje: 'Compra no encontrada.' });
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener la compra.', error: error.message });
  }
};
