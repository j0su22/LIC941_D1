const titulo = document.getElementById("titulo");
const totalDisponible = document.getElementById("total-disponible");
const totalIngresos = document.getElementById("total-ingresos");
const totalEgresos = document.getElementById("total-egresos");
const porcentajeEgresos = document.getElementById("porcentaje-egresos");
const listaIngresos = document.getElementById("lista-ingresos");
const listaEgresos = document.getElementById("lista-egresos");

const ingresos = [];
const egresos = [];

const actualizarTitulo = () => {
  const fecha = new Date();
  const opciones = { month: "long", year: "numeric" };
  titulo.textContent = `Presupuesto de ${fecha.toLocaleDateString(
    "es-ES",
    opciones
  )}`;
};

const actualizarTotales = () => {
  const sumaIngresos = ingresos.reduce((acc, t) => acc + t.monto, 0);
  const sumaEgresos = egresos.reduce((acc, t) => acc + t.monto, 0);
  totalIngresos.textContent = sumaIngresos.toFixed(2);
  totalEgresos.textContent = sumaEgresos.toFixed(2);
  totalDisponible.textContent = (sumaIngresos - sumaEgresos).toFixed(2);
  porcentajeEgresos.textContent =
    sumaIngresos > 0 ? ((sumaEgresos * 100) / sumaIngresos).toFixed(0) : 0;
};

const renderTransacciones = () => {
  listaIngresos.innerHTML = ingresos
    .map(
      (t) =>
        `<div class='ingreso'><span>${
          t.descripcion
        }</span><span>+$${t.monto.toFixed(2)}</span></div>`
    )
    .join("");
  listaEgresos.innerHTML = egresos
    .map((t) => {
      const porcentaje =
        ingresos.length > 0
          ? (
              (t.monto * 100) /
              ingresos.reduce((acc, t) => acc + t.monto, 0)
            ).toFixed(0)
          : 0;
      return `<div class='egreso'><span>${
        t.descripcion
      }</span><span>-$${t.monto.toFixed(
        2
      )} <small>(${porcentaje}%)</small></span></div>`;
    })
    .join("");
};

document
  .getElementById("form-transaccion")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const tipo = document.getElementById("tipo").value;
    const descripcion = document.getElementById("descripcion").value.trim();
    const monto = parseFloat(document.getElementById("monto").value);

    if (!descripcion || isNaN(monto) || monto <= 0) return;

    const transaccion = { descripcion, monto };
    tipo === "Ingreso" ? ingresos.push(transaccion) : egresos.push(transaccion);

    actualizarTotales();
    renderTransacciones();

    this.reset();
  });

actualizarTitulo();
