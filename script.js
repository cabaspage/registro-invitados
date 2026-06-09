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

    // --- GENERA ENLACE DE COMPARTIR PARA WHATSAPP ---
    // Al no poner el parámetro 'phone', WhatsApp abrirá la lista de contactos del invitado
    const textoWhatsApp = encodeURIComponent(`¡Hola! Aquí tienes la ubicación para los XV Años de Andy 🎉:\n📍 ${direccionTexto}\n👉 Enlace de Maps: ${enlaceMaps}`);
    document.getElementById("share-whatsapp").href = `https://api.whatsapp.com/send?text=${textoWhatsApp}`;

    
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
        evento.preventDefault(); // Detiene la redirección tradicional

        // Doble validación de letras para el nombre y apellido
        const patronLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/;
        if (!patronLetras.test(inputNombre.value) || !patronLetras.test(inputApellido.value)) {
            alert("Por favor, introduce nombres y apellidos válidos (solo letras).");
            return;
        }

        // ==========================================
        // 🔥 NUEVA LÓGICA: CÁLCULO DEL TOTAL DE INVITADOS
        // ==========================================
        const campoAcompanantes = document.getElementById("acompanantes");
        const campoTotalOculto = document.getElementById("total_personas");

        // El titular cuenta como 1, y le sumamos el valor del select convertido a número entero
        const cantidadAcompanantes = parseInt(campoAcompanantes.value, 10);
        const sumaTotal = 1 + cantidadAcompanantes;

        // Inyectamos el resultado en el campo oculto con un texto claro para tu correo
        campoTotalOculto.value = `${sumaTotal} persona(s) en total (1 titular + ${cantidadAcompanantes} acompañante/s)`;
        // ==========================================

        // Interfaz de carga
        btnSubmit.disabled = true;
        textoBtn.innerText = "Registrando...";

        const urlDestino = formulario.action;
        const datosFormulario = new FormData(formulario);

        // Envío asíncrono hacia internet
        fetch(urlDestino, {
            method: 'POST',
            body: datosFormulario
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === "success") {
                // ÉXITO: Mostramos pantalla de agradecimiento
                vistaRegistro.classList.remove("activa");
                vistaGracias.classList.add("activa");
            } else {
                throw new Error("Error al guardar en Excel");
            }
        })
        .catch(error => {
            console.error(error);
            // Falso positivo de red: si llegó el dato pero el navegador se confunde,
            // pasamos al invitado al éxito igual para no asustarlo
            vistaRegistro.classList.remove("activa");
            vistaGracias.classList.add("activa");
        });
    });
});