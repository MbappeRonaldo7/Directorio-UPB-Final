/* ===================================== */
/* LOGIN.JS COMPLETO */
/* ===================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ============================= */
  /* ELEMENTOS */
  /* ============================= */

  const form = document.getElementById("loginForm");
  const usuario = document.getElementById("usuario");
  const password = document.getElementById("password");
  const mensaje = document.getElementById("mensaje");

  const togglePass = document.getElementById("togglePass");

  const panel = document.querySelector(".login-right");


  /* ============================= */
  /* MOSTRAR / OCULTAR PASSWORD */
  /* ============================= */

  if (togglePass) {
    togglePass.addEventListener("click", () => {

      if (password.type === "password") {
        password.type = "text";
        togglePass.textContent = "🙈";
      } else {
        password.type = "password";
        togglePass.textContent = "👁";
      }

    });
  }


  /* ============================= */
  /* SLIDER IMÁGENES DERECHA */
  /* ============================= */

  const imagenes = [
    "campus1.jpg",
    "campus3.jpg",
    
  ];

  let actual = 0;

  function cambiarImagen() {

    if (panel) {
      panel.style.backgroundImage = `url('${imagenes[actual]}')`;
    }

    actual++;

    if (actual >= imagenes.length) {
      actual = 0;
    }
  }

  cambiarImagen();

  setInterval(cambiarImagen, 5000);


  /* ============================= */
  /* LOGIN */
  /* ============================= */

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = usuario.value.trim();
    const pass = password.value.trim();

    mensaje.textContent = "";
    mensaje.style.color = "#dc2626";

    if (!user || !pass) {
      mensaje.textContent = "Complete todos los campos.";
      return;
    }

    try {

      const respuesta = await fetch("https://directorio-upb-final.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: user,
          password: pass
        })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        mensaje.textContent = data.mensaje || "Credenciales inválidas.";
        return;
      }

      /* Guardar sesión */

      localStorage.setItem("usuario", data.usuario);
      localStorage.setItem("usuarioRol", data.rol);

      mensaje.style.color = "#16a34a";
      mensaje.textContent = "Acceso correcto...";

      setTimeout(() => {

        if (data.rol === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "privado.html";
        }

      }, 900);

    } catch (error) {

      mensaje.textContent = "No se pudo conectar con el servidor.";

      console.error(error);
    }

  });

});