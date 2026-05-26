import { supabase } from './supabaseClient.js';

const listaMesas = document.getElementById('lista-mesas');
const selectMesa = document.getElementById('mesa-reserva');
const formReservacion = document.getElementById('form-reservacion');
const mensajeReservacion = document.getElementById('mensaje-reservacion');

async function cargarMesas() {
  if (!listaMesas || !selectMesa) return;

  listaMesas.innerHTML = '<p>Cargando mesas...</p>';

  const { data, error } = await supabase
    .from('mesa')
    .select('*')
    .order('numero_mesa', { ascending: true });

  if (error) {
    console.error('Error al cargar mesas:', error);
    listaMesas.innerHTML = '<p>Error al cargar las mesas.</p>';
    return;
  }

  if (!data || data.length === 0) {
    listaMesas.innerHTML = '<p>No hay mesas registradas.</p>';
    return;
  }

  listaMesas.innerHTML = '';
  selectMesa.innerHTML = '<option value="">Selecciona una mesa</option>';

  data.forEach((mesa) => {
    const card = document.createElement('div');
    card.className = 'mesa-card';
    card.innerHTML = `
      <h4>Mesa ${mesa.numero_mesa}</h4>
      <p><strong>Capacidad:</strong> ${mesa.capacidad} personas</p>
      <p><strong>Estado:</strong> ${mesa.estado}</p>
    `;
    listaMesas.appendChild(card);

    if (mesa.estado?.toLowerCase() === 'disponible') {
      const option = document.createElement('option');
      option.value = mesa.id_mesa;
      option.textContent = `Mesa ${mesa.numero_mesa} - ${mesa.capacidad} personas`;
      selectMesa.appendChild(option);
    }
  });
}


async function crearCliente(nombre, telefono) {
  const nuevoIdCliente = await obtenerNuevoId('cliente', 'id_cliente');

  const { data, error } = await supabase
    .from('cliente')
    .insert([
      {
        id_cliente: nuevoIdCliente,
        nombre_completo: nombre,
        telefono: telefono,
        direccion_entrega: null
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error al crear cliente:', error);
    throw error;
  }

  return data;
}

async function crearReservacion(idCliente, idMesa, fecha, hora) {
  const nuevoIdReservacion = await obtenerNuevoId('reservacion', 'id_reservacion');

  const { error } = await supabase
    .from('reservacion')
    .insert([
      {
        id_reservacion: nuevoIdReservacion,
        id_cliente: idCliente,
        id_mesa: Number(idMesa),
        fecha_reserva: fecha,
        hora_reserva: hora
      }
    ]);

  if (error) {
    console.error('Error al crear reservación:', error);
    throw error;
  }
}

if (formReservacion) {
  formReservacion.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre-reserva').value.trim();
    const telefono = document.getElementById('telefono-reserva').value.trim();
    const fecha = document.getElementById('fecha-reserva').value;
    const hora = document.getElementById('hora-reserva').value;
    const idMesa = document.getElementById('mesa-reserva').value;

    if (!nombre || !telefono || !fecha || !hora || !idMesa) {
      mensajeReservacion.innerHTML = '<p class="mensaje-error-texto">Completa todos los campos.</p>';
      return;
    }

    try {
      mensajeReservacion.innerHTML = '<p>Procesando reservación...</p>';

      const cliente = await crearCliente(nombre, telefono);
      await crearReservacion(cliente.id_cliente, idMesa, fecha, hora);

      mensajeReservacion.innerHTML = `
        <p class="mensaje-exito-texto">Reservación registrada correctamente.</p>
      `;

      formReservacion.reset();
    } catch (error) {
      mensajeReservacion.innerHTML = `
        <p class="mensaje-error-texto">Ocurrió un error al registrar la reservación.</p>
      `;
    }
  });
}

cargarMesas();