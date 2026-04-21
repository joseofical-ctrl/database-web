document.addEventListener('DOMContentLoaded', () => {
    
    const loginSection = document.getElementById('loginSection');
    const uploadSection = document.getElementById('uploadSection');
    
    const loginForm = document.getElementById('loginForm');
    const uploadForm = document.getElementById('uploadForm');
    const btnLogout = document.getElementById('btnLogout');
    const tasksList = document.getElementById('tasksList');

    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const btnCancelEdit = document.getElementById('btnCancelEdit');

    const viewDocsModal = document.getElementById('viewDocsModal');
    const btnCloseDocs = document.getElementById('btnCloseDocs');
    const docsListContainer = document.getElementById('docsListContainer');

    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');

    let usuarioAutenticado = false;

    // Constante para base URL
    const API_URL = 'https://api-database-59ai.onrender.com'; // Actualizado para producción directamente

    // ==========================================
    // 1. CARGAR DATOS DESDE POSTGRESQL (PÚBLICO Y PRIVADO)
    // ==========================================
    async function cargarHistorial() {
        if (!tasksList) return; 

        try {
            const respuesta = await fetch(`${API_URL}/api/entregas`); 
            const entregas = await respuesta.json();
            
            tasksList.innerHTML = ''; 

            entregas.forEach(entrega => {
                const fecha = new Date(entrega.fecha_subida).toLocaleDateString();

                // ¡NUEVO CLOUDINARY! - Limpiamos las URLs largas para que en la tarjeta principal solo se vean los nombres cortos
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
                                    <span class="task-file-info">
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

        } catch (error) {
            console.error('Error al cargar historial:', error);
        }
    }

    // ==========================================
    // 2. PREVISUALIZACIÓN DE IMÁGENES
    // ==========================================
    if (fileInput && previewContainer) {
        fileInput.addEventListener('change', function() {
            previewContainer.innerHTML = ''; 
            const files = Array.from(this.files);
            
            files.forEach(file => {
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
                    cargarHistorial();
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
            cargarHistorial();
        });
    }

    // ==========================================
    // 4. SUBIR MÚLTIPLES EVIDENCIAS
    // ==========================================
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const week = document.getElementById('weekSelect').value;
            const title = document.getElementById('taskTitle').value;
            const files = Array.from(fileInput.files);

            if (files.length === 0) {
                alert("Por favor, selecciona al menos un archivo.");
                return;
            }

            const formData = new FormData();
            formData.append('week', week);
            formData.append('title', title);
            files.forEach(file => formData.append('archivos', file)); 

            try {
                const respuesta = await fetch(`${API_URL}/api/entregas`, {
                    method: 'POST',
                    body: formData
                });

                if (respuesta.ok) {
                    uploadForm.reset();
                    if(previewContainer) previewContainer.innerHTML = '';
                    alert(`¡Éxito! Registrados y guardados en la nube: ${files.length} archivos.`);
                    cargarHistorial();
                } else {
                    const errorData = await respuesta.json();
                    alert('Hubo un error: ' + errorData.error);
                }
            } catch (error) {
                alert('No se pudo conectar al servidor. Verifica Node.js.');
            }
        });
    }

    // ==========================================
    // 5. LÓGICA DE EDICIÓN
    // ==========================================
    function asignarEventosEdicion() {
        document.querySelectorAll('.btn-edit').forEach(boton => {
            boton.onclick = () => {
                document.getElementById('editId').value = boton.getAttribute('data-id');
                document.getElementById('editWeekSelect').value = boton.getAttribute('data-week');
                document.getElementById('editTitle').value = boton.getAttribute('data-title');
                
                const editFileInput = document.getElementById('editFileInput');
                if(editFileInput) editFileInput.value = '';

                if(editModal) editModal.classList.remove('hidden');
            };
        });
    }

    if (btnCancelEdit) {
        btnCancelEdit.onclick = () => editModal.classList.add('hidden');
    }

    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editId').value;
            const nuevoWeek = document.getElementById('editWeekSelect').value;
            const nuevoTitle = document.getElementById('editTitle').value;
            const editFileInput = document.getElementById('editFileInput');
            const keepOldFiles = document.getElementById('keepOldFiles').checked;

            const formData = new FormData();
            formData.append('week', nuevoWeek);
            formData.append('title', nuevoTitle);
            formData.append('keepOld', keepOldFiles); 

            if (editFileInput && editFileInput.files.length > 0) {
                Array.from(editFileInput.files).forEach(file => {
                    formData.append('archivos', file); 
                });
            }

            try {
                const respuesta = await fetch(`${API_URL}/api/entregas/${id}`, {
                    method: 'PUT',
                    body: formData
                });

                if (respuesta.ok) {
                    editModal.classList.add('hidden');
                    alert('¡Trabajo actualizado correctamente!');
                    cargarHistorial();
                } else {
                    const errorData = await respuesta.json();
                    alert('Hubo un error: ' + errorData.error);
                }
            } catch (error) {
                alert('Error de conexión con el servidor.');
            }
        });
    }

    // ==========================================
    // 6. LÓGICA DE VISUALIZACIÓN DE DOCUMENTOS
    // ==========================================
    window.forzarDescarga = async function(url, nombreArchivo) {
        try {
            const response = await fetch(url);
            const blob = await response.blob(); 
            const blobUrl = window.URL.createObjectURL(blob); 
            
            const enlaceOculto = document.createElement('a');
            enlaceOculto.href = blobUrl;
            enlaceOculto.download = nombreArchivo; 
            document.body.appendChild(enlaceOculto);
            enlaceOculto.click(); 
            
            enlaceOculto.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            alert('Error de red al intentar descargar el archivo.');
        }
    };

    function asignarEventosVerDocumentos() {
        document.querySelectorAll('.btn-view-docs').forEach(boton => {
            boton.addEventListener('click', () => {
                const archivosString = boton.getAttribute('data-files');
                docsListContainer.innerHTML = ''; 

                if (!archivosString || archivosString === 'null') {
                    docsListContainer.innerHTML = '<p class="empty-docs">No hay archivos adjuntos.</p>';
                } else {
                    const archivos = archivosString.split(',').map(archivo => archivo.trim());

                    archivos.forEach((archivo, index) => {
                        // ¡NUEVO CLOUDINARY! - Usar la URL directa y extraer el nombre corto
                        const urlArchivo = archivo; 
                        const nombreCorto = urlArchivo.split('/').pop(); 
                        let extension = nombreCorto.split('.').pop().toLowerCase();
                        
                        let icono = '📄'; 
                        let botonesHTML = '';
                        let extraHTML = ''; 

                        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                            icono = '🖼️';
                            botonesHTML = `
                                <button class="btn-doc-action btn-doc-view" data-action="toggle-img" data-img-id="img-prev-${index}">👁️ Ver</button>
                                <button class="btn-doc-action btn-doc-download" data-action="download" data-url="${urlArchivo}" data-name="${nombreCorto}">⬇️ Descargar</button>
                            `;
                            extraHTML = `<img id="img-prev-${index}" src="${urlArchivo}" class="hidden doc-img-preview" alt="Vista previa de documento">`;
                        
                        } else if (['pdf'].includes(extension)) {
                            icono = '📕';
                            botonesHTML = `<a href="${urlArchivo}" target="_blank" class="btn-doc-link">Abrir PDF</a>`;
                        
                        } else if (['zip', 'rar'].includes(extension)) {
                            icono = '📦';
                            botonesHTML = `<button class="btn-doc-action btn-doc-download" data-action="download-zip" data-url="${urlArchivo}" data-name="${nombreCorto}">Descargar</button>`;
                        
                        } else if (['doc', 'docx', 'xls', 'xlsx'].includes(extension)) {
                            icono = '📘';
                            botonesHTML = `<button class="btn-doc-action btn-doc-download" data-action="download-doc" data-url="${urlArchivo}" data-name="${nombreCorto}">Descargar</button>`;
                        }

                        // ¡NUEVO CLOUDINARY! - Mostramos "nombreCorto" en la vista HTML en lugar de "archivo" (que ahora es una URL larga)
                        const archivoHTML = `
                            <div class="doc-item">
                                <div class="doc-item-row">
                                    <div class="doc-item-info">
                                        <span class="doc-icon">${icono}</span>
                                        <span class="doc-name" title="${nombreCorto}">${nombreCorto}</span>
                                    </div>
                                    <div class="doc-actions">
                                        ${botonesHTML}
                                    </div>
                                </div>
                                ${extraHTML}
                            </div>
                        `;
                        docsListContainer.insertAdjacentHTML('beforeend', archivoHTML);
                    });
                }
                
                asignarEventosAccionesDocumentos();
                viewDocsModal.classList.remove('hidden');
            });
        });
    }

    function asignarEventosAccionesDocumentos() {
        const docActions = document.querySelectorAll('.btn-doc-action');
        docActions.forEach(btn => {
            btn.onclick = (e) => {
                const action = e.target.getAttribute('data-action');
                if (action === 'toggle-img') {
                    const imgId = e.target.getAttribute('data-img-id');
                    document.getElementById(imgId).classList.toggle('hidden');
                } else if (action === 'download' || action === 'download-zip' || action === 'download-doc') {
                    const url = e.target.getAttribute('data-url');
                    const name = e.target.getAttribute('data-name');
                    if (action === 'download-zip' && !confirm('El navegador no puede abrir archivos comprimidos. ¿Deseas descargarlo?')) {
                        return;
                    }
                    if (action === 'download-doc' && !confirm('No se pueden previsualizar documentos de Office en el navegador. ¿Deseas descargarlo a tu computadora para leerlo?')) {
                        return;
                    }
                    forzarDescarga(url, name);
                }
            };
        });
    }

    if (btnCloseDocs) {
        btnCloseDocs.addEventListener('click', () => {
            viewDocsModal.classList.add('hidden');
        });
    }

    // ==========================================
    // 7. LÓGICA PARA ELIMINAR EVIDENCIAS
    // ==========================================
    function asignarEventosEliminar() {
        document.querySelectorAll('.btn-delete').forEach(boton => {
            boton.addEventListener('click', async () => {
                const id = boton.getAttribute('data-id');
                const confirmar = confirm("⚠️ ¿Estás seguro de que deseas eliminar este registro permanentemente de la Base de Datos?");
                
                if (confirmar) {
                    try {
                        const respuesta = await fetch(`${API_URL}/api/entregas/${id}`, {
                            method: 'DELETE'
                        });

                        if (respuesta.ok) {
                            alert('🗑️ Registro eliminado exitosamente.');
                            cargarHistorial(); 
                        } else {
                            alert('Error al intentar eliminar el registro.');
                        }
                    } catch (error) {
                        alert('Error de conexión con el servidor Node.js.');
                    }
                }
            });
        });
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    cargarHistorial(); 

});
