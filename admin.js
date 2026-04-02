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
  const searchInput = document.getElementById("searchInput");

  const nombreInput = document.getElementById("nombre");
  const tipoInput = document.getElementById("tipo");
  const dependenciaInput = document.getElementById("dependencia");
  const nuevaDependenciaInput = document.getElementById("nuevaDependencia");
  const btnAddDependencia = document.getElementById("btnAddDependencia");
  const correoInput = document.getElementById("correo");
  const extensionInput = document.getElementById("extension");
  const oficinaInput = document.getElementById("oficina");
  const estadoInput = document.getElementById("estado");

  const statTotal = document.getElementById("statTotal");
  const statActivos = document.getElementById("statActivos");
  const statInactivos = document.getElementById("statInactivos");
  const statDependencias = document.getElementById("statDependencias");

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

  let dependencias = JSON.parse(localStorage.getItem("dependenciasAdmin")) || [
    "Atención al estudiante",
    "Gestión académica",
    "Servicios financieros",
    "Soporte institucional",
    "Facultad"
  ];

  function guardarRegistros() {
    localStorage.setItem("registrosAdmin", JSON.stringify(registros));
  }

  function guardarDependencias() {
    localStorage.setItem("dependenciasAdmin", JSON.stringify(dependencias));
  }

  function normalizarTexto(texto) {
    return texto.trim().toLowerCase();
  }

  function renderDependencias() {
    if (!dependenciaInput) return;

    const valorActual = dependenciaInput.value;
    dependenciaInput.innerHTML = '<option value="">Seleccione</option>';

    dependencias
      .slice()
      .sort((a, b) => a.localeCompare(b, "es"))
      .forEach((dependencia) => {
        const option = document.createElement("option");
        option.value = dependencia;
        option.textContent = dependencia;
        dependenciaInput.appendChild(option);
      });

    if (valorActual && dependencias.includes(valorActual)) {
      dependenciaInput.value = valorActual;
    }
  }

  function actualizarStats() {
    const total = registros.length;
    const activos = registros.filter((r) => r.estado === "Activo").length;
    const inactivos = registros.filter((r) => r.estado === "Inactivo").length;
    const dependenciasUnicas = new Set([
      ...dependencias,
      ...registros.map((r) => r.dependencia)
    ]).size;

    if (statTotal) statTotal.textContent = total;
    if (statActivos) statActivos.textContent = activos;
    if (statInactivos) statInactivos.textContent = inactivos;
    if (statDependencias) statDependencias.textContent = dependenciasUnicas;
  }

  function getEstadoBadgeClass(estado) {
    return estado === "Activo" ? "badge badge-active" : "badge badge-inactive";
  }

  function renderTable() {
    tableBody.innerHTML = "";

    const filtro = searchInput ? searchInput.value.toLowerCase().trim() : "";

    registros.forEach((registro, index) => {
      const textoBusqueda = `
        ${registro.nombre}
        ${registro.tipo}
        ${registro.dependencia}
        ${registro.correo}
        ${registro.extension}
        ${registro.oficina}
        ${registro.estado}
      `.toLowerCase();

      if (!textoBusqueda.includes(filtro)) return;

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${registro.nombre}</td>
        <td>
          <span class="badge badge-type">${registro.tipo}</span>
        </td>
        <td>${registro.dependencia}</td>
        <td>
          ${registro.correo}
          <span class="cell-muted">Ext: ${registro.extension} | ${registro.oficina}</span>
        </td>
        <td>
          <span class="${getEstadoBadgeClass(registro.estado)}">${registro.estado}</span>
        </td>
        <td>
          <div class="row-actions">
            <button class="btn-row btn-edit" data-index="${index}" data-action="edit">Editar</button>
            <button class="btn-row btn-disable" data-index="${index}" data-action="toggle">
              ${registro.estado === "Activo" ? "Inactivar" : "Activar"}
            </button>
            <button class="btn-row btn-delete" data-index="${index}" data-action="delete">Eliminar</button>
          </div>
        </td>
      `;

      tableBody.appendChild(row);
    });

    actualizarStats();
  }

  function resetForm() {
    form.reset();
    editIndex = null;
    formMessage.textContent = "";
    formMessage.style.color = "";
    renderDependencias();
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

  function agregarDependencia() {
    if (!nuevaDependenciaInput) return;

    const nuevaDependencia = nuevaDependenciaInput.value.trim();

    if (!nuevaDependencia) {
      formMessage.style.color = "#dc2626";
      formMessage.textContent = "Ingrese el nombre de la nueva dependencia.";
      return;
    }

    const existe = dependencias.some(
      (dep) => normalizarTexto(dep) === normalizarTexto(nuevaDependencia)
    );

    if (existe) {
      formMessage.style.color = "#dc2626";
      formMessage.textContent = "Esa dependencia ya existe.";
      return;
    }

    dependencias.push(nuevaDependencia);
    guardarDependencias();
    renderDependencias();
    actualizarStats();

    dependenciaInput.value = nuevaDependencia;
    nuevaDependenciaInput.value = "";

    formMessage.style.color = "#15803d";
    formMessage.textContent = "Dependencia agregada correctamente.";
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

    if (
      !nuevoRegistro.nombre ||
      !nuevoRegistro.tipo ||
      !nuevoRegistro.dependencia ||
      !nuevoRegistro.correo ||
      !nuevoRegistro.extension ||
      !nuevoRegistro.oficina ||
      !nuevoRegistro.estado
    ) {
      formMessage.style.color = "#dc2626";
      formMessage.textContent = "Complete todos los campos obligatorios.";
      return;
    }

    const dependenciaExiste = dependencias.some(
      (dep) => normalizarTexto(dep) === normalizarTexto(nuevoRegistro.dependencia)
    );

    if (!dependenciaExiste) {
      dependencias.push(nuevoRegistro.dependencia);
      guardarDependencias();
      renderDependencias();
    }

    if (editIndex === null) {
      registros.push(nuevoRegistro);
      formMessage.style.color = "#15803d";
      formMessage.textContent = "Registro creado correctamente.";
    } else {
      registros[editIndex] = nuevoRegistro;
      formMessage.style.color = "#15803d";
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (action === "toggle") {
      registros[index].estado =
        registros[index].estado === "Activo" ? "Inactivo" : "Activo";

      guardarRegistros();
      renderTable();

      formMessage.style.color = "#a16207";
      formMessage.textContent = "El estado del registro fue actualizado.";
    }

    if (action === "delete") {
      const confirmar = confirm("¿Está seguro de que desea eliminar este registro?");
      if (!confirmar) return;

      registros.splice(index, 1);
      guardarRegistros();
      renderTable();
      resetForm();

      formMessage.style.color = "#dc2626";
      formMessage.textContent = "Registro eliminado correctamente.";
    }
  });

  if (btnAddDependencia) {
    btnAddDependencia.addEventListener("click", () => {
      agregarDependencia();
    });
  }

  if (nuevaDependenciaInput) {
    nuevaDependenciaInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        agregarDependencia();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderTable();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuarioRol");
      window.location.href = "login.html";
    });
  }

  guardarDependencias();
  guardarRegistros();
  renderDependencias();
  renderTable();
});
