//PRUEBA MENU
import { supabase } from './supabaseClient.js';

async function cargarMenuDigital() {
  const contenedor = document.getElementById('grid-platillos');

  const { data, error } = await supabase
    .from('menu_digital')
    .select(`
      id_producto,
      nombre_producto,
      precio,
      categorias (
        nombre_categoria
      )
    `)
    .limit(5);

  if (error) {
    console.error('Error leyendo menu_digital:', error);
    contenedor.innerHTML = '<p>Error al cargar el menú.</p>';
    return;
  }

  console.log('Datos del menú:', data);

  contenedor.innerHTML = '';

  data.forEach((producto) => {
    const categoria = producto.categorias?.nombre_categoria || 'Sin categoría';
  
    const article = document.createElement('article');
    article.className = 'platillo';
  
    article.innerHTML = `
      <a href="producto.html?id=${producto.id_producto}" class="link-platillo">
        <div class="img-placeholder"></div>
        <h3>${producto.nombre_producto}</h3>
        <p>$${Number(producto.precio).toFixed(2)}</p>
        <small>${categoria}</small>
      </a>
    `;
  
    contenedor.appendChild(article);
  });
}

cargarMenuDigital();