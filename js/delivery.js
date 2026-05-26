function obtenerPedido() {
    return JSON.parse(localStorage.getItem('pedido')) || [];
  }
  
  function guardarPedido(pedido) {
    localStorage.setItem('pedido', JSON.stringify(pedido));
  }
  
  function calcularTotal(pedido) {
    return pedido.reduce((total, item) => {
      return total + Number(item.precio) * Number(item.cantidad);
    }, 0);
  }
  
  function renderizarPedido() {
    const listaPedido = document.getElementById('lista-pedido');
    const totalPedido = document.getElementById('total-pedido');
  
    if (!listaPedido || !totalPedido) return;
  
    const pedido = obtenerPedido();
    listaPedido.innerHTML = '';
  
    if (pedido.length === 0) {
      listaPedido.innerHTML = `
        <p class="pedido-vacio">No has agregado productos aún.</p>
        <a href="menu.html" class="btn-outline">IR AL MENÚ</a>
      `;
      totalPedido.textContent = '$0.00';
      return;
    }
  
    pedido.forEach((item, index) => {
      const subtotal = Number(item.precio) * Number(item.cantidad);
  
      const card = document.createElement('div');
      card.className = 'item-pedido';
  
      card.innerHTML = `
        <div>
          <h4>${item.nombre_producto}</h4>
          <p>Precio:$${Number(item.precio).toFixed(2)}</p>
          <p>Subtotal: $${subtotal.toFixed(2)}</p>
        </div>
  
        <div class="acciones-item">
          <label>Cantidad</label>
          <input 
            type="number" 
            min="1" 
            value="${item.cantidad}" 
            data-index="${index}" 
            class="input-cantidad-item"
          >
          <button class="btn-eliminar" data-index="${index}">Eliminar</button>
        </div>
      `;
  
      listaPedido.appendChild(card);
    });
  
    totalPedido.textContent = ` $${calcularTotal(pedido).toFixed(2)}`;
  
    const inputsCantidad = document.querySelectorAll('.input-cantidad-item');
    inputsCantidad.forEach((input) => {
      input.addEventListener('change', (e) => {
        const index = Number(e.target.dataset.index);
        const nuevaCantidad = Number(e.target.value);
  
        if (!nuevaCantidad || nuevaCantidad < 1) {
          renderizarPedido();
          return;
        }
  
        const pedidoActual = obtenerPedido();
        pedidoActual[index].cantidad = nuevaCantidad;
        guardarPedido(pedidoActual);
        renderizarPedido();
      });
    });
  
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = Number(e.target.dataset.index);
        const pedidoActual = obtenerPedido();
        pedidoActual.splice(index, 1);
        guardarPedido(pedidoActual);
        renderizarPedido();
      });
    });
  }
  
  const formDelivery = document.getElementById('form-delivery');
  
  if (formDelivery) {
    formDelivery.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const pedido = obtenerPedido();
  
      if (pedido.length === 0) {
        alert('No hay productos en el pedido');
        return;
      }
  
      const nombre = document.getElementById('nombre-cliente').value.trim();
      const telefono = document.getElementById('telefono-cliente').value.trim();
      const direccion = document.getElementById('direccion-cliente').value.trim();
  
      if (!nombre || !telefono || !direccion) {
        alert('Completa todos los campos');
        return;
      }
  
      alert('Pedido confirmado correctamente');
      localStorage.removeItem('pedido');
      window.location.reload();
    });
  }
  
  renderizarPedido();