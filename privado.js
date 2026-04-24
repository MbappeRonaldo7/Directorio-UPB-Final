document.addEventListener("DOMContentLoaded", () => {
  const rol = localStorage.getItem("usuarioRol");

  if (!rol) {
    window.location.href = "login.html";
    return;
  }

  const resultsEl = document.getElementById("resultsPrivado");
  const counterEl = document.getElementById("counterPrivado");
  const searchInput = document.getElementById("searchInputPrivado");
  const btnSearch = document.getElementById("btnSearchPrivado");
  const btnReset = document.getElementById("btnResetPrivado");
  const dependenciaSelect = document.getElementById("dependenciaSelect");
  const tipoSelect = document.getElementById("tipoSelect");

  /* CORREGIDO */
  const logoutBtn = document.getElementById("logoutBtnPrivado");

  let personas = [];

  /* CERRAR SESIÓN */
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "login.html";
    });
  }

  function texto(v) {
    return (v || "").toString().trim();
  }

  function nombreCompleto(p) {
    return `${texto(p.nombre)} ${texto(p.apellido)}`.trim();
  }

  function render(lista) {
    resultsEl.innerHTML = "";
    counterEl.textContent = `Mostrando ${lista.length} personas`;

    if (lista.length === 0) {
      resultsEl.innerHTML = "<p>No hay resultados.</p>";
      return;
    }

    lista.forEach((p) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${texto(p.imagen) || "user.jpg"}" onerror="this.src='user.jpg'">

        <div>
          <h3>${nombreCompleto(p)}</h3>
          <p><b>Cargo:</b> ${texto(p.cargo)}</p>
          <p><b>Dependencia:</b> ${texto(p.dependencia)}</p>
          <p><b>Correo:</b> ${texto(p.correo)}</p>
          <p><b>Oficina:</b> ${texto(p.oficina)}</p>
          <p><b>Extensión:</b> ${texto(p.extension)}</p>
          <p><b>Ciudad:</b> ${texto(p.ciudad)}</p>
          <p><b>Sede:</b> ${texto(p.sede)}</p>
        </div>
      `;

      resultsEl.appendChild(card);
    });
  }

  function llenarFiltros() {
    dependenciaSelect.innerHTML =
      `<option value="Todas">Todas</option>`;

    [...new Set(personas.map(p => p.dependencia))].forEach(dep => {
      dependenciaSelect.innerHTML += `
        <option value="${dep}">${dep}</option>
      `;
    });

    tipoSelect.innerHTML =
      `<option value="Todos">Todos</option>`;

    [...new Set(personas.map(p => p.cargo))].forEach(tipo => {
      tipoSelect.innerHTML += `
        <option value="${tipo}">${tipo}</option>
      `;
    });
  }

  function aplicarFiltros() {
    let lista = [...personas];

    const textoBuscado = searchInput.value.toLowerCase();
    const dep = dependenciaSelect.value;
    const tipo = tipoSelect.value;

    if (textoBuscado) {
      lista = lista.filter(p =>
        nombreCompleto(p).toLowerCase().includes(textoBuscado) ||
        texto(p.correo).toLowerCase().includes(textoBuscado)
      );
    }

    if (dep !== "Todas") {
      lista = lista.filter(p => p.dependencia === dep);
    }

    if (tipo !== "Todos") {
      lista = lista.filter(p => p.cargo === tipo);
    }

    render(lista);
  }

  btnSearch.addEventListener("click", aplicarFiltros);

  btnReset.addEventListener("click", () => {
    searchInput.value = "";
    dependenciaSelect.value = "Todas";
    tipoSelect.value = "Todos";
    render(personas);
  });

  searchInput.addEventListener("input", aplicarFiltros);
  dependenciaSelect.addEventListener("change", aplicarFiltros);
  tipoSelect.addEventListener("change", aplicarFiltros);

  async function iniciar() {
    try {
      const res = await fetch("http://localhost:3000/api/contactos");
      personas = await res.json();

      llenarFiltros();
      render(personas);

    } catch (error) {
      resultsEl.innerHTML = "<p>Error cargando contactos</p>";
    }
  }

  iniciar();
});