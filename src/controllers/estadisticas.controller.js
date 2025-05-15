import { pool2 } from '../db.js';

// Obtener el Total de ventas por día
export const totalVentasPorDia = async (req, res) => {
  try {
    const [result] = await pool2.query(
      ` SELECT DATE_FORMAT(t.fecha, '%Y-%m-%d') AS dia, SUM(hv.total_linea) AS total_ventas
        FROM Hecho_Ventas hv
        JOIN Dim_Tiempo t ON hv.fecha = t.fecha
        GROUP BY t.fecha
        ORDER BY t.fecha; `
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadisticas de ventas.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener  las estadisticas de ventas.',
      error: error.message,
    });
  }
};

// 1.2 Total de ventas por mes
export const totalVentasPorMes = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    let query = `
      SELECT t.mes, ROUND(SUM(hv.total_linea), 1) AS total_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
    `;
    const queryParams = [];

    if (startYear && endYear) {
      query += ` WHERE t.año BETWEEN ? AND ?`;
      queryParams.push(startYear, endYear);
    }

    query += ` GROUP BY t.mes ORDER BY t.mes`;

    const [result] = await pool2.query(query, queryParams);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas por mes.' : 'Estadísticas de ventas por mes obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas por mes.',
    });
  }
};

// 1.3 Total de ventas por año
export const totalVentasPorAño = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT t.año, ROUND(SUM(hv.total_linea), 2) AS total_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
      GROUP BY t.año
      ORDER BY t.año
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas por año.' : 'Estadísticas de ventas por año obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching yearly sales:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas por año.',
    });
  }
};

// 2.1 Total de ventas por empleado
export const totalVentasPorEmpleado = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT e.primer_nombre, e.segundo_nombre, e.primer_apellido, ROUND(SUM(hv.total_linea), 2) AS total_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
      GROUP BY e.id_empleado, e.primer_nombre, e.segundo_nombre, e.primer_apellido
      ORDER BY total_ventas DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas por empleado.' : 'Estadísticas de ventas por empleado obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching sales by employee:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas por empleado.',
    });
  }
};

// 2.2 Cantidad de ventas por empleado
export const cantidadVentasPorEmpleado = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT e.primer_nombre, e.segundo_nombre, e.primer_apellido, COUNT(DISTINCT hv.id_venta) AS cantidad_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
      GROUP BY e.id_empleado, e.primer_nombre, e.segundo_nombre, e.primer_apellido
      ORDER BY cantidad_ventas DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de cantidad de ventas por empleado.' : 'Estadísticas de cantidad de ventas por empleado obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching sale count by employee:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de cantidad de ventas por empleado.',
    });
  }
};

// 2.3 Total de ventas por empleado y mes
export const totalVentasPorEmpleadoYMes = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    let query = `
      SELECT e.primer_nombre, e.segundo_nombre, e.primer_apellido, t.año, t.mes, SUM(hv.total_linea) AS total_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
    `;
    const queryParams = [];

    if (startYear && endYear) {
      query += ` WHERE t.año BETWEEN ? AND ?`;
      queryParams.push(startYear, endYear);
    }

    query += ` GROUP BY e.id_empleado, e.primer_nombre, e.segundo_nombre, e.primer_apellido, t.año, t.mes
               ORDER BY t.año, t.mes, total_ventas DESC`;

    const [result] = await pool2.query(query, queryParams);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas por empleado y mes.' : 'Estadísticas de ventas por empleado y mes obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching sales by employee and month:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas por empleado y mes.',
    });
  }
};

// 3.1 Total de compras por cliente
export const totalComprasPorCliente = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido, ROUND(SUM(hv.total_linea), 2) AS total_compras
      FROM Hecho_Ventas hv
      JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
      GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido
      ORDER BY total_compras DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de compras por cliente.' : 'Estadísticas de compras por cliente obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching purchases by client:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de compras por cliente.',
    });
  }
};

// 3.2 Cantidad de compras por cliente
export const cantidadComprasPorCliente = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido, COUNT(DISTINCT hv.id_venta) AS cantidad_compras
      FROM Hecho_Ventas hv
      JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
      GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido
      ORDER BY cantidad_compras DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de cantidad de compras por cliente.' : 'Estadísticas de cantidad de compras por cliente obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching purchase count by client:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de cantidad de compras por cliente.',
    });
  }
};

// 3.3 Total de compras por cliente y mes
export const totalComprasPorClienteYMes = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    let query = `
      SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido, t.año, t.mes, SUM(hv.total_linea) AS total_compras
      FROM Hecho_Ventas hv
      JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
    `;
    const queryParams = [];

    if (startYear && endYear) {
      query += ` WHERE t.año BETWEEN ? AND ?`;
      queryParams.push(startYear, endYear);
    }

    query += ` GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido, t.año, t.mes
               ORDER BY t.año, t.mes, total_compras DESC`;

    const [result] = await pool2.query(query, queryParams);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de compras por cliente y mes.' : 'Estadísticas de compras por cliente y mes obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching purchases by client and month:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de compras por cliente y mes.',
    });
  }
};

// 4.1 Productos más vendidos por cantidad
export const productosMasVendidosPorCantidad = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT p.nombre_producto, SUM(hv.cantidad) AS cantidad_vendida
      FROM Hecho_Ventas hv
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      GROUP BY p.id_producto, p.nombre_producto
      ORDER BY cantidad_vendida DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de productos más vendidos por cantidad.' : 'Estadísticas de productos más vendidos por cantidad obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching top products by quantity:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de productos más vendidos por cantidad.',
    });
  }
};

// 4.2 Productos más vendidos por valor total
export const productosMasVendidosPorValor = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT p.nombre_producto, SUM(hv.total_linea) AS total_ventas, SUM(hv.cantidad) AS cantidad_vendida
      FROM Hecho_Ventas hv
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      GROUP BY p.id_producto, p.nombre_producto
      ORDER BY total_ventas DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de productos más vendidos por valor.' : 'Estadísticas de productos más vendidos por valor obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching top products by value:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de productos más vendidos por valor.',
    });
  }
};

// 4.3 Ventas de productos por mes
export const ventasProductosPorMes = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    let query = `
      SELECT p.nombre_producto, t.año, t.mes, SUM(hv.cantidad) AS cantidad_vendida, SUM(hv.total_linea) AS total_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
    `;
    const queryParams = [];

    if (startYear && endYear) {
      query += ` WHERE t.año BETWEEN ? AND ?`;
      queryParams.push(startYear, endYear);
    }

    query += ` GROUP BY p.id_producto, p.nombre_producto, t.año, t.mes
               ORDER BY t.año, t.mes, total_ventas DESC`;

    const [result] = await pool2.query(query, queryParams);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas de productos por mes.' : 'Estadísticas de ventas de productos por mes obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching product sales by month:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas de productos por mes.',
    });
  }
};

// 5.1 Total de ventas por categoría
export const totalVentasPorCategoria = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT p.nombre_categoria, SUM(hv.total_linea) AS total_ventas, SUM(hv.cantidad) AS cantidad_vendida
      FROM Hecho_Ventas hv
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      GROUP BY p.nombre_categoria
      ORDER BY total_ventas DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas por categoría.' : 'Estadísticas de ventas por categoría obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching sales by category:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas por categoría.',
    });
  }
};

// 5.2 Total de ventas por categoría y mes
export const totalVentasPorCategoriaYMes = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    let query = `
      SELECT p.nombre_categoria, t.año, t.mes, SUM(hv.total_linea) AS total_ventas, SUM(hv.cantidad) AS cantidad_vendida
      FROM Hecho_Ventas hv
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
    `;
    const queryParams = [];

    if (startYear && endYear) {
      query += ` WHERE t.año BETWEEN ? AND ?`;
      queryParams.push(startYear, endYear);
    }

    query += ` GROUP BY p.nombre_categoria, t.año, t.mes
               ORDER BY t.año, t.mes, total_ventas DESC`;

    const [result] = await pool2.query(query, queryParams);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas por categoría y mes.' : 'Estadísticas de ventas por categoría y mes obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching sales by category and month:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas por categoría y mes.',
    });
  }
};

// 10.1 Productos con bajo stock
export const productosBajoStock = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT p.nombre_producto, p.stock
      FROM Dim_Productos p
      WHERE p.stock < 50
      ORDER BY p.stock ASC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron productos con bajo stock.' : 'Productos con bajo stock obtenidos correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({
      mensaje: 'Error al obtener los productos con bajo stock.',
    });
  }
};

// 10.2 Stock por categoría
export const stockPorCategoria = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT p.nombre_categoria, SUM(p.stock) AS stock_total
      FROM Dim_Productos p
      GROUP BY p.nombre_categoria
      ORDER BY stock_total DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de stock por categoría.' : 'Estadísticas de stock por categoría obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching stock by category:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de stock por categoría.',
    });
  }
};

// 11.1 Ventas por cliente, empleado y mes
export const ventasPorClienteEmpleadoYMes = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    let query = `
      SELECT c.primer_nombre AS cliente_nombre, c.primer_apellido AS cliente_apellido,
             e.primer_nombre AS empleado_nombre, e.primer_apellido AS empleado_apellido,
             t.año, t.mes, SUM(hv.total_linea) AS total_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
      JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
    `;
    const queryParams = [];

    if (startYear && endYear) {
      query += ` WHERE t.año BETWEEN ? AND ?`;
      queryParams.push(startYear, endYear);
    }

    query += ` GROUP BY c.id_cliente, c.primer_nombre, c.primer_apellido,
                        e.id_empleado, e.primer_nombre, e.primer_apellido,
                        t.año, t.mes
               ORDER BY t.año, t.mes, total_ventas DESC`;

    const [result] = await pool2.query(query, queryParams);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas por cliente, empleado y mes.' : 'Estadísticas de ventas por cliente, empleado y mes obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching sales by client, employee, and month:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas por cliente, empleado y mes.',
    });
  }
};

// 11.2 Ventas por categoría, empleado y mes
export const ventasPorCategoriaEmpleadoYMes = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    let query = `
      SELECT p.nombre_categoria, e.primer_nombre AS empleado_nombre, e.primer_apellido AS empleado_apellido,
             t.año, t.mes, SUM(hv.total_linea) AS total_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
    `;
    const queryParams = [];

    if (startYear && endYear) {
      query += ` WHERE t.año BETWEEN ? AND ?`;
      queryParams.push(startYear, endYear);
    }

    query += ` GROUP BY p.nombre_categoria, e.id_empleado, e.primer_nombre, e.primer_apellido,
                        t.año, t.mes
               ORDER BY t.año, t.mes, total_ventas DESC`;

    const [result] = await pool2.query(query, queryParams);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas por categoría, empleado y mes.' : 'Estadísticas de ventas por categoría, empleado y mes obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching sales by category, employee, and month:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas por categoría, empleado y mes.',
    });
  }
};

// 11.3 Ventas por cliente, categoría y mes
export const ventasPorClienteCategoriaYMes = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    let query = `
      SELECT c.primer_nombre AS cliente_nombre, c.primer_apellido AS cliente_apellido,
             p.nombre_categoria, t.año, t.mes, SUM(hv.total_linea) AS total_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
    `;
    const queryParams = [];

    if (startYear && endYear) {
      query += ` WHERE t.año BETWEEN ? AND ?`;
      queryParams.push(startYear, endYear);
    }

    query += ` GROUP BY c.id_cliente, c.primer_nombre, c.primer_apellido,
                        p.nombre_categoria, t.año, t.mes
               ORDER BY t.año, t.mes, total_ventas DESC`;

    const [result] = await pool2.query(query, queryParams);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas por cliente, categoría y mes.' : 'Estadísticas de ventas por cliente, categoría y mes obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching sales by client, category, and month:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas por cliente, categoría y mes.',
    });
  }
};

// 13.1 Promedio de ventas por empleado
export const promedioVentasPorEmpleado = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT e.primer_nombre, e.segundo_nombre, e.primer_apellido,
             AVG(hv.total_linea) AS promedio_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
      GROUP BY e.id_empleado, e.primer_nombre, e.segundo_nombre, e.primer_apellido
      ORDER BY promedio_ventas DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de promedio de ventas por empleado.' : 'Estadísticas de promedio de ventas por empleado obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching average sales by employee:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de promedio de ventas por empleado.',
    });
  }
};

// 13.2 Promedio de ventas por empleado y mes
export const promedioVentasPorEmpleadoYMes = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    let query = `
      SELECT e.primer_nombre, e.segundo_nombre, e.primer_apellido,
             t.año, t.mes, AVG(hv.total_linea) AS promedio_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
    `;
    const queryParams = [];

    if (startYear && endYear) {
      query += ` WHERE t.año BETWEEN ? AND ?`;
      queryParams.push(startYear, endYear);
    }

    query += ` GROUP BY e.id_empleado, e.primer_nombre, e.segundo_nombre, e.primer_apellido,
                        t.año, t.mes
               ORDER BY t.año, t.mes, promedio_ventas DESC`;

    const [result] = await pool2.query(query, queryParams);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de promedio de ventas por empleado y mes.' : 'Estadísticas de promedio de ventas por empleado y mes obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching average sales by employee and month:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de promedio de ventas por empleado y mes.',
    });
  }
};

// 14.1 Clientes que compran más frecuentemente
export const clientesFrecuentes = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido,
             COUNT(DISTINCT hv.id_venta) AS cantidad_compras,
             SUM(hv.total_linea) AS total_compras
      FROM Hecho_Ventas hv
      JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
      GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido
      HAVING COUNT(DISTINCT hv.id_venta) > 1
      ORDER BY cantidad_compras DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron clientes frecuentes.' : 'Estadísticas de clientes frecuentes obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching frequent clients:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de clientes frecuentes.',
    });
  }
};

// 14.2 Clientes frecuentes por mes
export const clientesFrecuentesPorMes = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    let query = `
      SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido,
             t.año, t.mes, COUNT(DISTINCT hv.id_venta) AS cantidad_compras
      FROM Hecho_Ventas hv
      JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
    `;
    const queryParams = [];

    if (startYear && endYear) {
      query += ` WHERE t.año BETWEEN ? AND ?`;
      queryParams.push(startYear, endYear);
    }

    query += ` GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido,
                        t.año, t.mes
               HAVING COUNT(DISTINCT hv.id_venta) > 1
               ORDER BY t.año, t.mes, cantidad_compras DESC`;

    const [result] = await pool2.query(query, queryParams);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron clientes frecuentes por mes.' : 'Estadísticas de clientes frecuentes por mes obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching frequent clients by month:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de clientes frecuentes por mes.',
    });
  }
};

// 15.1 Productos más comprados por cliente
export const productosMasCompradosPorCliente = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido,
             p.nombre_producto, SUM(hv.cantidad) AS cantidad_comprada,
             SUM(hv.total_linea) AS total_gastado
      FROM Hecho_Ventas hv
      JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido,
               p.id_producto, p.nombre_producto
      ORDER BY total_gastado DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de productos comprados por cliente.' : 'Estadísticas de productos comprados por cliente obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching products purchased by client:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de productos comprados por cliente.',
    });
  }
};

// 15.2 Categorías más compradas por cliente
export const categoriasMasCompradasPorCliente = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido,
             p.nombre_categoria, SUM(hv.cantidad) AS cantidad_comprada,
             SUM(hv.total_linea) AS total_gastado
      FROM Hecho_Ventas hv
      JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido,
               p.nombre_categoria
      ORDER BY total_gastado DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de categorías compradas por cliente.' : 'Estadísticas de categorías compradas por cliente obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching categories purchased by client:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de categorías compradas por cliente.',
    });
  }
};

// 16.1 Total de ventas por día de la semana
export const totalVentasPorDiaSemana = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT t.dia_semana, SUM(hv.total_linea) AS total_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
      GROUP BY t.dia_semana
      ORDER BY total_ventas DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas por día de la semana.' : 'Estadísticas de ventas por día de la semana obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching sales by day of week:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas por día de la semana.',
    });
  }
};

// 16.2 Ventas por categoría y día de la semana
export const ventasPorCategoriaYDiaSemana = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT p.nombre_categoria, t.dia_semana, SUM(hv.total_linea) AS total_ventas
      FROM Hecho_Ventas hv
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      JOIN Dim_Tiempo t ON hv.fecha = t.fecha
      GROUP BY p.nombre_categoria, t.dia_semana
      ORDER BY total_ventas DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de ventas por categoría y día de la semana.' : 'Estadísticas de ventas por categoría y día de la semana obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching sales by category and day of week:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de ventas por categoría y día de la semana.',
    });
  }
};

// 17.1 Productos con mayor rotación
export const productosMayorRotacion = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT p.nombre_producto, p.stock AS stock_inicial,
             SUM(hv.cantidad) AS total_vendido,
             (SUM(hv.cantidad) / p.stock) AS tasa_rotacion
      FROM Hecho_Ventas hv
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      WHERE p.stock > 0
      GROUP BY p.id_producto, p.nombre_producto, p.stock
      ORDER BY tasa_rotacion DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de rotación de productos.' : 'Estadísticas de rotación de productos obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching product rotation:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de rotación de productos.',
    });
  }
};

// 17.2 Categorías con mayor rotación
export const categoriasMayorRotacion = async (req, res) => {
  try {
    const [result] = await pool2.query(`
      SELECT p.nombre_categoria,
             SUM(p.stock) AS stock_total,
             SUM(hv.cantidad) AS total_vendido,
             (SUM(hv.cantidad) / SUM(p.stock)) AS tasa_rotacion
      FROM Hecho_Ventas hv
      JOIN Dim_Productos p ON hv.id_producto = p.id_producto
      GROUP BY p.nombre_categoria
      HAVING SUM(p.stock) > 0
      ORDER BY tasa_rotacion DESC
    `);

    res.status(200).json({
      mensaje: result.length === 0 ? 'No se encontraron estadísticas de rotación de categorías.' : 'Estadísticas de rotación de categorías obtenidas correctamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching category rotation:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas de rotación de categorías.',
    });
  }
};
