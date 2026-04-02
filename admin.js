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

  const dependenciaForm = document.getElementById("dependenciaForm");
  const dependenciaNombreInput = document.getElementById("dependenciaNombre");
  const dependenciaMessage = document.getElementById("dependenciaMessage");
  const cancelDependenciaEditBtn = document.getElementById("cancelDependenciaEdit");
  const dependenciasTableBody = document.getElementById("dependenciasTableBody");

  let editIndex = null;
  let dependenciaEditIndex = null;

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

  function mostrarMensajeRegistro(texto, color) {
    formMessage.style.color = color;
    formMessage.textContent = texto;
  }

  function mostrarMensajeDependencia(texto, color) {
    if (!dependenciaMessage) return;
    dependenciaMessage.style.color = color;
    dependenciaMessage.textContent = texto;
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

  function renderDependenciasTable() {
    if (!dependenciasTableBody) return;

    dependenciasTableBody.innerHTML = "";

    const dependenciasOrdenadas = dependencias
      .slice()
      .sort((a, b) => a.localeCompare(b, "es"));

    dependenciasOrdenadas.forEach((dependencia) => {
      const cantidad = registros.filter(
        (registro) => registro.dependencia === dependencia
      ).length;

      const realIndex = dependencias.findIndex((dep) => dep === dependencia);

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          <span class="dependency-name">${dependencia}</span>
        </td>
        <td>
          <span class="dependency-count">${cantidad}</span>
        </td>
        <td>
          <div class="row-actions">
            <button class="btn-row btn-dependency-edit" data-index="${realIndex}" data-action="edit-dependency">
              Editar
            </button>
            <button class="btn-row btn-dependency-delete" data-index="${realIndex}" data-action="delete-dependency">
              Eliminar
            </button>
          </div>
        </td>
      `;

      dependenciasTableBody.appendChild(row);
    });
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

  function resetDependenciaForm() {
    if (!dependenciaForm) return;
    dependenciaForm.reset();
    dependenciaEditIndex = null;
    mostrarMensajeDependencia("", "");
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

  function agregarDependenciaRapida() {
    if (!nuevaDependenciaInput) return;

    const nuevaDependencia = nuevaDependenciaInput.value.trim();

    if (!nuevaDependencia) {
      mostrarMensajeRegistro("Ingrese el nombre de la nueva dependencia.", "#dc2626");
      return;
    }

    const existe = dependencias.some(
      (dep) => normalizarTexto(dep) === normalizarTexto(nuevaDependencia)
    );

    if (existe) {
      mostrarMensajeRegistro("Esa dependencia ya existe.", "#dc2626");
      return;
    }

    dependencias.push(nuevaDependencia);
    guardarDependencias();
    renderDependencias();
    renderDependenciasTable();
    actualizarStats();

    dependenciaInput.value = nuevaDependencia;
    nuevaDependenciaInput.value = "";

    mostrarMensajeRegistro("Dependencia agregada correctamente.", "#15803d");
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
      mostrarMensajeRegistro("Complete todos los campos obligatorios.", "#dc2626");
      return;
    }

    const dependenciaExiste = dependencias.some(
      (dep) => normalizarTexto(dep) === normalizarTexto(nuevoRegistro.dependencia)
    );

    if (!dependenciaExiste) {
      dependencias.push(nuevoRegistro.dependencia);
      guardarDependencias();
      renderDependencias();
      renderDependenciasTable();
    }

    if (editIndex === null) {
      registros.push(nuevoRegistro);
      mostrarMensajeRegistro("Registro creado correctamente.", "#15803d");
    } else {
      registros[editIndex] = nuevoRegistro;
      mostrarMensajeRegistro("Registro actualizado correctamente.", "#15803d");
    }

    guardarRegistros();
    renderTable();
    renderDependenciasTable();
    resetForm();
  });

  if (dependenciaForm) {
    dependenciaForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombreDependencia = dependenciaNombreInput.value.trim();

      if (!nombreDependencia) {
        mostrarMensajeDependencia("Ingrese el nombre de la dependencia.", "#dc2626");
        return;
      }

      const existe = dependencias.some((dep, index) => {
        if (dependenciaEditIndex !== null && index === dependenciaEditIndex) return false;
        return normalizarTexto(dep) === normalizarTexto(nombreDependencia);
      });

      if (existe) {
        mostrarMensajeDependencia("Esa dependencia ya existe.", "#dc2626");
        return;
      }

      if (dependenciaEditIndex === null) {
        dependencias.push(nombreDependencia);
        mostrarMensajeDependencia("Dependencia creada correctamente.", "#15803d");
      } else {
        const anterior = dependencias[dependenciaEditIndex];
        dependencias[dependenciaEditIndex] = nombreDependencia;

        registros = registros.map((registro) =>
          registro.dependencia === anterior
            ? { ...registro, dependencia: nombreDependencia }
            : registro
        );

        guardarRegistros();
        mostrarMensajeDependencia("Dependencia actualizada correctamente.", "#15803d");
      }

      guardarDependencias();
      renderDependencias();
      renderDependenciasTable();
      renderTable();
      actualizarStats();
      resetDependenciaForm();
    });
  }

  cancelEditBtn.addEventListener("click", () => {
    resetForm();
  });

  if (cancelDependenciaEditBtn) {
    cancelDependenciaEditBtn.addEventListener("click", () => {
      resetDependenciaForm();
    });
  }

  tableBody.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    if (action === "edit") {
      editIndex = index;
      loadFormData(registros[index]);
      mostrarMensajeRegistro("Editando registro seleccionado.", "#1d4ed8");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (action === "toggle") {
      registros[index].estado =
        registros[index].estado === "Activo" ? "Inactivo" : "Activo";

      guardarRegistros();
      renderTable();

      mostrarMensajeRegistro("El estado del registro fue actualizado.", "#a16207");
    }

    if (action === "delete") {
      const confirmar = confirm("¿Está seguro de que desea eliminar este registro?");
      if (!confirmar) return;

      registros.splice(index, 1);
      guardarRegistros();
      renderTable();
      renderDependenciasTable();
      resetForm();

      mostrarMensajeRegistro("Registro eliminado correctamente.", "#dc2626");
    }
  });

  if (dependenciasTableBody) {
    dependenciasTableBody.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button) return;

      const index = Number(button.dataset.index);
      const action = button.dataset.action;
      const dependencia = dependencias[index];

      if (action === "edit-dependency") {
        dependenciaEditIndex = index;
        dependenciaNombreInput.value = dependencia;
        mostrarMensajeDependencia("Editando dependencia seleccionada.", "#1d4ed8");
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }

      if (action === "delete-dependency") {
        const enUso = registros.some((registro) => registro.dependencia === dependencia);

        if (enUso) {
          mostrarMensajeDependencia(
            "No se puede eliminar una dependencia que está asociada a registros.",
            "#dc2626"
          );
          return;
        }

        const confirmar = confirm(`¿Está seguro de eliminar la dependencia "${dependencia}"?`);
        if (!confirmar) return;

        dependencias.splice(index, 1);
        guardarDependencias();
        renderDependencias();
        renderDependenciasTable();
        actualizarStats();
        resetDependenciaForm();

        mostrarMensajeDependencia("Dependencia eliminada correctamente.", "#dc2626");
      }
    });
  }

  if (btnAddDependencia) {
    btnAddDependencia.addEventListener("click", () => {
      agregarDependenciaRapida();
    });
  }

  if (nuevaDependenciaInput) {
    nuevaDependenciaInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        agregarDependenciaRapida();
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
  renderDependenciasTable();
  renderTable();
});
