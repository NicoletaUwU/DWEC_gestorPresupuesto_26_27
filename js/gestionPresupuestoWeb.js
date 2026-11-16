import * as gestionPresupuesto from "./gestionPresupuesto.js";

function mostrarDatoEnId(idElemento, valor) {
    const elemento = document.getElementById(idElemento);
    elemento.textContent = valor;
}

function mostrarGastoWeb(idElemento, gasto) {
    const contenedor = document.getElementById(idElemento);

    const divGasto = document.createElement("div");
    divGasto.classList.add("gasto");

    const divDescripcion = document.createElement("div");
    divDescripcion.classList.add("gasto-descripcion");
    divDescripcion.textContent = gasto.descripcion;
    divGasto.appendChild(divDescripcion);

    const divFecha = document.createElement("div");
    divFecha.classList.add("gasto-fecha");
    divFecha.textContent = new Date(gasto.fecha).toLocaleDateString("es-ES");
    divGasto.appendChild(divFecha);

    const divValor = document.createElement("div");
    divValor.classList.add("gasto-valor");
    divValor.textContent = gasto.valor;
    divGasto.appendChild(divValor);

    const divEtiquetas = document.createElement("div");
    divEtiquetas.classList.add("gasto-etiquetas");

    for (const etiqueta of gasto.etiquetas) {
        const spanEtiqueta = document.createElement("span");
        spanEtiqueta.classList.add("gasto-etiquetas-etiqueta");
        spanEtiqueta.textContent = etiqueta;

        const borrarEtiquetasHandle = new BorrarEtiquetasHandle();
        borrarEtiquetasHandle.gasto = gasto;
        borrarEtiquetasHandle.etiqueta = etiqueta;
        spanEtiqueta.addEventListener("click", borrarEtiquetasHandle);

        divEtiquetas.appendChild(spanEtiqueta);
    }

    divGasto.appendChild(divEtiquetas);

    const botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.classList.add("gasto-editar");
    botonEditar.textContent = "Editar";

    const editarHandle = new EditarHandle();
    editarHandle.gasto = gasto;
    botonEditar.addEventListener("click", editarHandle);

    divGasto.appendChild(botonEditar);

    const botonBorrar = document.createElement("button");
    botonBorrar.type = "button";
    botonBorrar.classList.add("gasto-borrar");
    botonBorrar.textContent = "Borrar";

    const borrarHandle = new BorrarHandle();
    borrarHandle.gasto = gasto;
    botonBorrar.addEventListener("click", borrarHandle);

    divGasto.appendChild(botonBorrar);
    contenedor.appendChild(divGasto);
}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {
    const contenedor = document.getElementById(idElemento);

    const divAgrupacion = document.createElement("div");
    divAgrupacion.classList.add("agrupacion");

    let nombrePeriodo;
    if (periodo === "dia") {
        nombrePeriodo = "día";
    } else if (periodo === "anyo") {
        nombrePeriodo = "año";
    } else {
        nombrePeriodo = "mes";
    }

    const titulo = document.createElement("h1");
    titulo.textContent = `Gastos agrupados por ${nombrePeriodo}`;
    divAgrupacion.appendChild(titulo);

    for (const [clave, valor] of Object.entries(agrup)) {
        const divDato = document.createElement("div");
        divDato.classList.add("agrupacion-dato");

        const spanClave = document.createElement("span");
        spanClave.classList.add("agrupacion-dato-clave");
        spanClave.textContent = clave;

        const spanValor = document.createElement("span");
        spanValor.classList.add("agrupacion-dato-valor");
        spanValor.textContent = valor;

        divDato.appendChild(spanClave);
        divDato.appendChild(spanValor);
        divAgrupacion.appendChild(divDato);
    }

    contenedor.appendChild(divAgrupacion);
}

function repintar() {
    mostrarDatoEnId("presupuesto", gestionPresupuesto.mostrarPresupuesto());
    mostrarDatoEnId("gastos-totales", gestionPresupuesto.calcularTotalGastos());
    mostrarDatoEnId("balance-total", gestionPresupuesto.calcularBalance());

    const listado = document.getElementById("listado-gastos-completo");
    listado.innerHTML = "";

    gestionPresupuesto.listarGastos().forEach(gasto => {
        mostrarGastoWeb("listado-gastos-completo", gasto);
    });
}

function actualizarPresupuestoWeb() {
    const nuevoPresupuesto = Number(prompt("Introduce el nuevo presupuesto:"));
    gestionPresupuesto.actualizarPresupuesto(nuevoPresupuesto);
    repintar();
}

function nuevoGastoWeb() {
    const descripcion = prompt("Introduce la descripción del gasto:");
    const valor = Number(prompt("Introduce el valor del gasto:"));
    const fecha = prompt("Introduce la fecha del gasto (yyyy-mm-dd):");
    const etiquetas = prompt("Introduce las etiquetas separadas por comas:").split(",");

    const gasto = new gestionPresupuesto.CrearGasto(descripcion, valor, fecha, ...etiquetas);
    gestionPresupuesto.anyadirGasto(gasto);

    repintar();
}

function fechaEnFormatoInternacional(fecha) {
    const fechaObj = new Date(fecha);
    const anyo = fechaObj.getFullYear();
    const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
    const dia = String(fechaObj.getDate()).padStart(2, "0");

    return `${anyo}-${mes}-${dia}`;
}

function EditarHandle() {
    this.handleEvent = function() {
        const descripcion = prompt("Introduce la descripción del gasto:", this.gasto.descripcion);
        const valor = Number(prompt("Introduce el valor del gasto:", this.gasto.valor));
        const fecha = prompt("Introduce la fecha del gasto (yyyy-mm-dd):", fechaEnFormatoInternacional(this.gasto.fecha));
        const etiquetas = prompt("Introduce las etiquetas separadas por comas:", this.gasto.etiquetas.join(",")).split(",");

        this.gasto.actualizarDescripcion(descripcion);
        this.gasto.actualizarValor(valor);
        this.gasto.actualizarFecha(fecha);
        this.gasto.anyadirEtiquetas(...etiquetas);

        repintar();
    };
}

function BorrarHandle() {
    this.handleEvent = function() {
        gestionPresupuesto.borrarGasto(this.gasto.id);
        repintar();
    };
}

function BorrarEtiquetasHandle() {
    this.handleEvent = function() {
        this.gasto.borrarEtiquetas(this.etiqueta);
        repintar();
    };
}

document.getElementById("actualizarpresupuesto").addEventListener("click", actualizarPresupuestoWeb);
document.getElementById("anyadirgasto").addEventListener("click", nuevoGastoWeb);

export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
    repintar,
    actualizarPresupuestoWeb,
    nuevoGastoWeb,
    EditarHandle,
    BorrarHandle,
    BorrarEtiquetasHandle
};
