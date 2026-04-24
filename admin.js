document.addEventListener("DOMContentLoaded", () => {
  const rol = localStorage.getItem("usuarioRol");

  if (rol !== "admin") {
    window.location.href = "login.html";
    return;
  }

  const API_URL = "http://localhost:3000/api/admin";
  const API_DEP = "http://localhost:3000/api/dependencias";

  let registros = [];
  let dependencias = [];
  let editId = null;
  let dependenciaEditId = null;

  /* ===============================
     ELEMENTOS
  =============================== */

  const form = document.getElementById("adminForm");
  const tableBody = document.getElementById("adminTableBody");
  const searchInput = document.getElementById("searchInput");
  const cancelEditBtn = document.getElementById("cancelEdit");
  const logoutBtn = document.getElementById("logoutBtn");

  const nombreInput = document.getElementById("nombre");
  const tipoInput = document.getElementById("tipo");
  const dependenciaInput = document.getElementById("dependencia");
  const correoInput = document.getElementById("correo");
  const extensionInput = document.getElementById("extension");
  const oficinaInput = document.getElementById("oficina");
  const estadoInput = document.getElementById("estado");

  const dependenciaForm = document.getElementById("dependenciaForm");
  const dependenciaNombreInput = document.getElementById("dependenciaNombre");
  const dependenciaCiudadInput = document.getElementById("dependenciaCiudad");
  const dependenciaTipoInput = document.getElementById("dependenciaTipo");
  const dependenciaUbicacionInput = document.getElementById("dependenciaUbicacion");
  const dependenciaCorreoInput = document.getElementById("dependenciaCorreo");
  const dependenciasTableBody = document.getElementById("dependenciasTableBody");
  const cancelDependenciaEdit = document.getElementById("cancelDependenciaEdit");

  const statTotal = document.getElementById("statTotal");
  const statActivos = document.getElementById("statActivos");
  const statInactivos = document.getElementById("statInactivos");
  const statDependencias = document.getElementById("statDependencias");

  /* ===============================
     UTILIDADES
  =============================== */

  function texto(v) {
    return (v || "").toString().trim();
  }

  function nombreDependencia(dep) {
    return texto(dep.nombre_dependencia || dep.nombre || dep.dependencia);
  }

  function actualizarStats() {
    statTotal.textContent = registros.length;

    statActivos.textContent = registros.filter(
      r => texto(r.estado).toLowerCase() === "activo"
    ).length;

    statInactivos.textContent = registros.filter(
      r => texto(r.estado).toLowerCase() === "inactivo"
    ).length;

    statDependencias.textContent = dependencias.length;
  }

  function resetForm() {
    form.reset();
    editId = null;
  }

  function resetDependenciaForm() {
    if (dependenciaForm) dependenciaForm.reset();
    dependenciaEditId = null;
  }

  /* ===============================
     CARGAR DATOS
  =============================== */

  async function cargarRegistros() {
    const res = await fetch(API_URL);
    registros = await res.json();

    renderTable();
    renderDependenciasTable();
    actualizarStats();
  }

  async function cargarDependencias() {
    const res = await fetch(API_DEP);
    dependencias = await res.json();

    dependenciaInput.innerHTML =
      `<option value="">Seleccione</option>`;

    dependencias.forEach(dep => {
      dependenciaInput.innerHTML += `
        <option value="${nombreDependencia(dep)}">
          ${nombreDependencia(dep)}
        </option>
      `;
    });

    renderDependenciasTable();
    actualizarStats();
  }

  /* ===============================
     TABLA CONTACTOS
  =============================== */

  function renderTable() {
    const filtro = searchInput.value.toLowerCase();
    tableBody.innerHTML = "";

    registros
      .filter(r =>
        Object.values(r)
          .join(" ")
          .toLowerCase()
          .includes(filtro)
      )
      .forEach(r => {
        const nombreCompleto = texto(r.nombre);

        const cargoReal =
          texto(r.tipo || r.cargo);

        const badge =
          texto(r.estado).toLowerCase() === "activo"
            ? "badge badge-active"
            : "badge badge-inactive";

        tableBody.innerHTML += `
          <tr>
            <td>${nombreCompleto}</td>

            <td>${cargoReal}</td>

            <td>${texto(r.dependencia)}</td>

            <td>
              ${texto(r.correo)}<br>
              Ext: ${texto(r.extension)}
            </td>

            <td>
              <span class="${badge}">
                ${texto(r.estado)}
              </span>
            </td>

            <td>
              <button class="btn-row btn-edit" data-id="${r.id_contacto || r.id}">
                Editar
              </button>

              <button class="btn-row btn-delete" data-id="${r.id_contacto || r.id}">
                Eliminar
              </button>

              <button class="btn-row btn-disable" data-id="${r.id_contacto || r.id}">
                ${
                  texto(r.estado).toLowerCase() === "activo"
                    ? "Inactivar"
                    : "Activar"
                }
              </button>
            </td>
          </tr>
        `;
      });
  }

  /* ===============================
     GUARDAR CONTACTO
  =============================== */

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
      nombre: nombreInput.value.trim(),
      tipo: tipoInput.value.trim(),
      dependencia: dependenciaInput.value,
      correo: correoInput.value.trim(),
      extension: extensionInput.value.trim(),
      oficina: oficinaInput.value.trim(),
      estado: estadoInput.value
    };

    try {
      if (editId !== null) {
  await fetch(`${API_URL}/${editId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });
} else {
  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });
}

      resetForm();
      await cargarRegistros();

    } catch (error) {
      console.log(error);
      alert("Error guardando contacto");
    }
  });

  cancelEditBtn.addEventListener("click", resetForm);

  /* ===============================
     EVENTOS CONTACTOS
  =============================== */

  tableBody.addEventListener("click", async e => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    const registro = registros.find(
  r => Number(r.id_contacto || r.id) === Number(id)
);

    if (!registro) return;

    /* EDITAR */
    if (btn.classList.contains("btn-edit")) {
      editId = id;

      nombreInput.value = texto(registro.nombre);
      tipoInput.value = texto(registro.tipo || registro.cargo);
      dependenciaInput.value = texto(registro.dependencia);
      correoInput.value = texto(registro.correo);
      extensionInput.value = texto(registro.extension);
      oficinaInput.value = texto(registro.oficina);
      estadoInput.value = texto(registro.estado);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      return;
    }

    /* ELIMINAR */
    if (btn.classList.contains("btn-delete")) {
      if (!confirm("¿Eliminar contacto?")) return;

      await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      await cargarRegistros();
      return;
    }

    /* ACTIVAR / INACTIVAR */
    if (btn.classList.contains("btn-disable")) {
      const nuevoEstado =
        texto(registro.estado).toLowerCase() === "activo"
          ? "inactivo"
          : "activo";

      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: registro.nombre,
          tipo: registro.tipo || registro.cargo,
          dependencia: registro.dependencia,
          correo: registro.correo,
          extension: registro.extension,
          oficina: registro.oficina,
          estado: nuevoEstado
        })
      });

      await cargarRegistros();
    }
  });

  /* ===============================
     TABLA DEPENDENCIAS
  =============================== */

  function renderDependenciasTable() {
    if (!dependenciasTableBody) return;

    dependenciasTableBody.innerHTML = "";

    dependencias.forEach(dep => {
      const nombre = nombreDependencia(dep);

      const cantidad = registros.filter(
        r => texto(r.dependencia) === nombre
      ).length;

      dependenciasTableBody.innerHTML += `
        <tr>
          <td>${nombre}</td>
          <td>${cantidad}</td>
          <td>
            <button class="btn-row btn-edit-dep"
              data-id="${dep.id_dependencia}">
              Editar
            </button>

            <button class="btn-row btn-delete-dep"
              data-id="${dep.id_dependencia}">
              Eliminar
            </button>
          </td>
        </tr>
      `;
    });
  }

  dependenciasTableBody.addEventListener("click", async e => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    const dep = dependencias.find(
      d => Number(d.id_dependencia) === Number(id)
    );

    if (!dep) return;

    if (btn.classList.contains("btn-edit-dep")) {
      dependenciaEditId = id;

      dependenciaNombreInput.value = nombreDependencia(dep);
      dependenciaCiudadInput.value = texto(dep.ciudad);
      dependenciaTipoInput.value = texto(dep.tipo);
      dependenciaUbicacionInput.value = texto(dep.ubicacion);
      dependenciaCorreoInput.value = texto(dep.correo);

      return;
    }

    if (btn.classList.contains("btn-delete-dep")) {
      if (!confirm("¿Eliminar dependencia?")) return;

      await fetch(`${API_DEP}/${id}`, {
        method: "DELETE"
      });

      await cargarDependencias();
      await cargarRegistros();
    }
  });

  /* ===============================
     GUARDAR DEPENDENCIA
  =============================== */

  dependenciaForm.addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
      nombre_dependencia: dependenciaNombreInput.value.trim(),
      ciudad: dependenciaCiudadInput.value.trim(),
      tipo: dependenciaTipoInput.value.trim(),
      ubicacion: dependenciaUbicacionInput.value.trim(),
      correo: dependenciaCorreoInput.value.trim()
    };

    if (dependenciaEditId) {
      await fetch(`${API_DEP}/${dependenciaEditId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });
    } else {
      await fetch(API_DEP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });
    }

    resetDependenciaForm();
    await cargarDependencias();
  });

  cancelDependenciaEdit.addEventListener(
    "click",
    resetDependenciaForm
  );

  /* ===============================
     OTROS
  =============================== */

  searchInput.addEventListener("input", renderTable);

  logoutBtn.addEventListener("click", e => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "login.html";
  });

  /* ===============================
     INICIO
  =============================== */

  cargarDependencias();
  cargarRegistros();
});