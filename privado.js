document.addEventListener("DOMContentLoaded", () => {
  const rol = localStorage.getItem("usuarioRol");

  if (rol !== "usuario" && rol !== "admin") {
    alert("Acceso no autorizado");
    window.location.href = "login.html";
    return;
  }

  const registrosAdmin = JSON.parse(localStorage.getItem("registrosAdmin"));

  const personas = registrosAdmin || [
    {
      nombre: "Thomas Angulo",
      tipo: "Docente",
      dependencia: "Facultad",
      correo: "thomas.angulo@upb.edu.co",
      extension: "1234",
      oficina: "Edificio A - 201",
      imagen: "thomas.jpeg"
    },
    {
      nombre: "Juan Hernandez",
      tipo: "Investigador",
      dependencia: "Soporte institucional",
      correo: "juan.hernandez@upb.edu.co",
      extension: "2231",
      oficina: "Edificio B - 104",
      imagen: "hernandez.jpeg"
    },
    {
      nombre: "Juan Felipe",
      tipo: "Administrativo",
      dependencia: "Servicios financieros",
      correo: "juan.calvo@upb.edu.co",
      extension: "3310",
      oficina: "Edificio C - 302",
      imagen: "juan.jpeg"
    },
    {
      nombre: "Santiago Figueroa",
      tipo: "Docente",
      dependencia: "Gestión académica",
      correo: "santiago.figueroa@upb.edu.co",
      extension: "1540",
      oficina: "Edificio D - 105",
      imagen: "santiago.jpeg"
    },
    {
      nombre: "Sandra Reyes",
      tipo: "Docente",
      dependencia: "Atención al estudiante",
      correo: "sandra.reyes@upb.edu.co",
      extension: "1288",
      oficina: "Edificio A - 210",
      imagen: "sandra.jpeg"
    }
  ];

  const personasActivas = personas.filter((p) => !p.estado || p.estado === "Activo");

  const resultsEl = document.getElementById("resultsPrivado");
  const counterEl = document.getElementById("counterPrivado");
  const searchInput = document.getElementById("searchInputPrivado");
  const btnSearch = document.getElementById("btnSearchPrivado");
  const btnReset = document.getElementById("btnResetPrivado");
  const dependenciaSelect = document.getElementById("dependenciaSelect");
  const tipoSelect = document.getElementById("tipoSelect");
  const logoutBtn = document.getElementById("logoutBtnPrivado");

  let selectedLetter = "";

  function render(list) {
    resultsEl.innerHTML = "";
    counterEl.textContent = `Mostrando ${list.length} personas`;

    if (list.length === 0) {
      resultsEl.innerHTML = `<p style="color:#6b7280;">No hay resultados.</p>`;
      return;
    }

    list.forEach((p) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div>
          <h3 class="name-link">${p.nombre}</h3>
          <p><b>Tipo:</b> ${p.tipo}</p>
          <p><b>Dependencia:</b> ${p.dependencia}</p>
          <p><b>Correo:</b> ${p.correo}</p>
          <p><b>Extensión:</b> ${p.extension}</p>
          <p><b>Oficina:</b> ${p.oficina}</p>
        </div>
      `;

      resultsEl.appendChild(card);
    });
  }

  function applyFilters() {
    const text = searchInput.value.trim().toLowerCase();
    const dependencia = dependenciaSelect.value;
    const tipo = tipoSelect.value;

    const filtered = personasActivas.filter((p) => {
      const okText =
        text === "" ||
        p.nombre.toLowerCase().includes(text) ||
        p.correo.toLowerCase().includes(text) ||
        p.dependencia.toLowerCase().includes(text) ||
        p.tipo.toLowerCase().includes(text) ||
        p.oficina.toLowerCase().includes(text);

      const okDependencia =
        dependencia === "Todas" || p.dependencia === dependencia;

      const okTipo =
        tipo === "Todos" || p.tipo === tipo;

      const okLetter =
        selectedLetter === "" ||
        p.nombre.toUpperCase().startsWith(selectedLetter);

      return okText && okDependencia && okTipo && okLetter;
    });

    render(filtered);
  }

  btnSearch.addEventListener("click", applyFilters);

  searchInput.addEventListener("input", applyFilters);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyFilters();
  });

  dependenciaSelect.addEventListener("change", applyFilters);
  tipoSelect.addEventListener("change", applyFilters);

  document.querySelectorAll(".alphabet a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      selectedLetter = a.textContent.trim();

      document.querySelectorAll(".alphabet a").forEach((x) => x.classList.remove("active"));
      a.classList.add("active");

      applyFilters();
    });
  });

  btnReset.addEventListener("click", () => {
    searchInput.value = "";
    dependenciaSelect.value = "Todas";
    tipoSelect.value = "Todos";
    selectedLetter = "";

    document.querySelectorAll(".alphabet a").forEach((x) => x.classList.remove("active"));
    render(personasActivas);
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuarioRol");
      window.location.href = "login.html";
    });
  }

  render(personasActivas);
});
