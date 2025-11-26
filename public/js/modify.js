document.addEventListener('DOMContentLoaded', () => {

    const formBuscar = document.getElementById('form-buscar-producto');
    const formModificar = document.getElementById('form-modificar-producto');
    const resultadoEdicion = document.getElementById('resultado-edicion');
    const contenedorTarjeta = document.getElementById('contenedor-tarjeta-producto');
    
    const url = "/products"; 
    let idProductoBuscado = null; 

    if(!formBuscar || !formModificar) return;

    // --- Buscar ---
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

            const producto = data.payload;

            // Rellenar Formulario
            document.querySelector('#form-modificar-producto [name="nombreProducto"]').value = producto.nombreProducto;
            document.querySelector('#form-modificar-producto [name="tipo"]').value = producto.tipo;
            document.querySelector('#form-modificar-producto [name="precio"]').value = producto.precio;
            document.querySelector('#form-modificar-producto [name="imagen"]').value = producto.imagen;
            document.querySelector('#form-modificar-producto [name="stock"]').value = producto.stock;

            // Mostrar Tarjeta
            contenedorTarjeta.innerHTML = ''; 
            const card = document.createElement('div');
            card.className = 'product-card';
            const urlDeImagen = producto.imagen || 'https://via.placeholder.com/250x200.png?text=Sin+Imagen';

            card.innerHTML = `
                <img src="${urlDeImagen}" alt="${producto.nombreProducto}">
                <div class="product-info">
                    <h3>${producto.nombreProducto}</h3>
                    <p class="product-tipo">Tipo: ${producto.tipo || 'N/A'}</p>
                    <p class="product-precio">$${producto.precio}</p>
                    <p class="product-stock">Stock: ${producto.stock || 0}</p>
                </div>
            `;
            contenedorTarjeta.appendChild(card);
            resultadoEdicion.style.display = 'block';

        } catch (error) {
            Swal.fire('Error', `Error al buscar: ${error.message}`, 'error');
            resultadoEdicion.style.display = 'none';
        }
    });

    // --- Modificar (PUT) ---
    formModificar.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!idProductoBuscado) {
            Swal.fire('Error', 'Por favor, busca un producto primero.', 'warning');
            return;
        }

        const formData = new FormData(formModificar);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${url}/${idProductoBuscado}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al actualizar');
            }
            
            await Swal.fire({
                title: '¡Actualizado!',
                text: 'Producto actualizado con éxito.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            window.location.href = '/'; 

        } catch (error) {
            Swal.fire('Error', `Error al actualizar: ${error.message}`, 'error');
        }
    });
});