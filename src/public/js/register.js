document.addEventListener('DOMContentLoaded', () => {
    const formRegister = document.getElementById("registerForm");

    formRegister.addEventListener('submit', async (e) => {
        try {
            e.preventDefault();
        
            const formData = new FormData(formRegister); // Consulto el HTML y lo transformo en un objeto iterator
            
            const userData = Object.fromEntries(formData); // Transformo un objeto iterator en un objeto simple
    
            const response = await fetch('http://localhost:8080/api/sessions/register', {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
                credentials: "include" // Permitir el trabajo vía cookies
            });

            const data = await response.json();
            
            if (data?.message === "Usuario registrado correctamente") {
                Toastify({
                    text: data.message,
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` o `bottom`
                    position: "right", // `left`, `center` o `right`
                    stopOnFocus: true, // Evita que el toast se cierre al hacer hover
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function() {} // Callback después de hacer clic
                }).showToast();

                setTimeout(() => {
                    window.location.href = "http://localhost:8080/api/sessions/viewlogin";
                }, 3000);

            } else {
                // Si hay un error (como correo duplicado), se maneja aquí
                Toastify({
                    text: data?.message || "Error al registrar el usuario",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #f44336, #e57373)", // Color de error
                    },
                    onClick: function() {}
                }).showToast();
            }

        } catch (e) {
            console.log(e);
            Toastify({
                text: "Ocurrió un error en el servidor. Inténtalo de nuevo más tarde.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #f44336, #e57373)", // Color de error
                },
                onClick: function() {}
            }).showToast();
        }
    });
});
