document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();
  const mensaje = document.getElementById("mensaje");

  mensaje.textContent = "";

  if (usuario === "admin" && password === "1234") {
    mensaje.style.color = "green";
    mensaje.textContent = "Ingreso correcto (Admin)";

    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);

  } else if (usuario === "usuario" && password === "1234") {
    mensaje.style.color = "green";
    mensaje.textContent = "Ingreso correcto (Usuario)";

    setTimeout(() => {
      window.location.href = "privado.html";
    }, 1000);

  } else {
    mensaje.style.color = "red";
    mensaje.textContent = "Usuario o contraseña incorrectos";
  }
});
