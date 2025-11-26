/// Esperamos a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form-nuevo-producto');
    
    const productContainer = document.getElementById('contenedor-productos');

    if (productContainer) {
        fetchYMostrarProductos();
    } else {
        console.log("Nota: No se encontró 'contenedor-productos' en esta página.");
    }

    

    // --- Obtener y mostrar todos los productos ---
    async function fetchYMostrarProductos() {
        try {
            // Pedimos los productos a la API (ruta corregida)
            const response = await fetch('/products');
            if (!response.ok) throw new Error('Error al obtener productos');
            
            const data = await response.json();
            const productos = data.payload;

            // Limpiamos el contenedor
            productContainer.innerHTML = '';

            // Recorremos los productos y creamos una TARJETA por cada uno
            productos.forEach(producto => {
                
                // Creamos un nuevo div para la tarjeta
                const card = document.createElement('div');
                card.className = 'product-card'; // Le asignamos su clase CSS
               
                // Usamos una imagen "placeholder" si el producto no tiene una
                const urlDeImagen = producto.imagen || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
                const nombreProducto = producto.nombreProducto;

                // Construimos el HTML interno de la tarjeta
                card.innerHTML = `
                    <img src="${urlDeImagen}" alt="${nombreProducto}">
                    <div class="product-info">
                        <p class="product-id">ID: ${producto.id}</p>
                        <h3>${nombreProducto}</h3>
                        <p class="product-tipo">Tipo: ${producto.tipo || 'N/A'}</p>
                        <p class="product-precio">$${producto.precio}</p>
                        <p class="product-stock">Stock: ${producto.stock || 0}</p>
                    </div>
                `;

                // Añadimos la tarjeta completa al contenedor
                productContainer.appendChild(card);
            });

        } catch (error) {
            console.error(error);
            productContainer.innerHTML = `<p class="error-message">Error al cargar productos.</p>`;
        }
    }

    // --- Manejar el envío del formulario ---
    async function handleFormSubmit(event) {
        event.preventDefault(); // Evita que la página se recargue

        const formData = new FormData(form);
        const producto = {
            id: formData.get('id'),
            nombre: formData.get('nombre'),
            tipo: formData.get('tipo'),
            precio: parseFloat(formData.get('precio')),
            imagen: formData.get('imagen_url'), 
            stock: parseInt(formData.get('stock')) || 0
        };

        try {
            // Enviamos los datos al endpoint POST 
            const response = await fetch('/products', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(producto)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el producto');
            }

            form.reset(); // Limpiamos el formulario
            
            if (productContainer) {
                // Si el contenedor de productos existe en esta página, actualiza la lista
                fetchYMostrarProductos(); 
            } else {
               
                alert('Producto creado con éxito. Serás redirigido al inicio.');
                window.location.href = '/'; // Redirige al inicio
            }

        } catch (error) {
            console.error(error);
            Swal.fire('Error', `No se pudo crear el producto: ${error.message}`, 'error');
        }
    }
});