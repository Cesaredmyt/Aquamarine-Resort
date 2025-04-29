<<<<<<< HEAD
function mostrarCalendario(tipo) {
    const input = document.getElementById(`input${capitalizar(tipo)}`);
    if (input && input._flatpickr) {
        input.style.display = "block";
        input._flatpickr.open(); // compatible con todos los navegadores modernos
    }
}

let fechaEntradaSeleccionada = null; // Variable global

function actualizarFecha(tipo, dateStr) {
    const span = document.getElementById(`fecha${capitalizar(tipo)}`);
    const input = document.getElementById(`input${capitalizar(tipo)}`);

    const partes = dateStr.split("-");
    const fechaFormateada = new Date(`${partes[0]}-${partes[1]}-${partes[2]}T00:00:00`);
    const opciones = {day: "2-digit", month: "long", year: "numeric"};
    span.innerText = fechaFormateada.toLocaleDateString("es-ES", opciones);
    input.style.display = "none";

    // 🧠 Si es fecha de entrada, actualizar variable y restricción de salida
    if (tipo === "entrada") {
        fechaEntradaSeleccionada = dateStr;
        if (window.flatSalida) {
            window.flatSalida.set("minDate", fechaEntradaSeleccionada);
        }
    }
}

// 👥 Mostrar y actualizar el número de personas
function mostrarSelectorPersonas() {
    const input = document.getElementById("inputPersonas");
    input.style.display = "block";
    input.focus();
}

function actualizarPersonas() {
    const input = document.getElementById("inputPersonas");
    const span = document.getElementById("personas");
    const valor = parseInt(input.value);
    if (!isNaN(valor) && valor > 0) {
        span.innerText = `${valor} ${valor === 1 ? "persona" : "personas"}`;
    }
    input.style.display = "none";
}

// Capitalizar primera letra
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function cerrarModal() {
    const modal = document.getElementById("modal-habitacion");
    modal.style.display = "none";
    document.querySelector(".modal-img-container").classList.remove("zoom-activo");
}

function ampliarImagen(container) {
    container.classList.toggle("zoom-activo");
}

// Modal placeholder (para después)
function abrirModalReserva() {
    const inputEntrada = document.getElementById("inputEntrada");
    const inputSalida = document.getElementById("inputSalida");

    // ✅ Verifica si las fechas están vacías
    if (!inputEntrada.value || !inputSalida.value) {
        Swal.fire({
            icon: "warning",
            title: "Fechas incompletas",
            text: "Por favor selecciona la fecha de entrada y salida antes de continuar.",
            confirmButtonColor: "#c8a97e",
            customClass: {
                popup: "swal-reserva",
            },
        });
        return;
    }

    // ✅ Si sí están seleccionadas, abrir el modal de datos
    Swal.fire({
        title: "Completa tu reservación",
        html: `
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre completo">
        <input type="email" id="correo" class="swal2-input" placeholder="Correo electrónico">
        <input type="text" id="habitacion" class="swal2-input" placeholder="Tipo de habitación (opcional)">
      `,
        confirmButtonText: "Confirmar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        focusConfirm: false,
        customClass: {
            popup: "swal-reserva",
        },
        preConfirm: () => {
            const nombre = document.getElementById("nombre").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const habitacion = document.getElementById("habitacion").value.trim();
            const fechaEntrada = inputEntrada.value;
            const fechaSalida = inputSalida.value;
            const personasTexto = document.getElementById("personas").innerText;
            const personas = parseInt(personasTexto);
            const fechaCreacion = (() => {
                const f = new Date();
                const pad = (n) => n.toString().padStart(2, "0");
                return `${f.getFullYear()}-${pad(f.getMonth() + 1)}-${pad(f.getDate())} ${pad(f.getHours())}:${pad(
                    f.getMinutes()
                )}:${pad(f.getSeconds())}`;
            })();

            if (!nombre || !correo) {
                Swal.showValidationMessage("Nombre y correo son obligatorios");
                return false;
            }

            return {
                nombre_cliente: nombre,
                email_cliente: correo,
                fecha_entrada: fechaEntrada,
                fecha_salida: fechaSalida,
                personas: personas,
                habitacion_tipo: habitacion,
                fecha_creacion: fechaCreacion,
            };
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const reservacion = result.value;

            fetch("procesar_reserva.php", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(reservacion),
            })
            .then((res) => res.json())
            .then((response) => {
                if (response.success) {
                    Swal.fire({
                        title: "¡Reservación confirmada!",
                        icon: "success",
                        html: `
                          <div style="font-family: 'Lato', sans-serif; font-size: 15px; text-align: left; line-height: 1.6;">
                            <p><i class="fa-solid fa-user"></i> <strong>Nombre:</strong> ${
                                reservacion.nombre_cliente
                            }</p>
                            <p><i class="fa-solid fa-envelope"></i> <strong>Email:</strong> ${
                                reservacion.email_cliente
                            }</p>
                            <p><i class="fa-solid fa-calendar-day"></i> <strong>Entrada:</strong> ${
                                reservacion.fecha_entrada
                            }</p>
                            <p><i class="fa-solid fa-calendar-check"></i> <strong>Salida:</strong> ${
                                reservacion.fecha_salida
                            }</p>
                            <p><i class="fa-solid fa-user-group"></i> <strong>Personas:</strong> ${
                                reservacion.personas
                            }</p>
                            <p><i class="fa-solid fa-bed"></i> <strong>Tipo de habitación:</strong> ${
                                reservacion.habitacion_tipo || "No especificada"
                            }</p>
                            <hr style="margin: 10px 0;" />
                            <p style="font-size: 13px;">📩 Recibirás un correo de confirmación con los detalles.</p>
                          </div>
                        `,
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#c8a97e",
                        customClass: {
                            popup: "swal-reserva",
                        },
                    });
                } else {
                    Swal.fire("Error", response.message, "error");
                }
            })
            .catch(() => {
                Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
            });
        }
    });
}

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    // 🛏️ Carrusel de habitaciones
    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");
    const roomsContainer = document.querySelector(".rooms-container");

    if (prevBtn && nextBtn && roomsContainer) {
        prevBtn.addEventListener("click", () => {
            roomsContainer.scrollBy({left: -320, behavior: "smooth"});
        });

        nextBtn.addEventListener("click", () => {
            roomsContainer.scrollBy({left: 320, behavior: "smooth"});
        });

        // 🔁 Auto-slide cada 5 segundos
        setInterval(() => {
            roomsContainer.scrollBy({left: 320, behavior: "smooth"});
        }, 5000);
    }

    // 🎉 Botones de evento
    document.querySelectorAll(".event-button").forEach((button) => {
        button.addEventListener("click", () => {
            alert("¡Te contactaremos con más información sobre el evento!");
        });
    });

    // 📅 Calendarios
    flatpickr("#inputEntrada", {
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function (selectedDates, dateStr) {
            actualizarFecha("entrada", dateStr);
        },
    });

    window.flatSalida = flatpickr("#inputSalida", {
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function (selectedDates, dateStr) {
            actualizarFecha("salida", dateStr);
        },
    });

    // 👥 Selector de personas
    const inputPersonas = document.getElementById("inputPersonas");
    if (inputPersonas) {
        inputPersonas.addEventListener("change", actualizarPersonas);
    }

    // 🧾 Detalles de habitación con SweetAlert
    window.verDetallesHabitacion = function (card) {
        const nombreHabitacion = card.dataset.nombre;
        const baños = card.dataset.baños;
        const camas = card.dataset.camas;
        const personas = parseInt(card.dataset.personas.replace(/\D/g, ""));
        const precio = card.dataset.precio;
        const servicios = card.dataset.servicios;

        Swal.fire({
            title: nombreHabitacion,
            html: `
              <div style="text-align: left; font-family: 'Lato', sans-serif; font-size: 15px; margin-bottom: 15px; line-height: 1.6;">
                <p><i class="fa-solid fa-bath"></i> <strong>Baños:</strong> ${baños}</p>
                <p><i class="fa-solid fa-bed"></i> <strong>Camas:</strong> ${camas}</p>
                <p><i class="fa-solid fa-user-group"></i> <strong>Capacidad máxima:</strong> ${personas} personas</p>
                <p><i class="fa-solid fa-spa"></i> <strong>Servicios:</strong> ${servicios}</p>
                <p><i class="fa-solid fa-tag"></i> <strong>Precio:</strong> ${precio}</p>
              </div>
              <input id="nombreReserva" class="swal2-input" placeholder="Tu nombre completo">
              <input id="emailReserva" class="swal2-input" placeholder="Correo electrónico">
              <input id="fechaEntradaReserva" class="swal2-input" placeholder="Fecha de entrada">
              <input id="fechaSalidaReserva" class="swal2-input" placeholder="Fecha de salida">
              <input id="personasReserva" class="swal2-input" type="number" placeholder="¿Cuántas personas?" min="1" max="${personas}">
            `,
            confirmButtonText: "Confirmar reserva",
            confirmButtonColor: "#c8a97e",
            showCloseButton: true,
            customClass: {
                popup: "swal-reserva",
            },
            didOpen: () => {
                const entradaPicker = flatpickr("#fechaEntradaReserva", {
                    minDate: "today",
                    dateFormat: "Y-m-d",
                    onChange: function (selectedDates, dateStr) {
                        salidaPicker.set("minDate", dateStr);
                    },
                });

                const salidaPicker = flatpickr("#fechaSalidaReserva", {
                    minDate: "today",
                    dateFormat: "Y-m-d",
                });
            },
            preConfirm: () => {
                const nombreCliente = document.getElementById("nombreReserva").value.trim();
                const email = document.getElementById("emailReserva").value.trim();
                const entrada = document.getElementById("fechaEntradaReserva").value;
                const salida = document.getElementById("fechaSalidaReserva").value;
                const cantidadRaw = document.getElementById("personasReserva").value.trim();
                const cantidad = parseInt(cantidadRaw);

                const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                const entradaDate = new Date(entrada);
                const salidaDate = new Date(salida);
                const fechasValidas = entrada && salida && salidaDate > entradaDate;

                if (!nombreCliente || !email || !entrada || !salida || !cantidadRaw) {
                    Swal.showValidationMessage("Todos los campos son obligatorios");
                    return false;
                }

                if (!emailValido) {
                    Swal.showValidationMessage("Correo electrónico no válido");
                    return false;
                }

                if (!fechasValidas) {
                    Swal.showValidationMessage("La fecha de salida debe ser posterior a la de entrada");
                    return false;
                }

                if (isNaN(cantidad) || cantidad < 1 || cantidad > personas) {
                    Swal.showValidationMessage(`Debes ingresar entre 1 y ${personas} personas`);
                    return false;
                }

                return {
                    nombreCliente,
                    email,
                    entrada,
                    salida,
                    cantidad,
                };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const {nombreCliente, email, entrada, salida, cantidad} = result.value;

                fetch("procesar_reserva.php", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        nombre_cliente: nombreCliente,
                        email_cliente: email,
                        fecha_entrada: entrada,
                        fecha_salida: salida,
                        personas: cantidad,
                        habitacion_tipo: nombreHabitacion,
                        fecha_creacion: new Date().toISOString().slice(0, 19).replace("T", " "),
                    }),
                })
                .then((res) => res.json())
                .then((response) => {
                    if (response.success) {
                        Swal.fire({
                            title: "¡Reservación confirmada!",
                            icon: "success",
                            html: `
                      <div style="font-family: 'Lato', sans-serif; font-size: 15px; text-align: left; line-height: 1.6;">
                        <p><i class="fa-solid fa-user"></i> <strong>Nombre:</strong> ${nombreCliente}</p>
                        <p><i class="fa-solid fa-envelope"></i> <strong>Email:</strong> ${email}</p>
                        <p><i class="fa-solid fa-calendar-day"></i> <strong>Entrada:</strong> ${entrada}</p>
                        <p><i class="fa-solid fa-calendar-check"></i> <strong>Salida:</strong> ${salida}</p>
                        <p><i class="fa-solid fa-user-group"></i> <strong>Personas:</strong> ${cantidad}</p>
                        <p><i class="fa-solid fa-bed"></i> <strong>Tipo de habitación:</strong> ${nombreHabitacion}</p>
                        <hr style="margin: 10px 0;" />
                        <p style="font-size: 13px;">📩 Recibirás un correo de confirmación con los detalles.</p>
                      </div>
                    `,
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#c8a97e",
                            customClass: {
                                popup: "swal-reserva",
                            },
                        });
                    } else {
                        Swal.fire("Error", response.message || "No se pudo guardar la reserva.", "error");
                    }
                })
                .catch(() => {
                    Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
                });
            }
        });
    };
});
=======
// Función para detectar y mostrar el icono correcto
function detectarSesion() {
    fetch('estado_sesion.php')
      .then(response => response.json())
      .then(data => {
        const usuarioNombre = document.getElementById("usuario-nombre");
        const usuarioCorreo = document.getElementById("usuario-correo");
        const usuarioMenu = document.getElementById("usuario-menu");
        const botonUsuario = document.getElementById("boton-usuario");
        const botonLogin = document.getElementById("boton-login");
  
        if (data.logueado) {
          if (usuarioNombre && usuarioCorreo) {
            // 🔥 Aquí forzamos que si no trae nombre, al menos diga 'Usuario'
            usuarioNombre.innerText = data.nombre ? data.nombre : "Usuario";
            usuarioCorreo.innerText = data.correo || "";
          }
          if (usuarioMenu && botonUsuario && botonLogin) {
            usuarioMenu.style.display = "none";
            botonUsuario.style.display = "flex";
            botonLogin.style.display = "none";
          }
        } else {
          if (botonUsuario && botonLogin) {
            botonUsuario.style.display = "none";
            botonLogin.style.display = "flex";
          }
        }
      })
      .catch(error => {
        console.error("Error detectando sesión:", error);
      });
  }
  
  

// Función para abrir o cerrar el menú de usuario
function configurarEventos() {
  const botonUsuario = document.getElementById("boton-usuario");
  const menuUsuario = document.getElementById("usuario-menu");
  const botonLogin = document.getElementById("boton-login");
  const cerrarSesionBtn = document.getElementById("cerrarSesion");

  if (botonUsuario && menuUsuario) {
    botonUsuario.addEventListener("click", () => {
      menuUsuario.style.display = (menuUsuario.style.display === "none") ? "block" : "none";
    });
  }

  if (botonLogin) {
    botonLogin.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      fetch('logout.php')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            window.location.href = "index.html";
          }
        })
        .catch(error => {
          console.error("Error cerrando sesión:", error);
        });
    });
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  detectarSesion();
  configurarEventos();
});


function mostrarCalendario(tipo) {
    const input = document.getElementById(`input${capitalizar(tipo)}`);
    if (input && input._flatpickr) {
        input.style.display = "block";
        input._flatpickr.open(); // compatible con todos los navegadores modernos
    }
}

let fechaEntradaSeleccionada = null; // Variable global

function actualizarFecha(tipo, dateStr) {
    const span = document.getElementById(`fecha${capitalizar(tipo)}`);
    const input = document.getElementById(`input${capitalizar(tipo)}`);

    const partes = dateStr.split("-");
    const fechaFormateada = new Date(`${partes[0]}-${partes[1]}-${partes[2]}T00:00:00`);
    const opciones = {day: "2-digit", month: "long", year: "numeric"};
    span.innerText = fechaFormateada.toLocaleDateString("es-ES", opciones);
    input.style.display = "none";

    // 🧠 Si es fecha de entrada, actualizar variable y restricción de salida
    if (tipo === "entrada") {
        fechaEntradaSeleccionada = dateStr;
        if (window.flatSalida) {
            window.flatSalida.set("minDate", fechaEntradaSeleccionada);
        }
    }
}

// 👥 Mostrar y actualizar el número de personas
function mostrarSelectorPersonas() {
    const input = document.getElementById("inputPersonas");
    input.style.display = "block";
    input.focus();
}

function actualizarPersonas() {
    const input = document.getElementById("inputPersonas");
    const span = document.getElementById("personas");
    const valor = parseInt(input.value);
    if (!isNaN(valor) && valor > 0) {
        span.innerText = `${valor} ${valor === 1 ? "persona" : "personas"}`;
    }
    input.style.display = "none";
}

// Capitalizar primera letra
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function cerrarModal() {
    const modal = document.getElementById("modal-habitacion");
    modal.style.display = "none";
    document.querySelector(".modal-img-container").classList.remove("zoom-activo");
}

function ampliarImagen(container) {
    container.classList.toggle("zoom-activo");
}

// Modal placeholder (para después)
function abrirModalReserva() {
    const inputEntrada = document.getElementById("inputEntrada");
    const inputSalida = document.getElementById("inputSalida");

    // ✅ Verifica si las fechas están vacías
    if (!inputEntrada.value || !inputSalida.value) {
        Swal.fire({
            icon: "warning",
            title: "Fechas incompletas",
            text: "Por favor selecciona la fecha de entrada y salida antes de continuar.",
            confirmButtonColor: "#c8a97e",
            customClass: {
                popup: "swal-reserva",
            },
        });
        return;
    }

    // ✅ Si sí están seleccionadas, abrir el modal de datos
    Swal.fire({
        title: "Completa tu reservación",
        html: `
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre completo">
        <input type="email" id="correo" class="swal2-input" placeholder="Correo electrónico">
        <input type="text" id="habitacion" class="swal2-input" placeholder="Tipo de habitación (opcional)">
      `,
        confirmButtonText: "Confirmar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        focusConfirm: false,
        customClass: {
            popup: "swal-reserva",
        },
        preConfirm: () => {
            const nombre = document.getElementById("nombre").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const habitacion = document.getElementById("habitacion").value.trim();
            const fechaEntrada = inputEntrada.value;
            const fechaSalida = inputSalida.value;
            const personasTexto = document.getElementById("personas").innerText;
            const personas = parseInt(personasTexto);
            const fechaCreacion = (() => {
                const f = new Date();
                const pad = (n) => n.toString().padStart(2, "0");
                return `${f.getFullYear()}-${pad(f.getMonth() + 1)}-${pad(f.getDate())} ${pad(f.getHours())}:${pad(
                    f.getMinutes()
                )}:${pad(f.getSeconds())}`;
            })();

            if (!nombre || !correo) {
                Swal.showValidationMessage("Nombre y correo son obligatorios");
                return false;
            }

            return {
                nombre_cliente: nombre,
                email_cliente: correo,
                fecha_entrada: fechaEntrada,
                fecha_salida: fechaSalida,
                personas: personas,
                habitacion_tipo: habitacion,
                fecha_creacion: fechaCreacion,
            };
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const reservacion = result.value;

            fetch("procesar_reserva.php", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(reservacion),
            })
            .then((res) => res.json())
            .then((response) => {
                if (response.success) {
                    Swal.fire({
                        title: "¡Reservación confirmada!",
                        icon: "success",
                        html: `
                          <div style="font-family: 'Lato', sans-serif; font-size: 15px; text-align: left; line-height: 1.6;">
                            <p><i class="fa-solid fa-user"></i> <strong>Nombre:</strong> ${
                                reservacion.nombre_cliente
                            }</p>
                            <p><i class="fa-solid fa-envelope"></i> <strong>Email:</strong> ${
                                reservacion.email_cliente
                            }</p>
                            <p><i class="fa-solid fa-calendar-day"></i> <strong>Entrada:</strong> ${
                                reservacion.fecha_entrada
                            }</p>
                            <p><i class="fa-solid fa-calendar-check"></i> <strong>Salida:</strong> ${
                                reservacion.fecha_salida
                            }</p>
                            <p><i class="fa-solid fa-user-group"></i> <strong>Personas:</strong> ${
                                reservacion.personas
                            }</p>
                            <p><i class="fa-solid fa-bed"></i> <strong>Tipo de habitación:</strong> ${
                                reservacion.habitacion_tipo || "No especificada"
                            }</p>
                            <hr style="margin: 10px 0;" />
                            <p style="font-size: 13px;">📩 Recibirás un correo de confirmación con los detalles.</p>
                          </div>
                        `,
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#c8a97e",
                        customClass: {
                            popup: "swal-reserva",
                        },
                    });
                } else {
                    Swal.fire("Error", response.message, "error");
                }
            })
            .catch(() => {
                Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
            });
        }
    });
}

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    // 🛏️ Carrusel de habitaciones
    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");
    const roomsContainer = document.querySelector(".rooms-container");

    if (prevBtn && nextBtn && roomsContainer) {
        prevBtn.addEventListener("click", () => {
            roomsContainer.scrollBy({left: -320, behavior: "smooth"});
        });

        nextBtn.addEventListener("click", () => {
            roomsContainer.scrollBy({left: 320, behavior: "smooth"});
        });

        // 🔁 Auto-slide cada 5 segundos
        setInterval(() => {
            roomsContainer.scrollBy({left: 320, behavior: "smooth"});
        }, 5000);
    }

    // 🎉 Botones de evento
    document.querySelectorAll(".event-button").forEach((button) => {
        button.addEventListener("click", () => {
            alert("¡Te contactaremos con más información sobre el evento!");
        });
    });

    // 📅 Calendarios
    flatpickr("#inputEntrada", {
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function (selectedDates, dateStr) {
            actualizarFecha("entrada", dateStr);
        },
    });

    window.flatSalida = flatpickr("#inputSalida", {
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function (selectedDates, dateStr) {
            actualizarFecha("salida", dateStr);
        },
    });

    // 👥 Selector de personas
    const inputPersonas = document.getElementById("inputPersonas");
    if (inputPersonas) {
        inputPersonas.addEventListener("change", actualizarPersonas);
    }

    // 🧾 Detalles de habitación con SweetAlert
    window.verDetallesHabitacion = function (card) {
        const nombreHabitacion = card.dataset.nombre;
        const baños = card.dataset.baños;
        const camas = card.dataset.camas;
        const personas = parseInt(card.dataset.personas.replace(/\D/g, ""));
        const precio = card.dataset.precio;
        const servicios = card.dataset.servicios;

        Swal.fire({
            title: nombreHabitacion,
            html: `
              <div style="text-align: left; font-family: 'Lato', sans-serif; font-size: 15px; margin-bottom: 15px; line-height: 1.6;">
                <p><i class="fa-solid fa-bath"></i> <strong>Baños:</strong> ${baños}</p>
                <p><i class="fa-solid fa-bed"></i> <strong>Camas:</strong> ${camas}</p>
                <p><i class="fa-solid fa-user-group"></i> <strong>Capacidad máxima:</strong> ${personas} personas</p>
                <p><i class="fa-solid fa-spa"></i> <strong>Servicios:</strong> ${servicios}</p>
                <p><i class="fa-solid fa-tag"></i> <strong>Precio:</strong> ${precio}</p>
              </div>
              <input id="nombreReserva" class="swal2-input" placeholder="Tu nombre completo">
              <input id="emailReserva" class="swal2-input" placeholder="Correo electrónico">
              <input id="fechaEntradaReserva" class="swal2-input" placeholder="Fecha de entrada">
              <input id="fechaSalidaReserva" class="swal2-input" placeholder="Fecha de salida">
              <input id="personasReserva" class="swal2-input" type="number" placeholder="¿Cuántas personas?" min="1" max="${personas}">
            `,
            confirmButtonText: "Confirmar reserva",
            confirmButtonColor: "#c8a97e",
            showCloseButton: true,
            customClass: {
                popup: "swal-reserva",
            },
            didOpen: () => {
                const entradaPicker = flatpickr("#fechaEntradaReserva", {
                    minDate: "today",
                    dateFormat: "Y-m-d",
                    onChange: function (selectedDates, dateStr) {
                        salidaPicker.set("minDate", dateStr);
                    },
                });

                const salidaPicker = flatpickr("#fechaSalidaReserva", {
                    minDate: "today",
                    dateFormat: "Y-m-d",
                });
            },
            preConfirm: () => {
                const nombreCliente = document.getElementById("nombreReserva").value.trim();
                const email = document.getElementById("emailReserva").value.trim();
                const entrada = document.getElementById("fechaEntradaReserva").value;
                const salida = document.getElementById("fechaSalidaReserva").value;
                const cantidadRaw = document.getElementById("personasReserva").value.trim();
                const cantidad = parseInt(cantidadRaw);

                const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                const entradaDate = new Date(entrada);
                const salidaDate = new Date(salida);
                const fechasValidas = entrada && salida && salidaDate > entradaDate;

                if (!nombreCliente || !email || !entrada || !salida || !cantidadRaw) {
                    Swal.showValidationMessage("Todos los campos son obligatorios");
                    return false;
                }

                if (!emailValido) {
                    Swal.showValidationMessage("Correo electrónico no válido");
                    return false;
                }

                if (!fechasValidas) {
                    Swal.showValidationMessage("La fecha de salida debe ser posterior a la de entrada");
                    return false;
                }

                if (isNaN(cantidad) || cantidad < 1 || cantidad > personas) {
                    Swal.showValidationMessage(`Debes ingresar entre 1 y ${personas} personas`);
                    return false;
                }

                return {
                    nombreCliente,
                    email,
                    entrada,
                    salida,
                    cantidad,
                };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const {nombreCliente, email, entrada, salida, cantidad} = result.value;

                fetch("procesar_reserva.php", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        nombre_cliente: nombreCliente,
                        email_cliente: email,
                        fecha_entrada: entrada,
                        fecha_salida: salida,
                        personas: cantidad,
                        habitacion_tipo: nombreHabitacion,
                        fecha_creacion: new Date().toISOString().slice(0, 19).replace("T", " "),
                    }),
                })
                .then((res) => res.json())
                .then((response) => {
                    if (response.success) {
                        Swal.fire({
                            title: "¡Reservación confirmada!",
                            icon: "success",
                            html: `
                      <div style="font-family: 'Lato', sans-serif; font-size: 15px; text-align: left; line-height: 1.6;">
                        <p><i class="fa-solid fa-user"></i> <strong>Nombre:</strong> ${nombreCliente}</p>
                        <p><i class="fa-solid fa-envelope"></i> <strong>Email:</strong> ${email}</p>
                        <p><i class="fa-solid fa-calendar-day"></i> <strong>Entrada:</strong> ${entrada}</p>
                        <p><i class="fa-solid fa-calendar-check"></i> <strong>Salida:</strong> ${salida}</p>
                        <p><i class="fa-solid fa-user-group"></i> <strong>Personas:</strong> ${cantidad}</p>
                        <p><i class="fa-solid fa-bed"></i> <strong>Tipo de habitación:</strong> ${nombreHabitacion}</p>
                        <hr style="margin: 10px 0;" />
                        <p style="font-size: 13px;">📩 Recibirás un correo de confirmación con los detalles.</p>
                      </div>
                    `,
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#c8a97e",
                            customClass: {
                                popup: "swal-reserva",
                            },
                        });
                    } else {
                        Swal.fire("Error", response.message || "No se pudo guardar la reserva.", "error");
                    }
                })
                .catch(() => {
                    Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
                });
            }
        });
    };
});
>>>>>>> 85d3458 (Subida inicial del login y funciones del sistema)
