// Variables globales
const titulo = document.getElementById("titulo");
const months = document.getElementById("month-list");
const form = document.getElementById("form-transaccion");
const totalDisponible = document.getElementById("total-disponible");
const totalIngresos = document.getElementById("total-ingresos");
const totalEgresos = document.getElementById("total-egresos");
const porcentajeEgresos = document.getElementById("porcentaje-egresos");
const listaIngresos = document.getElementById("lista-ingresos");
const listaEgresos = document.getElementById("lista-egresos");

const ingresos = [];
const egresos = [];

const obtenerMesActual = () => new Date().getMonth() + 1;
const obtenerAnioActual = () => new Date().getFullYear();

let mesSeleccionado = obtenerMesActual();
let anioSeleccionado = obtenerAnioActual();

// Función para cargar los meses en el Dropdown
const cargarMeses = () => {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const listaMeses = meses.map((nombre, i) => {
    return { nombre: nombre, numero: i + 1 };
  });

  months.innerHTML = listaMeses
    .map((t) => `<option value="${t.numero}">${t.nombre}</option>`)
    .join("");

  months.value = mesSeleccionado;
};

// Funciones para actualizar el título
const actualizarTitulo = () => {
  const nombreMes = months.options[months.selectedIndex].text;
  titulo.textContent = `Presupuesto de ${nombreMes} ${anioSeleccionado}`;
};

// Funciones para calcular y actualizar los totales
const actualizarTotales = () => {
  const sumaIngresos = ingresos
    .filter(t => t.mes === mesSeleccionado && t.anio === anioSeleccionado)
    .reduce((acc, t) => acc + t.monto, 0);

  const sumaEgresos = egresos
    .filter(t => t.mes === mesSeleccionado && t.anio === anioSeleccionado)
    .reduce((acc, t) => acc + t.monto, 0);

  const disponible = sumaIngresos - sumaEgresos;

  totalDisponible.textContent = disponible.toFixed(2);
  totalIngresos.textContent = sumaIngresos.toFixed(2);
  totalEgresos.textContent = sumaEgresos.toFixed(2);
  porcentajeEgresos.textContent =
    sumaIngresos > 0 ? ((sumaEgresos * 100) / sumaIngresos).toFixed(0) : 0;

  // Cambiar color según signo del disponible
  if (disponible > 0) {
    totalDisponible.style.color = "green";
  } else if (disponible < 0) {
    totalDisponible.style.color = "red";
  } else {
    totalDisponible.style.color = "black";
  }
};

// Función para renderizar las transacciones de ingresos y egresos
const renderTransacciones = () => {
  const ingresosFiltrados = ingresos.filter(
    (t) => t.mes === mesSeleccionado && t.anio === anioSeleccionado
  );
  const egresosFiltrados = egresos.filter(
    (t) => t.mes === mesSeleccionado && t.anio === anioSeleccionado
  );
  const totalMesIngresos = ingresosFiltrados.reduce(
    (acc, t) => acc + t.monto,
    0
  );

  listaIngresos.innerHTML = ingresosFiltrados
    .map(
      (t) =>
        `<div class='ingreso'><span>${
          t.descripcion
        }</span><span>+$${t.monto.toFixed(2)}</span></div>`
    )
    .join("");

  listaEgresos.innerHTML = egresosFiltrados
    .map((t) => {
      const porcentaje =
        totalMesIngresos > 0
          ? ((t.monto * 100) / totalMesIngresos).toFixed(0)
          : 0;
      return `<div class='egreso'><span>${
        t.descripcion
      }</span><span>-$${t.monto.toFixed(
        2
      )} <small>(${porcentaje}%)</small></span></div>`;
    })
    .join("");
};

// Función encargada de registrar transacciones
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const tipoInput = document.getElementById("tipo");
  const tipoSeleccionado = tipoInput.value;
  const descripcion = document.getElementById("descripcion").value.trim();
  const monto = parseFloat(document.getElementById("monto").value);

  if (!descripcion || isNaN(monto) || monto <= 0) return;

  const transaccion = {
    descripcion,
    monto,
    mes: parseInt(months.value),
    anio: anioSeleccionado,
  };

  tipoSeleccionado === "Ingreso"
    ? ingresos.push(transaccion)
    : egresos.push(transaccion);

  actualizarTotales();
  renderTransacciones();

  this.reset();
  tipoInput.value = tipoSeleccionado;
});

// Cambiar mes seleccionado
months.addEventListener("change", function () {
  mesSeleccionado = parseInt(this.value);
  actualizarTitulo();
  actualizarTotales();
  renderTransacciones();
});

// Inicialización
cargarMeses();
actualizarTitulo();
actualizarTotales();
renderTransacciones();
