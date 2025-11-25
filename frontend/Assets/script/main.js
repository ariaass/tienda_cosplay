// URL base de la API backend
const API_URL = 'http://localhost:3000/api';

// Cache para guardar los productos cargados
let productosCache = [];

// ---------- DESCRIPCIONES DE PRODUCTOS ----------
const descripciones = {
  // Pelucas
  'Zelda': 'Peluca rubia de fibra kanekalon, resistente al calor, con trenza removible.',
  'Rumi': 'Peluca extra larga de fibra kanekalon, largo 120 cm.',
  'Zoey': 'Peluca de fibra kanekalon , resistente al calor .',
  'Mira': 'Peluca larga de alto volumen, resistente al calor , fibra kanekalon.',
  'Frieren': 'Peluca de fibra kanekalon , resistente al calor , coletas removibles .',
  'Makima': 'Peluca color rojizo suave, resistente al calor , fibra kanekalon.',

  // Lentes
  'Tanjiro': '14,2 mm.',
  'Gojo': '14,00 mm.',
  'Power': '14,5 mm , circle lens , semi ciego.',
  'Hinata': '14,5 mm , circle lens ,semi ciego.',
  'MakimaLentes': '14,2 mm .',

  // Cosplays
  'Nezuko': 'Cosplay completo de Nezuko, incluye kimono, haori y prop. Material respirable y cómodo.',
  'Maid': 'Cosplay de maid clásico, incluye vestido, delantal y accesorios. Ideal para sesiones kawaii.',
  'Asuka': 'Cosplay Bodysuit de simil latex , respirable y brilloso.',
  'Eren': 'Cosplay completo incluye chaqueta, pantalones , arnes completo .',
  'Lucy': 'Cosplay de simil latex , incluye cinturon.'
};

// Mapeo personaje → nombre archivo de imagen
const imagenesProductos = {
  'Zelda': 'pelucazelda.png',
  'Rumi': 'pelucarumi.png',
  'Zoey': 'pelucazoey.png',
  'Mira': 'pelucamira.png',
  'Frieren': 'pelucafrieren.png',
  'Makima': 'pelucamakima.png',
  'Tanjiro': 'lenstanjiro.png',
  'Gojo': 'lensgojo.png',
  'Power': 'lenspower.png',
  'Hinata': 'lenshinata.png',
  'Nezuko': 'cosplaynezuko.png',
  'Maid': 'cosplaymaid.png',
  'Asuka': 'cosplayasuka.png',
  'Eren': 'cosplayeren.png',
  'Lucy': 'cosplaylucy.png'
};

// Devuelve la ruta de imagen según el personaje
function getImagen(personaje) {
  const nombreArchivo = imagenesProductos[personaje];
  if (nombreArchivo) {
    return `Assets/img/${nombreArchivo}`;
  }
  // Imagen de reserva si no hay archivo
  return `https://via.placeholder.com/300x180?text=${encodeURIComponent(personaje)}`;
}

// ---------- SECCIÓN PRODUCTOS ----------
// Si estamos en productos.html, cargamos los productos
if (window.location.pathname.includes("productos.html")) {
  cargarProductos();
}

// Trae productos desde el backend y los muestra
async function cargarProductos() {
  try {
    const res = await fetch(`${API_URL}/productos`);
    const productos = await res.json();
    productosCache = productos;                     // guardamos para filtros / modal
    renderGridProductos(productos);                 // grilla principal
    renderCarouselDestacados(productos.slice(0, 5)); // primeros 5 al carrusel
  } catch (err) {
    console.error('Error al cargar productos:', err);
  }
}


// ---------- FILTRO DE PRODUCTOS ----------

document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    const filtro = btn.getAttribute("data-filter");

    if (filtro === "all") {
      renderGridProductos(productosCache);      // muestra todos
    } else {
      const filtrados = productosCache.filter(p => p.nombre === filtro);
      renderGridProductos(filtrados);          // muestra según tipo
    }
  });
});

// Dibuja la grilla de tarjetas de productos
function renderGridProductos(productos) {
  const grid = document.getElementById('grid-productos');
  if (!grid) return;

  grid.innerHTML = '';

  productos.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';

    col.innerHTML = `
      <div class="card card-producto h-100">
        <img src="${getImagen(p.personaje)}" class="card-img-top" alt="${p.personaje}">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge badge-tipo">${p.nombre}</span>
            <span class="text-muted small">ID ${p.id_producto}</span>
          </div>
          <h5 class="card-title mb-1">${p.nombre} ${p.personaje}</h5>
          <p class="card-text mb-2">Stock: <strong>${p.stock}</strong></p>
          <p class="fw-bold mb-2">
            $${Number(p.precio).toLocaleString('es-CL')}
          </p>
          <button class="btn btn-pink btn-sm mt-auto btn-detalle-producto"
                  data-id="${p.id_producto}">
            Ver detalle
          </button>
        </div>
      </div>
    `;

    grid.appendChild(col);
  });

  // Eventos para los botones "Ver detalle"
  attachDetalleHandlers();
}

// ---------- CARRUSEL DESTACADOS ----------

function renderCarouselDestacados(productos) {
  const cont = document.getElementById('carousel-inner-destacados');
  if (!cont) return;

  cont.innerHTML = '';
  productos.forEach((p, index) => {
    const item = document.createElement('div');
    item.className = `carousel-item ${index === 0 ? 'active' : ''}`;

    item.innerHTML = `
      <div class="d-flex justify-content-center py-3">
        <div class="card card-producto" style="width: 20rem;">
          <img src="${getImagen(p.personaje)}" class="card-img-top" alt="${p.personaje}">
          <div class="card-body text-center">
            <span class="badge badge-tipo mb-2">${p.nombre}</span>
            <h5 class="card-title mb-1">${p.nombre} ${p.personaje}</h5>
            <p class="fw-bold mb-1">
              $${Number(p.precio).toLocaleString('es-CL')}
            </p>
            <small class="text-muted">Stock: ${p.stock}</small>
          </div>
        </div>
      </div>
    `;
    cont.appendChild(item);
  });
}

// ---------- MODAL DETALLE PRODUCTO ----------

// Asigna el click a todos los botones "Ver detalle"
function attachDetalleHandlers() {
  const botones = document.querySelectorAll('.btn-detalle-producto');
  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const prod = productosCache.find(p => p.id_producto === id);
      if (prod) {
        mostrarModalProducto(prod);
      }
    });
  });
}

// Rellena y muestra el modal del producto
function mostrarModalProducto(p) {
  const modalTitulo = document.getElementById('modalProductoTitulo');
  const modalBody = document.getElementById('modalProductoBody');

  if (!modalTitulo || !modalBody) return;

  modalTitulo.textContent = `${p.nombre} ${p.personaje}`;
  modalBody.innerHTML = `
  <div class="text-center">
    <img src="${getImagen(p.personaje)}" alt="${p.personaje}"
         class="img-fluid rounded mb-3">
  </div>

  <p><strong>Tipo:</strong> ${p.nombre}</p>
  <p><strong>Personaje:</strong> ${p.personaje}</p>
  <p><strong>Precio:</strong> $${Number(p.precio).toLocaleString('es-CL')}</p>
  <p><strong>Stock disponible:</strong> ${p.stock}</p>

  <p><strong>Descripción:</strong> 
      ${descripciones[p.personaje] ?? 'Producto de excelente calidad.'}
  </p>
`;

  const modalElement = document.getElementById('modalProducto');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}


// ---------- TRIGGER: venta-prueba ----------

const btnVenta = document.getElementById('btn-venta-prueba');
if (btnVenta) {
  btnVenta.addEventListener('click', async () => {
    // Leemos datos desde los inputs
    const id_pedido = Number(document.getElementById('input-id-pedido').value);
    const id_producto = Number(document.getElementById('input-id-producto').value);
    const cantidad = Number(document.getElementById('input-cantidad').value);

    try {
      // Enviamos la venta de prueba al backend
      const res = await fetch(`${API_URL}/venta-prueba`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_pedido, id_producto, cantidad })
      });

     const data = await res.json();

// Si hubo error, mostrar el mensaje del servidor
if (!res.ok) {
  document.getElementById('resultado-trigger').textContent = data.error;
  return;
}

// Si todo salió bien
document.getElementById('resultado-trigger').textContent =
  `${data.mensaje} | Stock actual: ${data.stockActual ?? 'desconocido'}`;


      // Recarga productos para refrescar stock en las cards
      await cargarProductos();
    } catch (err) {
      console.error('Error en venta-prueba:', err);
    }
  });
}


// ---------- VISTA: ventas por cliente ----------

const btnVentas = document.getElementById('btn-ver-ventas');
if (btnVentas) {
  btnVentas.addEventListener('click', async () => {
    try {
      const res = await fetch(`${API_URL}/ventas-clientes`);
      const data = await res.json();
      const tbody = document.querySelector('#tabla-ventas tbody');
      tbody.innerHTML = '';

      // Mostrar solo los TOP 5 clientes
      data.slice(0, 5).forEach(v => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${v.rut}</td>
          <td>${v.nombre}</td>
          <td>${v.apellido}</td>
          <td>$${Number(v.total_en_pesos).toLocaleString('es-CL')}</td>
        `;
        tbody.appendChild(tr);
      });

    } catch (err) {
      console.error('Error en vista ventas-clientes:', err);
    }
  });
}


// ---------- FUNCIÓN: total gastado ----------

const btnTotal = document.getElementById('btn-total-gastado');
if (btnTotal) {
  btnTotal.addEventListener('click', async () => {
    const rut = document.getElementById('input-rut').value.trim();
    const contenedor = document.getElementById('resultado-funcion');

    if (!rut) {
      contenedor.className = 'alert alert-warning';
      contenedor.textContent = 'Por favor ingresa un RUT.';
      contenedor.classList.remove('d-none');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/total-gastado?rut=${encodeURIComponent(rut)}`);
      const data = await res.json();

      contenedor.className = 'alert alert-info';
      contenedor.textContent =
        `El cliente ${rut} ha gastado en total: $${Number(data.total ?? 0).toLocaleString('es-CL')}`;
      contenedor.classList.remove('d-none');
    } catch (err) {
      console.error('Error en función total-gastado:', err);
      contenedor.className = 'alert alert-danger';
      contenedor.textContent = 'Ocurrió un error al consultar el total.';
      contenedor.classList.remove('d-none');
    }
  });
}


// ---------- PROCEDIMIENTO: actualizar precios ----------

const btnActualizar = document.getElementById('btn-actualizar-precios');
if (btnActualizar) {
  btnActualizar.addEventListener('click', async () => {
    const porcentaje = Number(document.getElementById('input-porcentaje').value);
    const contenedor = document.getElementById('resultado-procedimiento');

    if (isNaN(porcentaje)) {
      contenedor.className = 'alert alert-warning';
      contenedor.textContent = 'Ingresa un porcentaje válido.';
      contenedor.classList.remove('d-none');
      return;
    }

    try {
      // Llamamos al procedimiento almacenado del backend
      const res = await fetch(`${API_URL}/actualizar-precios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ porcentaje })
      });

      const data = await res.json();

      if (res.ok) {
        contenedor.className = 'alert alert-success';
        contenedor.textContent = data.mensaje || 'Precios actualizados correctamente.';
      } else {
        contenedor.className = 'alert alert-danger';
        contenedor.textContent = data.error || 'Error al actualizar precios.';
      }
      contenedor.classList.remove('d-none');
    } catch (err) {
      console.error('Error en procedimiento actualizar-precios:', err);
      contenedor.className = 'alert alert-danger';
      contenedor.textContent = 'Ocurrió un error al llamar al procedimiento.';
      contenedor.classList.remove('d-none');
    }
  });
}
