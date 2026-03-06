document.addEventListener("DOMContentLoaded", () => {
  const people = [
    {
      nombre: "Thomas Angulo",
      categoria: "Docente",
      ciudad: "Sede Central Medellín",
      correo: "thomas.angulo@upb.edu.co",
      dependencia: "Facultad de Ingeniería de Sistemas",
      telefono: "+57 300 000 0000",
      imagen: "thomas.jpeg"
    },
    {
      nombre: "Juan Hernandez",
      categoria: "Investigador",
      ciudad: "Seccional Bucaramanga",
      correo: "juan.hernandez@upb.edu.co",
      dependencia: "Centro de Investigación e Innovación",
      telefono: "+57 300 000 0000",
      imagen: "hernandez.jpeg"
    },
    {
      nombre: "Juan Felipe",
      categoria: "Administrativo",
      ciudad: "Seccional Montería",
      correo: "juan.calvo@upb.edu.co",
      dependencia: "Dirección Administrativa",
      telefono: "+57 300 000 0000",
      imagen: "juan.jpeg"
    },
    {
      nombre: "Santiago Figueroa",
      categoria: "Docente",
      ciudad: "Seccional Palmira",
      correo: "santiago.figueroa@upb.edu.co",
      dependencia: "Facultad de Ciencias Sociales",
      telefono: "+57 300 000 0000",
      imagen: "santiago.jpeg"
    },
    {
      nombre: "Sandra Reyes",
      categoria: "Docente",
      ciudad: "Seccional Bucaramanga",
      correo: "sandra.reyes@upb.edu.co",
      dependencia: "Facultad de Ingeniería de Sistemas",
      telefono: "+57 300 000 0000",
      imagen: "sandra.jpeg"
    }
  ];

  const resultsEl = document.getElementById("results");
  const counterEl = document.getElementById("counter");

  const searchInput = document.getElementById("searchInput");
  const btnSearch = document.getElementById("btnSearch");
  const btnReset = document.getElementById("btnReset");

  const subcatSelect = document.getElementById("subcatSelect");
  const citySelect = document.getElementById("citySelect");

  const modal = document.getElementById("detailModal");
  const modalClose = document.getElementById("modalClose");
  const modalOk = document.getElementById("modalOk");

  const mNombre = document.getElementById("mNombre");
  const mCiudad = document.getElementById("mCiudad");
  const mCategoria = document.getElementById("mCategoria");
  const mCorreo = document.getElementById("mCorreo");
  const mDependencia = document.getElementById("mDependencia");
  const mTelefono = document.getElementById("mTelefono");

  let selectedLetter = "";

  function openModal(persona) {
    mNombre.textContent = persona.nombre;
    mCiudad.textContent = persona.ciudad;
    mCategoria.textContent = persona.categoria;
    mCorreo.textContent = persona.correo;
    mDependencia.textContent = persona.dependencia;
    mTelefono.textContent = persona.telefono;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

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
        <img src="${p.imagen}" alt="${p.nombre}">
        <div>
          <a class="name-link" href="#">${p.nombre}</a>
          <p><b>${p.ciudad.replace("Seccional ", "")}</b></p>
          <p><b>Título:</b> ${p.categoria}</p>
          <p><b>Dependencia:</b> ${p.dependencia}</p>
          <p><b>Tel:</b> ${p.telefono}</p>
          <p>${p.correo}</p>
        </div>
      `;

      const link = card.querySelector(".name-link");
      link.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(p);
      });

      resultsEl.appendChild(card);
    });
  }

  function applyFilters() {
    const text = searchInput.value.trim().toLowerCase();
    const subcat = subcatSelect.value;
    const city = citySelect.value;

    const filtered = people.filter((p) => {
      const okText =
        text === "" ||
        p.nombre.toLowerCase().includes(text) ||
        p.correo.toLowerCase().includes(text) ||
        p.dependencia.toLowerCase().includes(text);

      const okSub = subcat === "Todas" || p.categoria === subcat;
      const okCity = city === "Todas las Seccionales" || p.ciudad === city;
      const okLetter =
        selectedLetter === "" || p.nombre.toUpperCase().startsWith(selectedLetter);

      return okText && okSub && okCity && okLetter;
    });

    render(filtered);
  }

  btnSearch.addEventListener("click", applyFilters);
  btnReset.addEventListener("click", () => {
    searchInput.value = "";
    subcatSelect.value = "Todas";
    citySelect.value = "Todas las Seccionales";
    selectedLetter = "";

    document.querySelectorAll(".alphabet a").forEach((x) => x.classList.remove("active"));
    render(people);
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

  modalClose.addEventListener("click", closeModal);
  modalOk.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  render(people);
});
