const SUPABASE_URL = "https://cstamlwqsruqldflwtiz.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdGFtbHdxc3J1cWxkZmx3dGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjM2NzksImV4cCI6MjA5NDYzOTY3OX0.Xx0MG-fRBDqNfHD_LPBuzzhvdH841BKfAjn-BkEc20Q";

// Cambiamos el nombre de la variable a supabaseClient para que no choque con la librería externa
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cargarMenuDigital() {
    const contenedor = document.getElementById("contenedor-menu");

    // Usamos el nuevo nombre de la variable aquí
    const { data: productos, error } = await supabaseClient
        .from('menu_digital')
        .select('*')
        .order('id_producto', { ascending: true });

    if (error) {
        console.error("Error al conectar con Supabase:", error);
        contenedor.innerHTML = `<p>Error al cargar el menú: ${error.message}</p>`;
        return;
    }

    if (!productos || productos.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron platillos en la base de datos.</p>";
        return;
    }

    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("producto-card");

        tarjeta.innerHTML = `
            <h3>${producto.nombre_producto}</h3>
            <p class="precio">$${parseFloat(producto.precio).toFixed(2)}</p>
            <button class="btn-accion">Añadir al Pedido</button>
        `;

        contenedor.appendChild(tarjeta);
    });
}

document.addEventListener("DOMContentLoaded", cargarMenuDigital);