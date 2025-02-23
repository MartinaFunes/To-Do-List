// Configuración global de Toastify
const toastOptions = {
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "#FFB74D",
    style: {
        borderRadius: "14px",
        border: "2px solid #FF9800",
    }
};

// Función para mostrar Toastify con configuración común
function mostrarToast(texto) {
    Toastify({
        ...toastOptions,
        text: texto,
    }).showToast();
}

// Constructor de tarea usando sintaxis de clase
class Tarea {
    constructor(texto) {
        this.texto = texto;
        this.completada = false;
    }
}

// Elementos del DOM
const inputBox = document.getElementById("input-box");
const listContenedor = document.getElementById("list-contenedor");

// LocalStorage
let tareas = [];

// Cargar tareas desde archivo JSON de forma asincrónica

async function cargarTareas() {
    try {
        const respuesta = await fetch("tareas.json");
        if (!respuesta.ok) {
            throw new Error('Error al cargar las tareas.');
        }
        tareas = await respuesta.json();
        actualizarLista();
        mostrarToast("Tareas cargadas correctamente.");
    } catch (error) {
        mostrarToast("Error al cargar las tareas.");
    }
}

// Agregar tarea
async function addTask() {
    if (inputBox.value.trim() === '') {
        mostrarToast("No se puede agregar una tarea vacía.");
        return;
    }

    setTimeout(async () => {
        try {
            let nuevaTarea = new Tarea(inputBox.value.trim());
            tareas.push(nuevaTarea);
            await actualizarLista();
            saveData();
            inputBox.value = "";
            mostrarToast("Tarea agregada correctamente.");
        } catch (error) {
            mostrarToast("Error al agregar la tarea.");
        }
    }, 50); 
}

// Guardar tareas
function saveData() {
    try {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    } catch (error) {
        mostrarToast("Error al guardar las tareas.");
    }
}

// Actualizar tareas (usando forEach)
async function actualizarLista() {
    try {
        listContenedor.innerHTML = ""; 
        tareas.forEach((tarea, index) => {
            let li = document.createElement("li");
            li.textContent = tarea.texto;
            if (tarea.completada) li.classList.add("checked");

            // Tarea completada
            li.addEventListener("click", () => toggleTarea(index));

            // Eliminar tarea
            let span = document.createElement("span");
            span.innerHTML = "\u00d7";
            span.addEventListener("click", (e) => {
                e.stopPropagation();
                eliminarTarea(index);
            });

            li.appendChild(span);
            listContenedor.appendChild(li); 
        });
    } catch (error) {
        mostrarToast("Error al actualizar la lista.");
    }
}

// Cambiar estado
function toggleTarea(index) {
    try {
        let tarea = tareas[index];
        if (tarea) {
            tarea.completada = !tarea.completada;
            actualizarLista();
            saveData();
            mostrarToast(tarea.completada ? "Tarea completada." : "Tarea marcada como pendiente.");
        }
    } catch (error) {
        mostrarToast("Error al cambiar el estado de la tarea.");
    }
}

// Eliminar tarea
function eliminarTarea(index) {
    try {
        tareas = tareas.filter((_, i) => i !== index);
        actualizarLista();
        saveData();
        mostrarToast("Tarea eliminada correctamente.");
    } catch (error) {
        mostrarToast("Error al eliminar la tarea.");
    }
}

// Cargar tareas al iniciar (asíncrono)
window.onload = async () => {
    await cargarTareas(); 
    setInterval(() => {   
        actualizarLista();
    }, 10000);
};

// Cargar tareas al iniciar
actualizarLista();
