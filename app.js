document.addEventListener("DOMContentLoaded", () => {
  const resultsEl = document.getElementById("results");
  const counterEl = document.getElementById("counter");

  const searchInput = document.getElementById("searchInput");
  const btnSearch = document.getElementById("btnSearch");
  const btnReset = document.getElementById("btnReset");

  const subcatSelect = document.getElementById("subcatSelect");
  const citySelect = document.getElementById("citySelect");

  let selectedLetter = "";
  let dependencias = [];

  function normalizarTexto(valor) {
    return (valor || "").toString().trim().toLowerCase();
  }

  function obtenerImagen(d) {
    return d.imagen && d.imagen.trim() !== "" ? d.imagen : "user.jpg";
  }

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

      const imagen = obtenerImagen(d);

      card.innerHTML = `
        <img src="${imagen}" alt="${d.nombre || "Dependencia"}" onerror="this.src='user.jpg'">
        <div>
          <h3 class="name-link">${d.nombre || "Sin nombre"}</h3>
          <p><b>Ciudad:</b> ${d.ciudad || "Bucaramanga"}</p>
          <p><b>Tipo:</b> ${d.tipo || "No disponible"}</p>
          <p><b>Ubicación:</b> ${d.ubicacion || "No disponible"}</p>
          <p>${d.correo || "No disponible"}</p>
        </div>
      `;

      resultsEl.appendChild(card);
    });
  }

  function applyFilters() {
    const text = normalizarTexto(searchInput.value);
    const subcat = subcatSelect ? subcatSelect.value : "Todas";
    const city = citySelect ? citySelect.value : "Seccional Bucaramanga";

    const filtered = dependencias.filter((d) => {
      const nombre = normalizarTexto(d.nombre);
      const tipo = normalizarTexto(d.tipo);
      const correo = normalizarTexto(d.correo);
      const ubicacion = normalizarTexto(d.ubicacion);
      const ciudad = normalizarTexto(d.ciudad);

      const okText =
        text === "" ||
        nombre.includes(text) ||
        tipo.includes(text) ||
        correo.includes(text) ||
        ubicacion.includes(text);

      const okSub =
        !subcat ||
        subcat === "Todas" ||
        tipo === normalizarTexto(subcat);

      const okCity =
        !city ||
        city === "Seccional Bucaramanga" ||
        ciudad === normalizarTexto(city);

      const okLetter =
        selectedLetter === "" ||
        nombre.toUpperCase().startsWith(selectedLetter);

      return okText && okSub && okCity && okLetter;
    });

    render(filtered);
  }

  async function cargarDependencias() {
    try {
      const response = await fetch("http://localhost:3000/api/dependencias");

      if (!response.ok) {
        throw new Error("No se pudieron cargar las dependencias");
      }

      dependencias = await response.json();
      render(dependencias);
    } catch (error) {
      console.error("Error cargando dependencias:", error);
      resultsEl.innerHTML = `<p style="color:red;">Error al cargar las dependencias desde el backend.</p>`;
      counterEl.textContent = "Mostrando 0 dependencias";
    }
  }

  if (btnSearch) {
    btnSearch.addEventListener("click", applyFilters);
  }

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (subcatSelect) subcatSelect.value = "Todas";
      if (citySelect) citySelect.value = "Seccional Bucaramanga";
      selectedLetter = "";

      document.querySelectorAll(".alphabet a").forEach((x) => x.classList.remove("active"));
      render(dependencias);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") applyFilters();
    });
  }

  if (subcatSelect) {
    subcatSelect.addEventListener("change", applyFilters);
  }

  if (citySelect) {
    citySelect.addEventListener("change", applyFilters);
  }

  document.querySelectorAll(".alphabet a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      selectedLetter = a.textContent.trim();

      document.querySelectorAll(".alphabet a").forEach((x) => x.classList.remove("active"));
      a.classList.add("active");

      applyFilters();
    });
  });

  cargarDependencias();
});