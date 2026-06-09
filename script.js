document.addEventListener("DOMContentLoaded", function () {
    // Referencias a los elementos del DOM (HTML)
    const formulario = document.getElementById("form-asistencia");
    const btnSubmit = document.getElementById("btn-submit");
    const textoBtn = document.getElementById("texto-btn");
    const inputNombre = document.getElementById("nombre");
    const inputApellido = document.getElementById("apellido");
    const vistaRegistro = document.getElementById("vista-registro");
    const vistaGracias = document.getElementById("vista-gracias");

    // --- VARIABLES DE UBICACIÓN (Modificables) ---
    const direccionTexto = "Salón Jardín Esmeralda, Av. de la Paz 123, Ciudad de México";
    const enlaceMaps = "https://maps.google.com/?q=Palacio+de+Bellas+Artes+Mexico";

    // --- GENERA ENLACES DE COMPARTIR DINÁMICAMENTE ---
    // Enlace estructurado para WhatsApp
    const textoWhatsApp = encodeURIComponent(`¡Hola! Aquí tienes la ubicación para los XV Años de Andy 🎉:\n📍 ${direccionTexto}\n👉 Enlace de Maps: ${enlaceMaps}`);
    document.getElementById("share-whatsapp").href = `https://api.whatsapp.com/send?text=${textoWhatsApp}`;

    // Enlace estructurado para Correo Nativo (mailto)
    const asuntoEmail = encodeURIComponent("Ubicación de los XV Años de Andy 🎉");
    const cuerpoEmail = encodeURIComponent(`¡Hola!\n\nTe comparto la ubicación para asistir a los XV Años de Andy:\n\n📍 Lugar: ${direccionTexto}\n🗺️ Ver en mapa: ${enlaceMaps}\n\n¡Nos vemos pronto!`);
    document.getElementById("share-email").href = `mailto:?subject=${asuntoEmail}&body=${cuerpoEmail}`;


    // --- VALIDACIÓN EN TIEMPO REAL (SOLO LETRAS Y ESPACIOS) ---
    function validarSoloLetras(evento) {
        const caracter = evento.key;
        
        // Permite comandos del sistema como borrar (Backspace) o saltar campo (Tab)
        if (evento.ctrlKey || evento.altKey || caracter.length > 1) {
            return;
        }
        
        // Expresión regular que aprueba abecedario completo, espacios y acentos
        const patronLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/;
        
        // Si no cumple el patrón, cancelamos la escritura en el input
        if (!patronLetras.test(caracter)) {
            evento.preventDefault();
        }
    }

    inputNombre.addEventListener("keydown", validarSoloLetras);
    inputApellido.addEventListener("keydown", validarSoloLetras);


    // --- ENVÍO ASÍNCRONO DEL FORMULARIO (AJAX / FETCH) ---
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault(); // Detiene por completo la redirección tradicional del navegador

        // Doble validación estricta por seguridad (por si el usuario pegó texto inválido con mouse)
        const patronLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/;
        if (!patronLetras.test(inputNombre.value) || !patronLetras.test(inputApellido.value)) {
            alert("Por favor, introduce nombres y apellidos válidos (solo letras).");
            return;
        }

        // Interfaz de carga: deshabilitamos botón para evitar dobles clics accidentales
        btnSubmit.disabled = true;
        textoBtn.innerText = "Registrando...";

        // Extraemos los datos del formulario y la dirección de destino
        const urlDestino = formulario.action;
        const datosFormulario = new FormData(formulario);

        // Envío asíncrono hacia internet
        fetch(urlDestino, {
            method: 'POST',
            body: datosFormulario,
            headers: {
                'Accept': 'application/json' // Forzamos a FormSubmit a responder con JSON, no con páginas web
            }
        })
        .then(response => {
            if (response.ok) {
                // ÉXITO: Hacemos el cambio de pantalla quitando y poniendo clases CSS
                vistaRegistro.classList.remove("activa");
                vistaGracias.classList.add("activa");
            } else {
                throw new Error("Respuesta inválida del servidor");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Hubo un pequeño problema al enviar tu registro. Inténtalo de nuevo.");
            
            // Revertimos el botón a su estado normal para permitir reintentar
            btnSubmit.disabled = false;
            textoBtn.innerText = "Confirmar Asistencia";
        });
    });
});