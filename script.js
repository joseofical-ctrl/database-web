document.addEventListener('DOMContentLoaded', () => {

    const loginSection = document.getElementById('loginSection');
    const uploadSection = document.getElementById('uploadSection');
    const loginForm = document.getElementById('loginForm');
    const uploadForm = document.getElementById('uploadForm');
    const btnLogout = document.getElementById('btnLogout');
    const tasksList = document.getElementById('tasksList');
    const btnVerTodo = document.getElementById('btnVerTodo');

    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const btnCancelEdit = document.getElementById('btnCancelEdit');

    const viewDocsModal = document.getElementById('viewDocsModal');
    const btnCloseDocs = document.getElementById('btnCloseDocs');
    const docsListContainer = document.getElementById('docsListContainer');

    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');

    let usuarioAutenticado = false;
    let entregasGlobales = [];
    let filtroUnidad = null;

    const API_URL = 'https://api-database-59ai.onrender.com';

    // ==========================================
    // 0. MAPEO DE UNIDADES Y SEMANAS (EVITA ERRORES)
    // ==========================================
    const semanasPorUnidad = {
        "Unidad I": [1, 2, 3, 4],
        "Unidad II": [5, 6, 7, 8],
        "Unidad III": [9, 10, 11, 12],
        "Unidad IV": [13, 14, 15, 16]
    };

    function configurarSelectores(unitSelectId, weekSelectId) {
        const unitSelect = document.getElementById(unitSelectId);
        const weekSelect = document.getElementById(weekSelectId);

        if (!unitSelect || !weekSelect) return;

        unitSelect.addEventListener('change', () => {
            const unidad = unitSelect.value;
            weekSelect.innerHTML = '<option value="" disabled selected>Elige Sem...</option>';

            if (unidad && semanasPorUnidad[unidad]) {
                semanasPorUnidad[unidad].forEach(num => {
                    const option = document.createElement('option');
                    option.value = `Semana ${num}`;
                    option.textContent = `Semana ${num}`;
                    weekSelect.appendChild(option);
                });
                weekSelect.disabled = false;
            } else {
                weekSelect.disabled = true;
            }
        });
    }

    configurarSelectores('unitSelect', 'weekSelect');
    configurarSelectores('editUnitSelect', 'editWeekSelect');

    // ==========================================
    // 1. CARGAR Y RENDERIZAR DATOS
    // ==========================================
    async function cargarHistorial() {
        if (!tasksList) return;
        try {
            const respuesta = await fetch(`${API_URL}/api/entregas`);
            entregasGlobales = await respuesta.json();
            renderTareas();
        } catch (error) {
            console.error('Error al cargar historial:', error);
            tasksList.innerHTML = '<p class="empty-docs">Error al conectar con el servidor.</p>';
        }
    }

    function renderTareas() {
        tasksList.innerHTML = '';

        let entregasFiltradas = filtroUnidad
            ? entregasGlobales.filter(e => e.unidad_semana.startsWith(filtroUnidad))
            : [...entregasGlobales];

        entregasFiltradas.sort((a, b) => {
            const matchA = a.unidad_semana.match(/Semana (\d+)/);
            const matchB = b.unidad_semana.match(/Semana (\d+)/);
            const numA = matchA ? parseInt(matchA[1]) : 0;
            const numB = matchB ? parseInt(matchB[1]) : 0;
            return numA - numB;
        });

        if (entregasFiltradas.length === 0) {
            const msj = filtroUnidad ? `No hay trabajos registrados para la ${filtroUnidad}.` : 'No hay trabajos registrados en la base de datos.';
            tasksList.innerHTML = `<p class="empty-docs">${msj}</p>`;
            return;
        }

        entregasFiltradas.forEach(entrega => {
            const fecha = new Date(entrega.fecha_subida).toLocaleDateString();
            const urls = entrega.nombre_archivo ? entrega.nombre_archivo.split(',') : [];
            const nombresCortos = urls.map(url => url.split('/').pop().trim()).join(', ');

            let botonesAccion = `
                <button class="btn-link btn-view-docs" data-files="${entrega.nombre_archivo}">
                    🔗 Ver Documentos
                </button>
            `;

            if (usuarioAutenticado) {
                botonesAccion += `
                    <button class="btn-link btn-edit btn-action-edit" data-id="${entrega.id}" data-week="${entrega.unidad_semana}" data-title="${entrega.titulo}">
                        ✏️ Editar
                    </button>
                    <button class="btn-link btn-delete btn-action-delete" data-id="${entrega.id}">
                        🗑️ Eliminar
                    </button>
                `;
            }

            const taskHTML = `
                <div class="glass-panel task-card task-card-anim">
                    <div class="task-header">
                        <div>
                            <span class="task-week">${entrega.unidad_semana}</span>
                            <h3 class="task-title">${entrega.titulo}</h3>
                            <p class="task-desc">
                                Subido el: ${fecha}<br>
                                <span class="task-file-info" style="display:inline-block; margin-top:6px; background: rgba(59, 130, 246, 0.1); padding: 4px 8px; border-radius: 4px;">
                                    📄 ${nombresCortos} (${entrega.peso_mb || '0'} MB)
                                </span>
                            </p>
                        </div>
                        <span class="status-badge status-badge-registered">Registrado</span>
                    </div>
                    <div class="task-links task-actions">
                        ${botonesAccion}
                    </div>
                </div>
            `;
            tasksList.insertAdjacentHTML('beforeend', taskHTML);
        });

        asignarEventosVerDocumentos();
        if (usuarioAutenticado) {
            asignarEventosEdicion();
            asignarEventosEliminar();
        }
    }

    // ==========================================
    // 2. LÓGICA DE FILTRADO INTERACTIVO
    // ==========================================
    document.querySelectorAll('.filter-unit').forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('active-unit')) {
                card.classList.remove('active-unit');
                filtroUnidad = null;
                btnVerTodo.style.display = 'none';
            } else {
                document.querySelectorAll('.filter-unit').forEach(c => c.classList.remove('active-unit'));
                card.classList.add('active-unit');
                filtroUnidad = card.getAttribute('data-unit');
                btnVerTodo.style.display = 'block';
            }

            const unitSelect = document.getElementById('unitSelect');
            if (unitSelect) {
                if (filtroUnidad) {
                    unitSelect.value = filtroUnidad;
                } else {
                    unitSelect.value = "";
                }
                unitSelect.dispatchEvent(new Event('change'));
            }

            renderTareas();
            document.getElementById('historialContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if (btnVerTodo) {
        btnVerTodo.addEventListener('click', () => {
            document.querySelectorAll('.filter-unit').forEach(c => c.classList.remove('active-unit'));
            filtroUnidad = null;
            btnVerTodo.style.display = 'none';
            renderTareas();
        });
    }

    // ==========================================
    // 3. INICIO Y CIERRE DE SESIÓN
    // ==========================================
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const codigo = document.getElementById('codigo').value;
            const password = document.getElementById('password').value;

            try {
                const respuesta = await fetch(`${API_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ codigo: codigo, password: password })
                });
                const dataDelServidor = await respuesta.json();

                if (respuesta.ok && dataDelServidor.success) {
                    loginSection.classList.add('hidden');
                    uploadSection.classList.remove('hidden');
                    usuarioAutenticado = true;
                    loginForm.reset();
                    renderTareas();
                } else {
                    alert(`❌ ${dataDelServidor.mensaje}`);
                }
            } catch (error) {
                alert('No se pudo conectar al servidor Node.js.');
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            uploadSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
            usuarioAutenticado = false;
            renderTareas();
        });
    }

    // ==========================================
    // 4. PREVISUALIZACIÓN Y SUBIDA DE EVIDENCIAS
    // ==========================================
    if (fileInput && previewContainer) {
        fileInput.addEventListener('change', function () {
            previewContainer.innerHTML = '';
            Array.from(this.files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'preview-img';
                        previewContainer.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const unitSelect = document.getElementById('unitSelect');
            const weekSelect = document.getElementById('weekSelect');

            if (!unitSelect.value || !weekSelect.value) {
                return alert("Por favor, selecciona una Unidad y una Semana.");
            }

            const week = unitSelect.value + ' • ' + weekSelect.value;
            const title = document.getElementById('taskTitle').value;
            const files = Array.from(fileInput.files);

            if (files.length === 0) return alert("Por favor, selecciona al menos un archivo.");

            const formData = new FormData();
            formData.append('week', week);
            formData.append('title', title);
            files.forEach(file => formData.append('archivos', file));

            try {
                const respuesta = await fetch(`${API_URL}/api/entregas`, { method: 'POST', body: formData });
                if (respuesta.ok) {
                    uploadForm.reset();
                    if (previewContainer) previewContainer.innerHTML = '';
                    alert(`¡Éxito! Registrados y guardados en la nube: ${files.length} archivos.`);
                    cargarHistorial();
                } else {
                    const errorData = await respuesta.json();
                    alert('Hubo un error: ' + errorData.error);
                }
            } catch (error) { alert('No se pudo conectar al servidor. Verifica Node.js.'); }
        });
    }

    // ==========================================
    // 5. EDICIÓN, VISUALIZACIÓN Y ELIMINACIÓN
    // ==========================================
    function asignarEventosEdicion() {
        document.querySelectorAll('.btn-edit').forEach(boton => {
            boton.onclick = () => {
                const id = boton.getAttribute('data-id');
                const weekString = boton.getAttribute('data-week');
                const title = boton.getAttribute('data-title');

                const partes = weekString.split(' • ');
                const unidadDB = partes[0] ? partes[0].trim() : "";
                const semanaDB = partes[1] ? partes[1].trim() : "";

                document.getElementById('editId').value = id;
                document.getElementById('editTitle').value = title;

                const editUnitSelect = document.getElementById('editUnitSelect');
                editUnitSelect.value = unidadDB;
                editUnitSelect.dispatchEvent(new Event('change'));

                document.getElementById('editWeekSelect').value = semanaDB;

                if (document.getElementById('editFileInput')) document.getElementById('editFileInput').value = '';
                if (editModal) editModal.classList.remove('hidden');
            };
        });
    }

    if (btnCancelEdit) btnCancelEdit.onclick = () => editModal.classList.add('hidden');

    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editId').value;
            const nuevoWeek = document.getElementById('editUnitSelect').value + ' • ' + document.getElementById('editWeekSelect').value;
            const formData = new FormData();

            formData.append('week', nuevoWeek);
            formData.append('title', document.getElementById('editTitle').value);
            formData.append('keepOld', document.getElementById('keepOldFiles').checked);

            const editFileInput = document.getElementById('editFileInput');
            if (editFileInput && editFileInput.files.length > 0) {
                Array.from(editFileInput.files).forEach(file => formData.append('archivos', file));
            }

            try {
                const respuesta = await fetch(`${API_URL}/api/entregas/${id}`, { method: 'PUT', body: formData });
                if (respuesta.ok) {
                    editModal.classList.add('hidden');
                    alert('¡Trabajo actualizado correctamente!');
                    cargarHistorial();
                } else {
                    const errorData = await respuesta.json();
                    alert('Hubo un error: ' + errorData.error);
                }
            } catch (error) { alert('Error de conexión.'); }
        });
    }

    window.forzarDescarga = async function (url, nombreArchivo) {
        try {
            const response = await fetch(url);
            const blobUrl = window.URL.createObjectURL(await response.blob());
            const a = document.createElement('a');
            a.href = blobUrl; a.download = nombreArchivo;
            document.body.appendChild(a); a.click();
            a.remove(); window.URL.revokeObjectURL(blobUrl);
        } catch (error) { alert('Error de red al intentar descargar.'); }
    };

    function asignarEventosVerDocumentos() {
        document.querySelectorAll('.btn-view-docs').forEach(boton => {
            boton.addEventListener('click', () => {
                const archivosString = boton.getAttribute('data-files');
                docsListContainer.innerHTML = '';

                if (!archivosString || archivosString === 'null') {
                    docsListContainer.innerHTML = '<p class="empty-docs">No hay archivos adjuntos.</p>';
                } else {
                    archivosString.split(',').map(a => a.trim()).forEach((archivo, index) => {
                        const nombreCorto = archivo.split('/').pop();
                        const extension = nombreCorto.split('.').pop().toLowerCase();
                        let icono = '📄', botonesHTML = '', extraHTML = '';

                        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                            icono = '🖼️';
                            botonesHTML = `
                                <button class="btn-doc-action btn-doc-view" data-action="toggle-img" data-img-id="img-prev-${index}">👁️ Ver</button>
                                <button class="btn-doc-action btn-doc-download" data-action="download" data-url="${archivo}" data-name="${nombreCorto}">⬇️ Descargar</button>`;
                            extraHTML = `<img id="img-prev-${index}" src="${archivo}" class="hidden doc-img-preview" alt="Vista previa">`;
                        } else if (['pdf'].includes(extension)) {
                            icono = '📕';
                            botonesHTML = `<a href="${archivo}" target="_blank" class="btn-doc-link">Abrir PDF</a>`;
                        } else if (['zip', 'rar'].includes(extension)) {
                            icono = '📦';
                            botonesHTML = `<button class="btn-doc-action btn-doc-download" data-action="download-zip" data-url="${archivo}" data-name="${nombreCorto}">Descargar</button>`;
                        } else if (['doc', 'docx', 'xls', 'xlsx'].includes(extension)) {
                            icono = '📘';
                            botonesHTML = `<button class="btn-doc-action btn-doc-download" data-action="download-doc" data-url="${archivo}" data-name="${nombreCorto}">Descargar</button>`;
                        }

                        docsListContainer.insertAdjacentHTML('beforeend', `
                            <div class="doc-item">
                                <div class="doc-item-row">
                                    <div class="doc-item-info">
                                        <span class="doc-icon">${icono}</span>
                                        <span class="doc-name" title="${nombreCorto}">${nombreCorto}</span>
                                    </div>
                                    <div class="doc-actions">${botonesHTML}</div>
                                </div>
                                ${extraHTML}
                            </div>
                        `);
                    });
                }
                asignarEventosAccionesDocumentos();
                viewDocsModal.classList.remove('hidden');
            });
        });
    }

    function asignarEventosAccionesDocumentos() {
        document.querySelectorAll('.btn-doc-action').forEach(btn => {
            btn.onclick = (e) => {
                const action = e.target.getAttribute('data-action');
                if (action === 'toggle-img') {
                    document.getElementById(e.target.getAttribute('data-img-id')).classList.toggle('hidden');
                } else if (action.startsWith('download')) {
                    if (action === 'download-zip' && !confirm('¿Deseas descargar este archivo?')) return;
                    if (action === 'download-doc' && !confirm('¿Deseas descargar el documento?')) return;
                    forzarDescarga(e.target.getAttribute('data-url'), e.target.getAttribute('data-name'));
                }
            };
        });
    }

    if (btnCloseDocs) btnCloseDocs.addEventListener('click', () => viewDocsModal.classList.add('hidden'));

    function asignarEventosEliminar() {
        document.querySelectorAll('.btn-delete').forEach(boton => {
            boton.addEventListener('click', async () => {
                if (confirm("⚠️ ¿Eliminar este registro permanentemente de la Base de Datos?")) {
                    try {
                        const respuesta = await fetch(`${API_URL}/api/entregas/${boton.getAttribute('data-id')}`, { method: 'DELETE' });
                        if (respuesta.ok) {
                            alert('🗑️ Registro eliminado exitosamente.');
                            cargarHistorial();
                        } else alert('Error al intentar eliminar el registro.');
                    } catch (error) { alert('Error de conexión.'); }
                }
            });
        });
    }

    // INICIO
    cargarHistorial();

});