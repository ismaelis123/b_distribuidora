
import { Router } from 'express';
import {
  totalVentasPorDia,
  totalVentasPorMes,
  totalVentasPorAño,
  totalVentasPorEmpleado,
  cantidadVentasPorEmpleado,
  totalVentasPorEmpleadoYMes,
  totalComprasPorCliente,
  cantidadComprasPorCliente,
  totalComprasPorClienteYMes,
  productosMasVendidosPorCantidad,
  productosMasVendidosPorValor,
  ventasProductosPorMes,
  totalVentasPorCategoria,
  totalVentasPorCategoriaYMes,
  productosBajoStock,
  stockPorCategoria,
  ventasPorClienteEmpleadoYMes,
  ventasPorCategoriaEmpleadoYMes,
  ventasPorClienteCategoriaYMes,
  promedioVentasPorEmpleado,
  promedioVentasPorEmpleadoYMes,
  clientesFrecuentes,
  clientesFrecuentesPorMes,
  productosMasCompradosPorCliente,
  categoriasMasCompradasPorCliente,
  totalVentasPorDiaSemana,
  ventasPorCategoriaYDiaSemana,
  productosMayorRotacion,
  categoriasMayorRotacion
} from '../controllers/estadisticas.controller.js';

const router = Router();

// 1. Análisis de Ventas por Tiempo
router.get('/totalventaspordia', totalVentasPorDia);
router.get('/totalventaspormes', totalVentasPorMes);
router.get('/totalventasporaño', totalVentasPorAño);

// 2. Análisis de Ventas por Empleado
router.get('/totalventasporempleado', totalVentasPorEmpleado);
router.get('/cantidadventasporempleado', cantidadVentasPorEmpleado);
router.get('/totalventasporempleadoymes', totalVentasPorEmpleadoYMes);

// 3. Análisis de Ventas por Cliente
router.get('/totalcomprasporcliente', totalComprasPorCliente);
router.get('/cantidadcomprasporcliente', cantidadComprasPorCliente);
router.get('/totalcomprasporclienteymes', totalComprasPorClienteYMes);

// 4. Análisis de Ventas por Producto
router.get('/productosmasvendidosporcantidad', productosMasVendidosPorCantidad);
router.get('/productosmasvendidosporvalor', productosMasVendidosPorValor);
router.get('/ventasproductospormes', ventasProductosPorMes);

// 5. Análisis de Ventas por Categoría
router.get('/totalventasporcategoria', totalVentasPorCategoria);
router.get('/totalventasporcategoriaymes', totalVentasPorCategoriaYMes);

// 10. Análisis de Stock
router.get('/productosbajostock', productosBajoStock);
router.get('/stockporcategoria', stockPorCategoria);

// 11. Análisis Combinado de Ventas
router.get('/ventasporclienteyempleadoyes', ventasPorClienteEmpleadoYMes);
router.get('/ventasporcategoriaempleadoyes', ventasPorCategoriaEmpleadoYMes);
router.get('/ventasporclientecategoriaymes', ventasPorClienteCategoriaYMes);

// 13. Análisis de Eficiencia de Empleados
router.get('/promedioventaspor empleado', promedioVentasPorEmpleado);
router.get('/promedioventasporempleadoyes', promedioVentasPorEmpleadoYMes);

// 14. Análisis de Clientes Frecuentes
router.get('/clientesfrecuentes', clientesFrecuentes);
router.get('/clientesfrecuentespormes', clientesFrecuentesPorMes);

// 15. Análisis de Productos por Cliente
router.get('/productosmascompradosporcliente', productosMasCompradosPorCliente);
router.get('/categoriasmascompradasporcliente', categoriasMasCompradasPorCliente);

// 16. Análisis de Ventas por Día de la Semana
router.get('/totalventaspordiasemana', totalVentasPorDiaSemana);
router.get('/ventasporcategoriaydiasemana', ventasPorCategoriaYDiaSemana);

// 17. Análisis de Rotación de Inventario
router.get('/productosmayorrotacion', productosMayorRotacion);
router.get('/categoriasmayorrotacion', categoriasMayorRotacion);

export default router;