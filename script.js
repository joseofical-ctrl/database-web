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

    // ==========================================
    // 1. CARGAR DATOS DESDE POSTGRESQL (PÚBLICO Y PRIVADO)
    // ==========================================
    async function cargarHistorial() {
        if (!tasksList) return; 

        try {
            const respuesta = await fetch('http://localhost:3000/api/entregas');
            const entregas = await respuesta.json();
            
            tasksList.innerHTML = ''; 

            entregas.forEach(entrega => {
                const fecha = new Date(entrega.fecha_subida).toLocaleDateString();

                let botonesAccion = `
                    <button class="btn-link btn-view-docs" data-files="${entrega.nombre_archivo}" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3); cursor: pointer;">
                        🔗 Ver Documentos
                    </button>
                `;

                if (usuarioAutenticado) {
                    botonesAccion += `
                        <button class="btn-link btn-edit" data-id="${entrega.id}" data-week="${entrega.unidad_semana}" data-title="${entrega.titulo}" style="background: rgba(245, 158, 11, 0.1); color: #fbbf24; border-color: rgba(245, 158, 11, 0.3); cursor: pointer;">
                            ✏️ Editar
                        </button>
                        <button class="btn-link btn-delete" data-id="${entrega.id}" style="background: rgba(239, 68, 68, 0.1); color: #f87171; border-color: rgba(239, 68, 68, 0.3); cursor: pointer;">
                            🗑️ Eliminar
                        </button>
                    `;
                }

                const taskHTML = `
                    <div class="glass-panel task-card" style="animation: slideDown 0.4s ease forwards; margin-bottom: 16px;">
                        <div class="task-header">
                            <div>
                                <span class="task-week">${entrega.unidad_semana}</span>
                                <h3 class="task-title">${entrega.titulo}</h3>
                                <p class="task-desc">
                                    Subido el: ${fecha}<br>
                                    <span style="color: var(--accent); font-size: 0.8rem; font-family: monospace;">
                                        📄 ${entrega.nombre_archivo} (${entrega.peso_mb || '0'} MB)
                                    </span>
                                </p>
                            </div>
                            <span class="status-badge" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa; border-color: rgba(59, 130, 246, 0.2);">Registrado</span>
                        </div>
                        <div class="task-links" style="display: flex; justify-content: space-between; gap: 10px;">
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
                        img.style.cssText = 'width:60px; height:60px; object-fit:cover; border-radius:4px; border:1px solid var(--accent); margin:5px;';
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
                const respuesta = await fetch('http://localhost:3000/api/login', {
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
                const respuesta = await fetch('http://localhost:3000/api/entregas', {
                    method: 'POST',
                    body: formData
                });

                if (respuesta.ok) {
                    uploadForm.reset();
                    if(previewContainer) previewContainer.innerHTML = '';
                    alert(`¡Éxito! Registrados y guardados en el servidor: ${files.length} archivos.`);
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
    // 5. LÓGICA DE EDICIÓN (ACTUALIZADA PARA ARCHIVOS Y CHECKBOX)
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
            
            // NUEVO: Leemos el estado del checkbox
            const keepOldFiles = document.getElementById('keepOldFiles').checked;

            const formData = new FormData();
            formData.append('week', nuevoWeek);
            formData.append('title', nuevoTitle);
            formData.append('keepOld', keepOldFiles); // Enviamos 'true' o 'false'

            if (editFileInput && editFileInput.files.length > 0) {
                Array.from(editFileInput.files).forEach(file => {
                    formData.append('archivos', file); 
                });
            }

            try {
                const respuesta = await fetch(`http://localhost:3000/api/entregas/${id}`, {
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
                    docsListContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No hay archivos adjuntos.</p>';
                } else {
                    const archivos = archivosString.split(',').map(archivo => archivo.trim());

                    archivos.forEach((archivo, index) => {
                        let extension = archivo.split('.').pop().toLowerCase();
                        const urlArchivo = `http://localhost:3000/uploads/${encodeURIComponent(archivo)}`;
                        
                        let icono = '📄'; 
                        let botonesHTML = '';
                        let extraHTML = ''; 

                        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                            icono = '🖼️';
                            botonesHTML = `
                                <button onclick="document.getElementById('img-prev-${index}').classList.toggle('hidden')" style="background: var(--accent); border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">👁️ Ver</button>
                                <button onclick="forzarDescarga('${urlArchivo}', '${archivo}')" style="background: #10b981; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">⬇️ Descargar</button>
                            `;
                            extraHTML = `<img id="img-prev-${index}" src="${urlArchivo}" class="hidden" style="width: 100%; border-radius: 6px; margin-top: 10px; border: 1px solid var(--border-color);">`;
                        
                        } else if (['pdf'].includes(extension)) {
                            icono = '📕';
                            botonesHTML = `<a href="${urlArchivo}" target="_blank" style="background: var(--upla-blue); border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; text-decoration: none; text-align: center;">Abrir PDF</a>`;
                        
                        } else if (['zip', 'rar'].includes(extension)) {
                            icono = '📦';
                            botonesHTML = `<button onclick="if(confirm('El navegador no puede abrir archivos comprimidos. ¿Deseas descargarlo?')){ forzarDescarga('${urlArchivo}', '${archivo}'); }" style="background: var(--accent); border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">Descargar</button>`;
                        
                        } else if (['doc', 'docx', 'xls', 'xlsx'].includes(extension)) {
                            icono = '📘';
                            botonesHTML = `<button onclick="if(confirm('No se pueden previsualizar documentos de Office en el navegador. ¿Deseas descargarlo a tu computadora para leerlo?')){ forzarDescarga('${urlArchivo}', '${archivo}'); }" style="background: var(--accent); border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">Descargar</button>`;
                        }

                        const archivoHTML = `
                            <div style="background: var(--bg-darker); padding: 12px; border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; display: flex; flex-direction: column;">
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <div style="display: flex; align-items: center; gap: 10px; overflow: hidden; width: 60%;">
                                        <span style="font-size: 1.5rem;">${icono}</span>
                                        <span style="color: var(--text-light); font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: monospace;" title="${archivo}">${archivo}</span>
                                    </div>
                                    <div style="display: flex; gap: 5px; justify-content: flex-end;">
                                        ${botonesHTML}
                                    </div>
                                </div>
                                ${extraHTML}
                            </div>
                        `;
                        docsListContainer.insertAdjacentHTML('beforeend', archivoHTML);
                    });
                }

                viewDocsModal.classList.remove('hidden');
            });
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
                        const respuesta = await fetch(`http://localhost:3000/api/entregas/${id}`, {
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