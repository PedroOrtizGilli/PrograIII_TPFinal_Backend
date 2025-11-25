document.addEventListener('DOMContentLoaded', () => {

    const formBuscar = document.getElementById('form-buscar-producto');
    const btnMostrarTodos = document.getElementById('btn-mostrar-todos');
    const btnEliminarTodos = document.getElementById('btn-eliminar-todos');
    const btnEliminarEspecifico = document.getElementById('btn-eliminar-especifico');
    
    const resultadoBusqueda = document.getElementById('resultado-busqueda');
    const contenedorProductos = document.getElementById('contenedor-productos');
    
    const url = "/products"; 
    let idProductoBuscado = null; 

    if(!formBuscar) return;

    // --- Buscar Producto ---
    formBuscar.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(formBuscar);
        const id = formData.get('idProd');
        
        if (!id) return;
        idProductoBuscado = id; 

        try {
            const response = await fetch(`${url}/${id}`);
            const data = await response.json();

            if (!response.ok || !data.payload) {
                throw new Error(data.message || 'Producto no encontrado');
            }
            
            mostrarTarjetas([data.payload]); 
            btnEliminarEspecifico.style.display = 'block'; 

        } catch (error) {
            Swal.fire('Error', `Error al buscar: ${error.message}`, 'error');
            resultadoBusqueda.style.display = 'none';
        }
    });

    // --- Mostrar Todos ---
    btnMostrarTodos.addEventListener('click', async () => {
        idProductoBuscado = null; 
        btnEliminarEspecifico.style.display = 'none'; 

        try {
            const response = await fetch(url); 
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message);
            
            mostrarTarjetas(data.payload); 

        } catch (error) {
            Swal.fire('Error', `Error al cargar listado: ${error.message}`, 'error');
            resultadoBusqueda.style.display = 'none';
        }
    });

    // --- Eliminar Específico ---
    btnEliminarEspecifico.addEventListener('click', async () => {
        if (!idProductoBuscado) return;

        const result = await Swal.fire({
            title: `¿Eliminar ID ${idProductoBuscado}?`,
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${url}/${idProductoBuscado}`, { method: 'DELETE' });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);
            
            await Swal.fire('¡Eliminado!', data.message, 'success');
            resultadoBusqueda.style.display = 'none';
            formBuscar.reset();

        } catch (error) {
            Swal.fire('Error', `No se pudo eliminar: ${error.message}`, 'error');
        }
    });

    // --- Eliminar TODOS ---
    btnEliminarTodos.addEventListener('click', async () => {
        const result = await Swal.fire({
            title: '¿ELIMINAR TODO?',
            text: "¡CUIDADO! Esto borrará TODOS los productos.",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'SÍ, BORRAR TODO'
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(url, { method: 'DELETE' }); // POST a / (o DELETE a /)
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);
            
            await Swal.fire('¡Eliminados!', data.message, 'success');
            resultadoBusqueda.style.display = 'none';
            formBuscar.reset();

        } catch (error) {
            Swal.fire('Error', `Error crítico: ${error.message}`, 'error');
        }
    });

    // Función Auxiliar
    function mostrarTarjetas(productos) {
        contenedorProductos.innerHTML = ''; 
        if (!productos || productos.length === 0) {
            contenedorProductos.innerHTML = '<p>No hay productos.</p>';
            resultadoBusqueda.style.display = 'block';
            return;
        }
        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const urlDeImagen = producto.imagen || 'https://via.placeholder.com/250x200.png?text=Sin+Imagen';
            card.innerHTML = `
                <img src="${urlDeImagen}" alt="${producto.nombreProducto}">
                <div class="product-info">
                    <h3>(ID: ${producto.id}) ${producto.nombreProducto}</h3>
                    <p class="product-tipo">Tipo: ${producto.tipo || 'N/A'}</p>
                    <p class="product-precio">$${producto.precio}</p>
                    <p class="product-stock">Stock: ${producto.stock || 0}</p>
                </div>
            `;
            contenedorProductos.appendChild(card);
        });
        resultadoBusqueda.style.display = 'block';
    }
});