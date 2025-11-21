document.addEventListener('DOMContentLoaded', () => {
    const getProduct_form = document.getElementById("getProduct-form");
    const listaProductos = document.getElementById("lista-productos");
    const url = "/products"; 

    if(!getProduct_form) return;

    getProduct_form.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        listaProductos.innerHTML = ""; 

        const formData = new FormData(event.target);
        const idProd = formData.get('idProd');
        
        try {
            const response = await fetch(`${url}/${idProd}`);
            const datos = await response.json();

            if (!response.ok) {
                 throw new Error(datos.message || 'Error al buscar');
            }
            
            const producto = datos.payload; 

            if (producto) {
                // Renderizamos el HTML de la tarjeta
                const htmlProducto = `
                    <li class="li-listados" style="list-style-type: none; background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <img src="${producto.imagen || 'https://via.placeholder.com/100x100.png?text=Sin+Imagen'}" alt="${producto.nombreProducto}" style="width:100px; height:100px; object-fit:cover; border-radius: 4px;">
                        <p>ID: ${producto.id}</p>
                        <h3 style="margin-top: 10px;">${producto.nombreProducto}</h3>
                        <p>Precio: $${producto.precio}</p>
                        <p>Tipo: ${producto.tipo}</p> 
                    </li>
                `;
                listaProductos.innerHTML = htmlProducto;
            
            } else {
                listaProductos.innerHTML = `<p>No se encontró ningún producto con el ID: ${idProd}</p>`;
            }
            
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: `Error: ${error.message}`,
                icon: 'error'
            });
        }
    });
});