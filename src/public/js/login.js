document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById("loginForm");

    formLogin.addEventListener('submit', async (e) => {
        try {
            e.preventDefault();

            const formData = new FormData(formLogin); // Convertir el formulario en un objeto iterable
            const userData = Object.fromEntries(formData); // Convertir a objeto plano

            const response = await fetch('http://localhost:8080/api/sessions/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
                credentials: "include" // Permitir el trabajo vía cookies
            });

            const data = await response.json();
            
            if (data?.message === "Usuario logueado correctamente") {
                // Almacenar el token en localStorage
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                // Notificación
                Toastify({
                    text: data.message,
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();

                // Redireccionar después de 3 segundos
                setTimeout(() => {
                    window.location.href = "http://localhost:8080/api/products";
                }, 3000);

            } else {
                console.log("Error en login:", data);
            }
        } catch (e) {
            console.error("Error en la solicitud:", e);
        }
    });
});
