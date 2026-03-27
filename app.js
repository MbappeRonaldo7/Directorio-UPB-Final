document.addEventListener("DOMContentLoaded", () => {
  const dependencias = [
    {
      nombre: "Admisiones",
      tipo: "Atención al estudiante",
      ciudad: "Seccional Bucaramanga",
      correo: "admisiones.bga@upb.edu.co",
      ubicacion: "Campus Bucaramanga",
      imagen: "admisiones.jpg"
    },
    {
      nombre: "Registro y Control",
      tipo: "Gestión académica",
      ciudad: "Seccional Bucaramanga",
      correo: "registro.bga@upb.edu.co",
      ubicacion: "Campus Bucaramanga",
      imagen: "registro.jpg"
    },
    {
      nombre: "Ventanilla Financiera / Cartera",
      tipo: "Servicios financieros",
      ciudad: "Seccional Bucaramanga",
      correo: "cartera.bga@upb.edu.co",
      ubicacion: "Campus Bucaramanga",
      imagen: "cartera.jpg"
    },
    {
      nombre: "Soporte Tecnológico",
      tipo: "Soporte institucional",
      ciudad: "Seccional Bucaramanga",
      correo: "soporte.bga@upb.edu.co",
      ubicacion: "Campus Bucaramanga",
      imagen: "soporte.jpg"
    },
    {
      nombre: "Facultad de Ingeniería de Sistemas",
      tipo: "Facultad",
      ciudad: "Seccional Bucaramanga",
      correo: "ingenieriasistemas.bga@upb.edu.co",
      ubicacion: "Campus Bucaramanga",
      imagen: "sistemas.jpg"
    }
  ];

  const resultsEl = document.getElementById("results");
  const counterEl = document.getElementById("counter");

  const searchInput = document.getElementById("searchInput");
  const btnSearch = document.getElementById("btnSearch");
  const btnReset = document.getElementById("btnReset");

  const subcatSelect = document.getElementById("subcatSelect");
  const citySelect = document.getElementById("citySelect");

  let selectedLetter = "";

  function render(list) {
    resultsEl.innerHTML = "";
    counterEl.textContent = `Mostrando ${list.length} dependencias`;

    if (list.length === 0) {
      resultsEl.innerHTML = `<p style="color:#6b7280;">No hay resultados.</p>`;
      return;
    }

    list.forEach((d) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${d.imagen}" alt="${d.nombre}">
        <div>
          <h3 class="name-link">${d.nombre}</h3>
          <p><b>Bucaramanga</b></p>
          <p><b>Tipo:</b> ${d.tipo}</p>
          <p><b>Dependencia:</b> ${d.nombre}</p>
          <p><b>Ubicación:</b> ${d.ubicacion}</p>
          <p>${d.correo}</p>
        </div>
      `;

      resultsEl.appendChild(card);
    });
  }

  function applyFilters() {
    const text = searchInput.value.trim().toLowerCase();
    const subcat = subcatSelect.value;
    const city = citySelect.value;

    const filtered = dependencias.filter((d) => {
      const okText =
        text === "" ||
        d.nombre.toLowerCase().includes(text) ||
        d.correo.toLowerCase().includes(text) ||
        d.tipo.toLowerCase().includes(text) ||
        d.ubicacion.toLowerCase().includes(text);

      const okSub = subcat === "Todas" || d.tipo === subcat;
      const okCity = city === "Seccional Bucaramanga" || d.ciudad === city;
      const okLetter =
        selectedLetter === "" || d.nombre.toUpperCase().startsWith(selectedLetter);

      return okText && okSub && okCity && okLetter;
    });

    render(filtered);
  }

  btnSearch.addEventListener("click", applyFilters);

  btnReset.addEventListener("click", () => {
    searchInput.value = "";
    subcatSelect.value = "Todas";
    citySelect.value = "Seccional Bucaramanga";
    selectedLetter = "";

    document.querySelectorAll(".alphabet a").forEach((x) => x.classList.remove("active"));
    render(dependencias);
  });

  searchInput.addEventListener("input", applyFilters);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyFilters();
  });

  subcatSelect.addEventListener("change", applyFilters);
  citySelect.addEventListener("change", applyFilters);

  document.querySelectorAll(".alphabet a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      selectedLetter = a.textContent.trim();

      document.querySelectorAll(".alphabet a").forEach((x) => x.classList.remove("active"));
      a.classList.add("active");

      applyFilters();
    });
  });

  render(dependencias);
});
