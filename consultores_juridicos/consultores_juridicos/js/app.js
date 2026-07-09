// =======================
// REGISTRO DE CASO
// =======================
async function guardarCaso() {
    const promovente = document.getElementById('promovente')?.value.trim();
    const demandado = document.getElementById('demandado')?.value.trim();
    const juzgado = document.getElementById('juzgado')?.value.trim();
    const no_expediente = document.getElementById('no_expediente')?.value.trim();
    const municipio = document.getElementById('municipio')?.value;
    const archivoInput = document.getElementById('archivo');

    if (!promovente || !demandado || !juzgado || !municipio) {
        alert('Completa promovente, demandado, juzgado y municipio');
        return;
    }

    const formData = new FormData();
    formData.append('promovente', promovente);
    formData.append('demandado', demandado);
    formData.append('juzgado', juzgado);
    formData.append('no_expediente', no_expediente);
    formData.append('municipio', municipio);

    if (archivoInput?.files.length > 0) {
        formData.append('archivo', archivoInput.files[0]);
    }

    try {
        const res = await fetch('https://proyect-ale.onrender.com/api/casos', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
            alert(data.error || 'Error al guardar el caso');
            return;
        }
        alert('Registro guardado correctamente con ID: ' + data.id);
    } catch (err) {
        alert('Error de conexión con el servidor');
        console.error(err);
    }
}

function visualizarArchivo() {
    const archivoInput = document.getElementById('archivo');
    const visor = document.getElementById('visor');
    if (archivoInput?.files.length > 0) {
        const archivo = archivoInput.files[0];
        const url = URL.createObjectURL(archivo);
        visor.innerHTML = `<iframe src="${url}" width="100%" height="400px"></iframe>`;
    } else {
        alert('No se ha seleccionado ningún archivo');
    }
}

function eliminarArchivo() {
    const archivoInput = document.getElementById('archivo');
    if (archivoInput) archivoInput.value = "";
    const visor = document.getElementById('visor');
    if (visor) visor.innerHTML = "";
    alert('Archivo eliminado correctamente');
}

// =======================
// REGISTRO DE EXPEDIENTE
// =======================
async function guardarExpediente() {
    const nombre_completo = document.getElementById('nombre_completo')?.value.trim();
    const fecha = document.getElementById('fecha')?.value;
    const hora = document.getElementById('hora')?.value;
    const etiqueta = document.getElementById('etiqueta')?.value.trim();
    const asunto = document.getElementById('asunto')?.value.trim();

    if (!nombre_completo || !fecha || !hora || !etiqueta || !asunto) {
        alert('Completa todos los campos del expediente');
        return;
    }

    try {
        const res = await fetch('https://proyect-ale.onrender.com/api/expedientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_completo, fecha, hora, etiqueta, asunto })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
            alert(data.error || 'Error al guardar el expediente');
            return;
        }
        alert('Expediente guardado correctamente con ID: ' + data.id);
    } catch (err) {
        alert('Error de conexión con el servidor');
        console.error(err);
    }
}

// =======================
// SOLICITUD DE REGISTRO
// =======================
async function buscarPorNoExpediente() {
    const noExpediente = document.getElementById('expediente')?.value.trim();
    const resultado = document.getElementById('resultado');

    if (!noExpediente) {
        alert('Ingresa No. Expediente para buscar');
        return;
    }

    try {
        const res = await fetch('https://proyect-ale.onrender.com/api/casos?no_expediente=' + encodeURIComponent(noExpediente));
        const data = await res.json();

        if (!res.ok || !data.ok) {
            alert(data.error || 'Error al buscar');
            return;
        }

        if (!data.casos || data.casos.length === 0) {
            resultado.innerHTML = '<p>No se encontraron casos con ese No. Expediente.</p>';
            return;
        }

        const items = data.casos.map(c => {
            const archivo = c.archivo_path 
                ? `<a href="https://proyect-ale.onrender.com${c.archivo_path}" target="_blank">Ver archivo</a>` 
                : '';
            return `
                <div style="border:1px solid #000; padding:10px; margin:10px 0;">
                    <div><b>Promovente:</b> ${c.promovente}</div>
                    <div><b>Demandado:</b> ${c.demandado}</div>
                    <div><b>Juzgado:</b> ${c.juzgado}</div>
                    <div><b>Municipio:</b> ${c.municipio}</div>
                    <div><b>No. Expediente:</b> ${c.no_expediente || ''}</div>
                    <div>${archivo}</div>
                </div>
            `;
        }).join('');

        resultado.innerHTML = `<h2>Resultados (${data.count})</h2>` + items;
    } catch (err) {
        alert('Error de conexión con el servidor');
        console.error(err);
    }
}
