import { supabase } from './supabaseClient.js';

const contenedor = document.getElementById('grid-menu-completo');
const selectCategoria = document.getElementById('filtro-categoria');

async function cargarCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre_categoria', { ascending: true });

  if (error) {
    console.error('Error al cargar categorías:', error);
    return;
  }

  data.forEach((categoria) => {
    const option = document.createElement('option');
    option.value = categoria.id_categoria;
    option.textContent = categoria.nombre_categoria;
    selectCategoria.appendChild(option);
  });
}

async function cargarMenu(idCategoria = '') {
  let query = supabase
    .from('menu_digital')
    .select(`
      id_producto,
      nombre_producto,
      precio,
      id_categoria,
      categorias (
        nombre_categoria
      )
    `)
    .order('nombre_producto', { ascending: true });

  if (idCategoria) {
    query = query.eq('id_categoria', idCategoria);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error al cargar menú:', error);
    contenedor.innerHTML = '<p>Error al cargar el menú.</p>';
    return;
  }

  contenedor.innerHTML = '';

  if (data.length === 0) {
    contenedor.innerHTML = '<p>No hay productos para mostrar.</p>';
    return;
  }

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

selectCategoria.addEventListener('change', () => {
  cargarMenu(selectCategoria.value);
});

async function iniciarPaginaMenu() {
  await cargarCategorias();
  await cargarMenu();
}

iniciarPaginaMenu();