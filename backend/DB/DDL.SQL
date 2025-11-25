-- DATABASE
CREATE DATABASE "tienda_cosplay";

-- CLIENTES
CREATE TABLE Clientes (
    rut_cliente VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL
);

-- DIRECCIONES
CREATE TABLE Direcciones (
    id_direccion SERIAL PRIMARY KEY,
    nombre_direc VARCHAR(50) NOT NULL,
    rut_cliente VARCHAR(12) NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    region VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    FOREIGN KEY (rut_cliente) REFERENCES Clientes(rut_cliente)
);

-- PRODUCTOS 
CREATE TABLE Productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    personaje VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
    stock INT NOT NULL CHECK (stock >= 0) -- Check para stock
);

-- PEDIDOS
CREATE TABLE Pedidos (
    id_pedido SERIAL PRIMARY KEY,
    rut_cliente VARCHAR(12) NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (rut_cliente) REFERENCES Clientes(rut_cliente)
);

-- DETALLE PEDIDOS
CREATE TABLE Detalle_Pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0), -- Check para comprar 
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);
--Procedimiento almacenado que recibe un porcentaje y actualiza el precio de todos los productos:
CREATE OR REPLACE PROCEDURE ActualizarPrecioProductos(porcentaje NUMERIC(5,2))
LANGUAGE plpgsql
AS $$
BEGIN
    -- validación que agregamos
    IF porcentaje < -50 OR porcentaje > 200 THEN
        RAISE EXCEPTION 'El porcentaje debe estar entre -50%% y 200%%';
    END IF;

    UPDATE Productos
    SET precio = precio * (1 + porcentaje / 100);
END;
$$;

--Muestra cuánto ha gastado cada cliente en total, sumando todas sus compras, ordenado desde el que más gasta al que menos.

CREATE OR REPLACE VIEW Vista_VentasPorCliente AS
SELECT 
    c.rut_cliente         AS rut,
    c.nombre              AS nombre,
    c.apellido            AS apellido,
    SUM(dp.precio_unitario * dp.cantidad) AS total_en_pesos
FROM Clientes c
JOIN Pedidos pe ON c.rut_cliente = pe.rut_cliente
JOIN Detalle_Pedido dp ON pe.id_pedido = dp.id_pedido
GROUP BY c.rut_cliente, c.nombre, c.apellido
ORDER BY total_en_pesos DESC;


--Recibe el RUT de un cliente y devuelve cuánto ha gastado ese cliente en total. Si el RUT no existe, lanza un mensaje de error.
CREATE OR REPLACE FUNCTION TotalGastadoCliente(rut VARCHAR)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    total NUMERIC := 0;
    existe INT;
BEGIN
    -- validación: ¿el cliente existe?
    SELECT COUNT(*) INTO existe
    FROM Clientes
    WHERE rut_cliente = rut;

    IF existe = 0 THEN
        RAISE EXCEPTION 'El cliente con RUT % no existe', rut;
    END IF;

    SELECT SUM(dp.precio_unitario * dp.cantidad)
    INTO total
    FROM Clientes c
    JOIN Pedidos pe ON c.rut_cliente = pe.rut_cliente
    JOIN Detalle_Pedido dp ON pe.id_pedido = dp.id_pedido
    WHERE c.rut_cliente = rut;

    RETURN COALESCE(total, 0);
END;
$$;

--Cada vez que se inserta una fila en Detalle_Pedido (es decir, se registra una compra), 
--el trigger descuenta automáticamente el stock del producto. Antes de descontar, revisa si hay stock suficiente; si no, lanza un error. 

CREATE OR REPLACE FUNCTION DescontarStock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    stock_actual INT;
BEGIN
    SELECT stock INTO stock_actual
    FROM Productos
    WHERE id_producto = NEW.id_producto;

    IF stock_actual < NEW.cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente para el producto %, stock actual: %',
                         NEW.id_producto, stock_actual;
    END IF;

    UPDATE Productos
    SET stock = stock - NEW.cantidad
    WHERE id_producto = NEW.id_producto;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_descontar_stock
AFTER INSERT ON Detalle_Pedido
FOR EACH ROW
EXECUTE FUNCTION DescontarStock();


-- TRIGGER PARA GUARDAR EL PRECIO HISTÓRICO --
CREATE OR REPLACE FUNCTION trg_set_precio_unitario()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT precio 
    INTO NEW.precio_unitario
    FROM Productos
    WHERE id_producto = NEW.id_producto;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER set_precio_unitario_before_insert
BEFORE INSERT ON Detalle_Pedido
FOR EACH ROW
EXECUTE FUNCTION trg_set_precio_unitario();
