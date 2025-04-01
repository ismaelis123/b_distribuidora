-- Definición de la base de datos
CREATE DATABASE ferreteria_bd;
USE ferreteria_bd;

-- Definición de las tablas

-- Tabla Clientes: almacena información de los clientes
CREATE TABLE Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    primer_nombre VARCHAR(20),
    segundo_nombre VARCHAR(20),
    primer_apellido VARCHAR(20),
    segundo_apellido VARCHAR(20),
    celular VARCHAR(8),
    direccion VARCHAR(150),
    cedula VARCHAR(14)
);

-- Tabla Empleados: almacena información de los empleados
CREATE TABLE Empleados (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    primer_nombre VARCHAR(20),
    segundo_nombre VARCHAR(20),
    primer_apellido VARCHAR(20),
    segundo_apellido VARCHAR(20),
    celular VARCHAR(12),
    cargo VARCHAR(20),
    fecha_contratacion DATE
);

-- Tabla Usuarios: almacena credenciales de acceso
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(20),
    contraseña VARCHAR(20)
);

-- Tabla Categorias: almacena las categorías de los productos
CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(20),
    descripcion_categoria VARCHAR(100)
);

-- Tabla Productos: almacena información de los productos disponibles
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(20),
    descripcion_producto VARCHAR(100),
    id_categoria INT,
    precio_unitario FLOAT,
    stock INT,
    imagen LONGTEXT
);

-- Tabla Compras: registra las compras realizadas por la ferretería
CREATE TABLE Compras (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT,
    fecha_compra DATE,
    total_compra FLOAT
);

-- Tabla Detalles_Compras: detalla los productos adquiridos en cada compra
CREATE TABLE Detalles_Compras (
    id_detalle_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT,
    id_producto INT,
    cantidad INT,
    precio_unitario FLOAT
);

-- Tabla Ventas: registra las ventas realizadas
CREATE TABLE Ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_empleado INT,
    fecha_venta DATETIME,
    total_venta FLOAT
);

-- Tabla Detalles_Ventas: detalla los productos vendidos en cada venta
CREATE TABLE Detalles_Ventas (
    id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad INT,
    precio_unitario FLOAT
);

-- Relaciones entre tablas con ALTER TABLE

-- Relación Productos -> Categorias
ALTER TABLE Productos
ADD CONSTRAINT fk_categoria_producto FOREIGN KEY (id_categoria) REFERENCES Categorias (id_categoria);

-- Relación Compras -> Empleados
ALTER TABLE Compras
ADD CONSTRAINT fk_empleado_compra FOREIGN KEY (id_empleado) REFERENCES Empleados (id_empleado);

-- Relación Ventas -> Clientes
ALTER TABLE Ventas
ADD CONSTRAINT fk_cliente_venta FOREIGN KEY (id_cliente) REFERENCES Clientes (id_cliente);

-- Relación Ventas -> Empleados
ALTER TABLE Ventas
ADD CONSTRAINT fk_empleado_venta FOREIGN KEY (id_empleado) REFERENCES Empleados (id_empleado);

-- Configuración de fecha_venta por defecto
ALTER TABLE Ventas
MODIFY COLUMN fecha_venta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Relación Detalles_Compras -> Compras y Productos
ALTER TABLE Detalles_Compras
ADD CONSTRAINT fk_compra_detalle FOREIGN KEY (id_compra) REFERENCES Compras (id_compra),
ADD CONSTRAINT fk_producto_compra FOREIGN KEY (id_producto) REFERENCES Productos (id_producto);

-- Relación Detalles_Ventas -> Ventas y Productos
ALTER TABLE Detalles_Ventas
ADD CONSTRAINT fk_venta_detalle FOREIGN KEY (id_venta) REFERENCES Ventas (id_venta),
ADD CONSTRAINT fk_producto_venta FOREIGN KEY (id_producto) REFERENCES Productos (id_producto);

-- Inserciones lógicas secuenciales
-- Orden: tablas independientes primero, luego las dependientes

-- Inserciones en Categorias (independiente)
INSERT INTO Categorias (nombre_categoria, descripcion_categoria) VALUES
('Herramientas', 'Herramientas manuales y eléctricas'),
('Fijaciones', 'Tornillos, clavos y anclajes'),
('Pinturas', 'Pinturas y accesorios para pintar');

-- Inserciones en Clientes (independiente)
INSERT INTO Clientes (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, direccion, cedula) VALUES
('Juan', 'Carlos', 'Pérez', 'Gómez', '88991234', 'Calle Principal, San José', '1-2345-6789'),
('María', 'Elena', 'Gómez', 'Rodríguez', '87654321', 'Avenida Central, Heredia', '9-8765-4321'),
('Carlos', 'Andrés', 'López', 'Sánchez', '85556789', 'Barrio Norte, Alajuela', '4-5678-9123');

-- Inserciones en Empleados (independiente)
INSERT INTO Empleados (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, cargo, fecha_contratacion) VALUES
('Ana', 'María', 'Martínez', 'López', '87771111', 'Vendedor', '2024-01-15'),
('Luis', 'Alberto', 'Rodríguez', 'Pérez', '86662222', 'Cajero', '2024-03-01'),
('Pedro', 'José', 'Sánchez', 'García', '85553333', 'Gerente', '2023-11-10');

-- Inserciones en Usuarios (independiente en este diseño)
INSERT INTO Usuarios (usuario, contraseña) VALUES
('eli', 'eli2025'),
('javier51', '123456'),
('cruz51', '20252025');

-- Inserciones en Productos (depende de Categorias)
INSERT INTO Productos (nombre_producto, descripcion_producto, id_categoria, precio_unitario, stock, imagen) VALUES
('Martillo', 'Martillo de acero 16 oz', 1, 150.75, 50, NULL),
('Tornillos', 'Tornillos 1 pulgada caja 100 unid', 2, 25.50, 200, NULL),
('Pintura Blanca', 'Pintura blanca mate 1 galón', 3, 320.00, 30, NULL);

-- Inserciones en Compras (depende de Empleados)
INSERT INTO Compras (id_empleado, fecha_compra, total_compra) VALUES
(3, '2025-03-01', 2400.00),
(2, '2025-03-05', 2000.00),
(1, '2025-03-10', 2800.00);

-- Inserciones en Detalles_Compras (depende de Compras y Productos)
INSERT INTO Detalles_Compras (id_compra, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 20, 120.00),
(2, 2, 100, 20.00),
(3, 3, 10, 280.00);

-- Inserciones en Ventas (depende de Clientes y Empleados)
INSERT INTO Ventas (id_cliente, id_empleado, fecha_venta, total_venta) VALUES
(1, 1, '2025-03-18 09:30:00', 301.50),
(2, 2, '2025-03-18 14:15:00', 1275.00),
(3, 3, '2025-03-19 11:00:00', 320.00);

-- Inserciones en Detalles_Ventas (depende de Ventas y Productos)
INSERT INTO Detalles_Ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 2, 150.75),
(2, 2, 50, 25.50),
(3, 3, 1, 320.00);

-- Sentencias de actualización (un registro por tabla)

-- Actualizar Categorias (id_categoria = 1)
UPDATE Categorias
SET nombre_categoria = 'Herramientas Manuales', descripcion_categoria = 'Herramientas manuales exclusivamente'
WHERE id_categoria = 1;

-- Actualizar Clientes (id_cliente = 1)
UPDATE Clientes
SET primer_nombre = 'Juanito', direccion = 'Calle Secundaria, San José'
WHERE id_cliente = 1;

-- Actualizar Empleados (id_empleado = 1)
UPDATE Empleados
SET cargo = 'Supervisor', celular = '87779999'
WHERE id_empleado = 1;

-- Actualizar Usuarios (id_usuario = 1)
UPDATE Usuarios
SET contraseña = 'nueva123'
WHERE id_usuario = 1;

-- Actualizar Productos (id_producto = 1)
UPDATE Productos
SET precio_unitario = 160.00, stock = 60
WHERE id_producto = 1;

-- Actualizar Compras (id_compra = 1)
UPDATE Compras
SET total_compra = 2600.00, fecha_compra = '2025-03-02'
WHERE id_compra = 1;

-- Actualizar Detalles_Compras (id_detalle_compra = 1)
UPDATE Detalles_Compras
SET cantidad = 25, precio_unitario = 130.00
WHERE id_detalle_compra = 1;

-- Actualizar Ventas (id_venta = 1)
UPDATE Ventas
SET total_venta = 480.00
WHERE id_venta = 1;

-- Actualizar Detalles_Ventas (id_detalle_venta = 1)
UPDATE Detalles_Ventas
SET cantidad = 3, precio_unitario = 160.00
WHERE id_detalle_venta = 1;

-- Sentencias de eliminación (un registro por tabla)
-- Orden: primero tablas dependientes, luego independientes

-- Eliminar Detalles_Ventas (id_detalle_venta = 1)
DELETE FROM Detalles_Ventas WHERE id_detalle_venta = 1;

-- Eliminar Detalles_Compras (id_detalle_compra = 1)
DELETE FROM Detalles_Compras WHERE id_detalle_compra = 1;

-- Eliminar Ventas (id_venta = 1)
DELETE FROM Ventas WHERE id_venta = 1;

-- Eliminar Compras (id_compra = 1)
DELETE FROM Compras WHERE id_compra = 1;

-- Eliminar Productos (id_producto = 1)
DELETE FROM Productos WHERE id_producto = 1;

-- Eliminar Usuarios (id_usuario = 1)
DELETE FROM Usuarios WHERE id_usuario = 1;

-- Eliminar Empleados (id_empleado = 1)
DELETE FROM Empleados WHERE id_empleado = 1;

-- Eliminar Clientes (id_cliente = 1)
DELETE FROM Clientes WHERE id_cliente = 1;

-- Eliminar Categorias (id_categoria = 1)
DELETE FROM Categorias WHERE id_categoria = 1;