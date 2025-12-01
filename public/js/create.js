document.addEventListener('DOMContentLoaded', () => {
    //Creacion de un producto
    const altaProductsForm = document.getElementById("altaProducts-form");
    const url = "/products"; // Ruta relativa

    if (!altaProductsForm) return; // Si no existe el form, salimos

    altaProductsForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log("Enviando al backend:", data);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }); 

            const result = await response.json();

            if (response.ok) {
                // Usamos SweetAlert 
                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Producto creado con éxito',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                // Redirigimos al inicio
                window.location.href = '/'; 

            } else {
                throw new Error(result.message || 'Error desconocido');
            }

        } catch(error) {
            console.error("Error al enviar los datos: ", error);
            
            Swal.fire({
                title: 'Error',
                text: `Error al procesar la solicitud: ${error.message}`,
                icon: 'error'
            });
        }
    });

    //Creacion de usuario
    let altaUser_container = document.getElementById('altaUsers-container')

    altaUser_container.addEventListener("submit", async (event) => {
        event.preventDefault();

        let formData = new FormData(event.target);

        let data = Object.fromEntries(formData.entries());

        try{
            let response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            });
            console.log(response);

            if(response.ok){
                console.log(response);

                let result = await response.json();
                await Swal.fire({
                        title: '¡Usuario Creado!',
                        text: result.message,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    // Limpiar el formulario si funciona
                    event.target.reset();
            }else {
                    // Si el servidor responde con error mostramos el mensaje
                    let result = await response.json();
                    throw new Error(result.message || "Error desconocido");
                }

        }catch(error){
            console.error("Error al enviar los datos: ", error);
            Swal.fire({
                    title: 'Error',
                    text: `Error al procesar la solicitud: ${error.message || ''}`,
                    icon: 'error'
                });
        }
    })
});