// backend/server.js

// Dependencias principales
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());           // Permite peticiones del frontend
app.use(express.json());   // Permite leer JSON desde el body

// Servir archivos del frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Conexión a PostgreSQL
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '12345',
  database: 'tienda_cosplay',
  port: 5432
});

// Probar conexión
pool.connect()
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch(err => console.error('Error de conexión:', err));


// ===================== ENDPOINTS =====================

// 1) Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Productos ORDER BY id_producto');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// 2) Consultar la vista de ventas por cliente
app.get('/api/ventas-clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Vista_VentasPorCliente');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

// 3) Llamar a la función TotalGastadoCliente
app.get('/api/total-gastado', async (req, res) => {
  const { rut } = req.query;

  if (!rut) return res.status(400).json({ error: 'Falta el RUT' });

  try {
    const result = await pool.query('SELECT TotalGastadoCliente($1) AS total', [rut]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4) Ejecutar el procedimiento para actualizar precios
app.post('/api/actualizar-precios', async (req, res) => {
  const { porcentaje } = req.body;

  if (porcentaje === undefined)
    return res.status(400).json({ error: 'Falta el porcentaje' });

  try {
    await pool.query('CALL ActualizarPrecioProductos($1)', [porcentaje]);
    res.json({ mensaje: 'Precios actualizados' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5) Insertar un detalle y activar el trigger de stock
app.post('/api/venta-prueba', async (req, res) => {
  const { id_pedido, id_producto, cantidad } = req.body;

  if (!id_pedido || !id_producto || !cantidad)
    return res.status(400).json({ error: 'Faltan datos' });

  try {
    // Insertar detalle → activa el trigger
    await pool.query(
      'INSERT INTO Detalle_Pedido (id_pedido, id_producto, cantidad) VALUES ($1, $2, $3)',
      [id_pedido, id_producto, cantidad]
    );

    // Consultar stock luego del trigger
    const result = await pool.query(
      'SELECT stock FROM Productos WHERE id_producto = $1',
      [id_producto]
    );

    res.json({
      mensaje: 'Venta registrada',
      stockActual: result.rows[0]?.stock
    });
    
 } catch (err) {
    console.error("Error en /api/venta-prueba:", err);

    // Detectar error del trigger (stock insuficiente)
    if (err.message.toLowerCase().includes("stock insuficiente")) {
        return res.status(400).json({
            error: "No hay stock suficiente para realizar la venta."
        });
    }

    // Error general
    return res.status(500).json({
        error: "Error al registrar la venta."
    });
}

});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
