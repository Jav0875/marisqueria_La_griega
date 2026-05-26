import { supabase } from './supabaseClient.js';

function obtenerIdDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function obtenerPedido() {
  return JSON.parse(localStorage.getItem('pedido')) || [];
}

function guardarPedido(pedido) {
  localStorage.setItem('pedido', JSON.stringify(pedido));
}

function agregarAlPedido(producto, cantidad) {
  const pedido = obtenerPedido();

  const productoExistente = pedido.find(
    (item) => item.id_producto === producto.id_producto
  );

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    pedido.push({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      precio: Number(producto.precio),
      cantidad: cantidad
    });
  }

  guardarPedido(pedido);
  alert('Producto agregado al pedido');
}

async function cargarDetalleProducto() {
  const contenedor = document.getElementById('detalle-producto');
  const idProducto = obtenerIdDesdeURL();

  if (!contenedor) return;

  if (!idProducto) {
    contenedor.innerHTML = `
      <div class="mensaje-error">
        <h2>Producto no encontrado</h2>
        <p>No se recibió un ID válido en la URL.</p>
        <a href="menu.html" class="btn-outline">VOLVER AL MENÚ</a>
      </div>
    `;
    return;
  }

  const { data, error } = await supabase
    .from('menu_digital')
    .select(`
      id_producto,
      nombre_producto,
      precio,
      categorias (
        nombre_categoria,
        descripcion
      )
    `)
    .eq('id_producto', idProducto)
    .single();

  if (error || !data) {
    console.error('Error al cargar el producto:', error);
    contenedor.innerHTML = `
      <div class="mensaje-error">
        <h2>Error al cargar producto</h2>
        <p>No fue posible obtener la información del producto.</p>
        <a href="menu.html" class="btn-outline">VOLVER AL MENÚ</a>
      </div>
    `;
    return;
  }

  const categoria = data.categorias?.nombre_categoria || 'Sin categoría';
  const descripcionCategoria =
    data.categorias?.descripcion || 'Sin descripción disponible';

  contenedor.innerHTML = `
    <div class="detalle-card">
      <div class="detalle-imagen">
        <div class="img-placeholder"></div>
      </div>

      <div class="detalle-info">
        <h2>${data.nombre_producto}</h2>
        <p class="detalle-precio">$${Number(data.precio).toFixed(2)}</p>
        <p><strong>Categoría:</strong> ${categoria}</p>
        <p><strong>Descripción:</strong> ${descripcionCategoria}</p>

        <div class="cantidad-agregar">
          <label for="cantidad-producto"><strong>Cantidad:</strong></label>
          <input type="number" id="cantidad-producto" min="1" value="1">
        </div>

        <div class="detalle-botones">
          <button class="btn-principal" id="btn-agregar-pedido" type="button">
            AGREGAR AL PEDIDO
          </button>
          <a href="menu.html" class="btn-outline">VOLVER AL MENÚ</a>
          <a href="delivery.html" class="btn-outline">VER PEDIDO</a>
        </div>
      </div>
    </div>
  `;

  const btnAgregar = document.getElementById('btn-agregar-pedido');
  const inputCantidad = document.getElementById('cantidad-producto');

  btnAgregar.addEventListener('click', () => {
    const cantidad = Number(inputCantidad.value);

    if (!cantidad || cantidad < 1) {
      alert('Ingresa una cantidad válida');
      return;
    }

    agregarAlPedido(data, cantidad);
  });
}

cargarDetalleProducto();