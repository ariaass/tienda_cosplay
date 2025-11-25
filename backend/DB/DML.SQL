INSERT INTO Clientes (rut_cliente, nombre, apellido, email, telefono) VALUES
('12.345.678-9', 'Juan', 'Araya', 'juan.araya@gmail.com', '+56981234567'),
('16.789.543-2', 'Camila', 'Torres', 'camila.torres@hotmail.com', '+56993567890'),
('19.222.111-5', 'Felipe', 'Muñoz', 'felipe.munoz@gmail.com', '+56975642311'),
('13.456.789-1', 'Valentina', 'Rojas', 'valen.rojas@gmail.com', '+56984561234'),
('15.987.654-3', 'Matías', 'Pérez', 'matias.perez@gmail.com', '+56977889900'),
('11.223.344-5', 'Sofía', 'Hernández', 'sofia.hernandez@gmail.com', '+56977778888'),
('18.765.432-1', 'Ignacio', 'Contreras', 'ignacio.contreras@gmail.com', '+56966778899'),
('17.654.321-9', 'Catalina', 'Vega', 'cata.vega@hotmail.com', '+56999887766'),
('14.321.678-0', 'Diego', 'Fuentes', 'diego.fuentes@gmail.com', '+56955443322'),
('19.876.543-2', 'Antonia', 'Silva', 'antonia.silva@gmail.com', '+56966554433');


INSERT INTO Direcciones (nombre_direc, rut_cliente, direccion, region, ciudad) VALUES
('Casa', '12.345.678-9', 'Av. Los Pinos 1234', 'Valparaíso', 'Viña del Mar'),
('Departamento', '16.789.543-2', 'Calle Los Álamos 567', 'Metropolitana', 'Santiago'),
('Casa', '19.222.111-5', 'Pasaje Las Flores 890', 'Biobío', 'Concepción'),
('Casa', '13.456.789-1', 'Av. Central 230', 'Coquimbo', 'La Serena'),
('Departamento', '15.987.654-3', 'Calle Italia 120', 'Los Lagos', 'Puerto Montt'),
('Casa', '11.223.344-5', 'Camino Real 145', 'Metropolitana', 'Puente Alto'),
('Casa', '18.765.432-1', 'Av. Costanera 890', 'Antofagasta', 'Antofagasta'),
('Departamento', '17.654.321-9', 'Calle Colón 342', 'Valparaíso', 'Quilpué'),
('Casa', '14.321.678-0', 'Pasaje Sur 450', 'Maule', 'Talca'),
('Departamento', '19.876.543-2', 'Av. Alemania 567', 'La Araucanía', 'Temuco');

INSERT INTO Productos (nombre, personaje, precio, stock) VALUES
('Peluca', 'Zelda', 25000, 25),
('Peluca', 'Rumi', 30000, 30),
('Peluca', 'Zoey', 22000, 50),
('Peluca', 'Mira', 25000, 80),
('Peluca', 'Frieren', 22000, 100),
('Peluca', 'Makima', 22000, 40),
('Lens', 'Tanjiro', 9990, 35),
('Lens', 'Makima', 12000, 70),
('Lens', 'Gojo', 7990, 110),
('Lens', 'Power', 9990, 60),
('Lens', 'Hinata', 9990, 60),
('Cosplay', 'Nezuko', 55000, 60),
('Cosplay', 'Maid', 24990, 60),
('Cosplay', 'Asuka', 26990, 60),
('Cosplay', 'Eren', 55000, 60),
('Cosplay', 'Lucy', 65000, 60);


INSERT INTO Pedidos (rut_cliente, fecha) VALUES
('12.345.678-9', '2025-09-01'),
('16.789.543-2', '2025-09-03'),
('19.222.111-5', '2025-09-07'),
('13.456.789-1', '2025-09-09'),
('15.987.654-3', '2025-09-11'),
('11.223.344-5', '2025-09-14'),
('18.765.432-1', '2025-09-18'),
('17.654.321-9', '2025-09-21'),
('14.321.678-0', '2025-09-25'),
('19.876.543-2', '2025-09-29');


INSERT INTO Detalle_Pedido (id_pedido, id_producto, cantidad) VALUES
(1, 1, 2),
(1, 4, 1),
(2, 2, 1),
(2, 3, 3),
(3, 6, 1),
(3, 9, 2),
(4, 5, 3),
(4, 8, 1),
(5, 7, 1),
(5, 10, 2),
(6, 3, 2),
(6, 4, 2),
(7, 1, 1),
(7, 9, 1),
(8, 5, 2),
(8, 8, 3),
(9, 6, 2),
(9, 10, 1),
(10, 2, 1),
(10, 7, 2);
