const people = [
  {
    nombre: "Thomas Angulo",
    categoria: "Docente",
    ciudad: "Sede Central Medellín",
    correo: "thomas.angulo@upb.edu.co",
    dependencia: "Facultad de Ingeniería de Sistemas",
    telefono: "+57 300 000 0000",
    imagen: "thomas.jpg"
  },
  {
    nombre: "Juan Hernandez",
    categoria: "Investigador",
    ciudad: "Seccional Bucaramanga",
    correo: "juan.hernandez@upb.edu.co",
    dependencia: "Centro de Investigación e Innovación",
    telefono: "+57 300 000 0000",
    imagen: "hernandez.jpg"
  },
  {
    nombre: "Juan Felipe",
    categoria: "Administrativo",
    ciudad: "Seccional Montería",
    correo: "juan.calvo@upb.edu.co",
    dependencia: "Dirección Administrativa",
    telefono: "+57 300 000 0000",
    imagen: "juan.jpg"
  },
  {
    nombre: "Santiago Figueroa",
    categoria: "Docente",
    ciudad: "Seccional Palmira",
    correo: "santiago.figueroa@upb.edu.co",
    dependencia: "Facultad de Ciencias Sociales",
    telefono: "+57 300 000 0000",
    imagen: "santiago.jpg"
  },
  {
    nombre: "Sandra Reyes",
    categoria: "Docente",
    ciudad: "Seccional Bucaramanga",
    correo: "sandra.reyes@upb.edu.co",
    dependencia: "Facultad de Ingeniería de Sistemas",
    telefono: "+57 300 000 0000",
    imagen: "sandra.jpg"
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

/* ===== MODAL ===== */
const modal = document.getElementById("detailModal");
const modalClose = document.getElementById("modalClose");
const modalOk = document.getElementById("modalOk");

const mNombre = document.getElementById("mNombre");
const mCiudad = document.getElementById("mCiudad");
const mCategoria = document.getElementById("mCategoria");
const mCorreo = document.getElementById("mCorreo");
const mDependencia = document.getElementById("mDependencia");
const mTelefono = document.getElementById("mTelefono");

function openModal(persona) {
  if (mNombre) mNombre.textContent = persona.nombre;
  if (mCiudad) mCiudad.textContent = persona.ciudad;
  if (mCategoria) mCategoria.textContent = persona.categoria;
  if (mCorreo) mCorreo.textContent = persona.correo;
  if (mDependencia) mDependencia.textContent = persona.dependencia;
  if (mTelefono) mTelefono.textContent = persona.telefono;

  if (modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
}

function closeModal() {
  if (modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
}

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalOk) modalOk.addEventListener("click", closeModal);

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ===== RENDER ===== */
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

/* ===== FILTROS ===== */
function applyFilters() {
  const text = (searchInput.value || "").trim().toLowerCase();
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

/* eventos */
btnSearch.addEventListener("click", applyFilters);
searchInput.addEventListener("input", applyFilters);
subcatSelect.addEventListener("change", applyFilters);
citySelect.addEventListener("change", applyFilters);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") applyFilters();
});

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
  subcatSelect.value = "Todas";
  citySelect.value = "Todas las Seccionales";
  selectedLetter = "";

  document.querySelectorAll(".alphabet a").forEach((x) => x.classList.remove("active"));

  render(people);
});

/* init */
render(people);
