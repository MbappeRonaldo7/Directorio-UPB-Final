document.addEventListener("DOMContentLoaded", () => {
  const rol = localStorage.getItem("usuarioRol");

  if (rol !== "admin") {
    alert("Acceso no autorizado");
    window.location.href = "login.html";
    return;
  }

  const form = document.getElementById("adminForm");
  const tableBody = document.getElementById("adminTableBody");
  const cancelEditBtn = document.getElementById("cancelEdit");
  const formMessage = document.getElementById("formMessage");
  const logoutBtn = document.getElementById("logoutBtn");

  const nombreInput = document.getElementById("nombre");
  const tipoInput = document.getElementById("tipo");
  const dependenciaInput = document.getElementById("dependencia");
  const correoInput = document.getElementById("correo");
  const extensionInput = document.getElementById("extension");
  const oficinaInput = document.getElementById("oficina");
  const estadoInput = document.getElementById("estado");

  let editIndex = null;

  let registros = JSON.parse(localStorage.getItem("registrosAdmin")) || [
    {
      nombre: "Thomas Angulo",
      tipo: "Docente",
      dependencia: "Facultad",
      correo: "thomas.angulo@upb.edu.co",
      extension: "1234",
      oficina: "Edificio A - 201",
      estado: "Activo"
    },
    {
      nombre: "Juan Hernandez",
      tipo: "Investigador",
      dependencia: "Soporte institucional",
      correo: "juan.hernandez@upb.edu.co",
      extension: "2231",
      oficina: "Edificio B - 104",
      estado: "Activo"
    },
    {
      nombre: "Juan Felipe",
      tipo: "Administrativo",
      dependencia: "Servicios financieros",
      correo: "juan.calvo@upb.edu.co",
      extension: "3310",
      oficina: "Edificio C - 302",
      estado: "Activo"
    },
    {
      nombre: "Santiago Figueroa",
      tipo: "Docente",
      dependencia: "Gestión académica",
      correo: "santiago.figueroa@upb.edu.co",
      extension: "1540",
      oficina: "Edificio D - 105",
      estado: "Activo"
    }
  ];

  function guardarRegistros() {
    localStorage.setItem("registrosAdmin", JSON.stringify(registros));
  }

  function renderTable() {
    tableBody.innerHTML = "";

    registros.forEach((registro, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${registro.nombre}</td>
        <td>${registro.tipo}</td>
        <td>${registro.dependencia}</td>
        <td>${registro.correo}<br><small>Ext: ${registro.extension} | ${registro.oficina}</small></td>
        <td class="${registro.estado === "Activo" ? "estado-activo" : "estado-inactivo"}">${registro.estado}</td>
        <td>
          <div class="table-buttons">
            <button class="mini-btn btn-edit" data-index="${index}" data-action="edit">Editar</button>
            <button class="mini-btn btn-toggle" data-index="${index}" data-action="toggle">
              ${registro.estado === "Activo" ? "Inactivar" : "Activar"}
            </button>
            <button class="mini-btn btn-delete" data-index="${index}" data-action="delete">Eliminar</button>
          </div>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  function resetForm() {
    form.reset();
    editIndex = null;
    formMessage.textContent = "";
  }

  function loadFormData(registro) {
    nombreInput.value = registro.nombre;
    tipoInput.value = registro.tipo;
    dependenciaInput.value = registro.dependencia;
    correoInput.value = registro.correo;
    extensionInput.value = registro.extension;
    oficinaInput.value = registro.oficina;
    estadoInput.value = registro.estado;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoRegistro = {
      nombre: nombreInput.value.trim(),
      tipo: tipoInput.value,
      dependencia: dependenciaInput.value,
      correo: correoInput.value.trim(),
      extension: extensionInput.value.trim(),
      oficina: oficinaInput.value.trim(),
      estado: estadoInput.value
    };

    if (editIndex === null) {
      registros.push(nuevoRegistro);
      formMessage.style.color = "green";
      formMessage.textContent = "Registro creado correctamente.";
    } else {
      registros[editIndex] = nuevoRegistro;
      formMessage.style.color = "green";
      formMessage.textContent = "Registro actualizado correctamente.";
    }

    guardarRegistros();
    renderTable();
    resetForm();
  });

  cancelEditBtn.addEventListener("click", () => {
    resetForm();
  });

  tableBody.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    if (action === "edit") {
      editIndex = index;
      loadFormData(registros[index]);
      formMessage.style.color = "#1d4ed8";
      formMessage.textContent = "Editando registro seleccionado.";
    }

    if (action === "toggle") {
      registros[index].estado = registros[index].estado === "Activo" ? "Inactivo" : "Activo";
      guardarRegistros();
      renderTable();
    }

    if (action === "delete") {
      registros.splice(index, 1);
      guardarRegistros();
      renderTable();
      resetForm();
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuarioRol");
      window.location.href = "login.html";
    });
  }

  guardarRegistros();
  renderTable();
});
