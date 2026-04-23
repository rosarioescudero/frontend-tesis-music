/**
 * LÓGICA PRINCIPAL DE LA PLATAFORMA DE MUSICOTERAPIA
 */

lucide.createIcons();
const CONFIG = { API_URL: 'http://localhost:3000/api/pacientes' };

// =======================================================
// ⚠️ TUS ARCHIVOS CON SUS RUTAS (CARPETAS) ⚠️
// =======================================================
const ESTRUCTURA_DE_AUDIOS = {
    isocronos: [
        "isocronos/metronomo_isocrono80bpm.wav",
        "isocronos/metronomo_isocrono108bpm.wav",
        "isocronos/metronomo_isocrono120bpm.wav",
        "isocronos/metronomo_isocrono132bpm.wav",
        "isocronos/metronomo_isocrono160bpm.wav"
    ],
    abruptos: [
        ["abruptos/PA+10/PA+10__20-40.wav", "abruptos/PA+10/PA+10__21-40.wav", "abruptos/PA+10/PA+10__22-40.wav", "abruptos/PA+10/PA+10__23-40.wav", "abruptos/PA+10/PA+10__24-40.wav", "abruptos/PA+10/PA+10__25-40.wav"],
        ["abruptos/PA+33/PA+33__20-40.wav", "abruptos/PA+33/PA+33__21-40.wav", "abruptos/PA+33/PA+33__22-40.wav", "abruptos/PA+33/PA+33__23-40.wav", "abruptos/PA+33/PA+33__24-40.wav", "abruptos/PA+33/PA+33__25-40.wav"],
        ["abruptos/PA-10/PA-10__20-40.wav", "abruptos/PA-10/PA-10__21-40.wav", "abruptos/PA-10/PA-10__22-40.wav", "abruptos/PA-10/PA-10__23-40.wav", "abruptos/PA-10/PA-10__24-40.wav", "abruptos/PA-10/PA-10__25-40.wav"],
        ["abruptos/PA-33/PA-33__20-40.wav", "abruptos/PA-33/PA-33__21-40.wav", "abruptos/PA-33/PA-33__22-40.wav", "abruptos/PA-33/PA-33__23-40.wav", "abruptos/PA-33/PA-33__24-40.wav", "abruptos/PA-33/PA-33__25-40.wav"]
    ],
    rampa: [
        ["rampa/PR+10/PR+10__20-10-30.wav", "rampa/PR+10/PR+10__21-10-30.wav", "rampa/PR+10/PR+10__22-10-30.wav", "rampa/PR+10/PR+10__23-10-30.wav", "rampa/PR+10/PR+10__24-10-30.wav", "rampa/PR+10/PR+10__25-10-30.wav"],
        ["rampa/PR+33/PR+33__20-10-30.wav", "rampa/PR+33/PR+33__21-10-30.wav", "rampa/PR+33/PR+33__22-10-30.wav", "rampa/PR+33/PR+33__23-10-30.wav", "rampa/PR+33/PR+33__24-10-30.wav", "rampa/PR+33/PR+33__25-10-30.wav"],
        ["rampa/PR-10/PR-10__20-10-30.wav", "rampa/PR-10/PR-10__21-10-30.wav", "rampa/PR-10/PR-10__22-10-30.wav", "rampa/PR-10/PR-10__23-10-30.wav", "rampa/PR-10/PR-10__24-10-30.wav", "rampa/PR-10/PR-10__25-10-30.wav"],
        ["rampa/PR-33/PR-33__20-10-30.wav", "rampa/PR-33/PR-33__21-10-30.wav", "rampa/PR-33/PR-33__22-10-30.wav", "rampa/PR-33/PR-33__23-10-30.wav", "rampa/PR-33/PR-33__24-10-30.wav", "rampa/PR-33/PR-33__25-10-30.wav"]
    ]
};

const __verResultadosAnalisisOverride = function (data, nroPista) {
    const metadata = data.metadata_extraida || {};
    const video = (data.analisis && data.analisis.video) || {};
    const graficos = Array.isArray(data.graficos) ? data.graficos : [];

    document.getElementById('modal-analisis-titulo').textContent = `Resultados del análisis - Pista ${nroPista}`;
    document.getElementById('modal-analisis-subtitulo').textContent =
        `${metadata.tipo_metronomo || 'Tipo no detectado'} · ${metadata.mano || 'Mano no detectada'} · Sujeto ${metadata.sujeto || 'N/D'}`;

    document.getElementById('modal-analisis-resumen').textContent = [
        `Archivo: ${data.archivo || 'Sin nombre'}`,
        `Tipo: ${metadata.tipo_metronomo || 'No detectado'}`,
        `Mano: ${metadata.mano || 'No detectada'}`,
        `Sujeto: ${metadata.sujeto || 'No detectado'}`,
        `Duración: ${video.duracion_segundos ?? 'No disponible'} s`,
        `FPS: ${video.fps ?? 'No disponible'}`,
        `Gráficos generados: ${graficos.length}`
    ].join('\n');

    const galeria = document.getElementById('modal-analisis-galeria');
    galeria.className = 'flex-1 overflow-y-auto p-6 grid grid-cols-1 gap-8 bg-gray-100';
    galeria.innerHTML = '';

    if (!graficos.length) {
        galeria.innerHTML = `
            <div class="col-span-full bg-white border rounded-2xl p-8 text-center text-gray-500">
                No se generaron gráficos visibles para esta corrida.
            </div>
        `;
    } else {
        graficos.forEach((grafico, idx) => {
            const urlGrafico = app.normalizarUrlGrafico(grafico);
            const nombreGrafico = urlGrafico.split('/').pop() || `grafico_${idx + 1}`;
            const ext = nombreGrafico.split('.').pop().toLowerCase();
            const card = document.createElement('div');
            card.className = 'bg-white rounded-2xl border shadow-sm';

            if (ext === 'html') {
                card.innerHTML = `
                    <div class="px-4 py-3 border-b bg-gray-50 font-semibold text-sm text-gray-700">
                        Gráfico interactivo ${idx + 1}
                    </div>
                    <iframe src="${urlGrafico}" class="w-full bg-white rounded-b-2xl" style="height:75vh;min-height:520px;border:0;" loading="lazy"></iframe>
                    <div class="px-4 py-3 border-t text-xs text-gray-500 break-all">
                        ${nombreGrafico}
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="px-4 py-3 border-b bg-gray-50 font-semibold text-sm text-gray-700">
                        Gráfico ${idx + 1}
                    </div>
                    <img src="${urlGrafico}" alt="Gráfico de análisis ${idx + 1}" class="w-full h-auto bg-white">
                    <div class="px-4 py-3 border-t text-xs text-gray-500 break-all">
                        ${nombreGrafico}
                    </div>
                `;
            }

            const img = card.querySelector('img');
            if (img) {
                img.style.display = 'block';
                img.style.height = 'auto';
                img.style.maxHeight = 'none';
                img.style.objectFit = 'contain';
                img.style.objectPosition = 'top';
                img.classList.add('rounded-b-2xl');

                const wrapper = document.createElement('a');
                wrapper.href = urlGrafico;
                wrapper.target = '_blank';
                wrapper.rel = 'noopener noreferrer';
                wrapper.className = 'block bg-white';

                const parent = img.parentNode;
                if (parent) {
                    parent.insertBefore(wrapper, img);
                    wrapper.appendChild(img);
                }

                img.addEventListener('error', () => {
                    card.innerHTML = `
                        <div class="px-4 py-3 border-b bg-red-50 font-semibold text-sm text-red-700">
                            No se pudo cargar el gráfico ${idx + 1}
                        </div>
                        <div class="p-4 text-sm text-gray-600 break-all">
                            <p class="mb-3">Ruta intentada:</p>
                            <a href="${urlGrafico}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${urlGrafico}</a>
                        </div>
                    `;
                });
            }

            const iframe = card.querySelector('iframe');
            if (iframe) {
                iframe.addEventListener('error', () => {
                    card.innerHTML = `
                        <div class="px-4 py-3 border-b bg-red-50 font-semibold text-sm text-red-700">
                            No se pudo cargar el gráfico interactivo ${idx + 1}
                        </div>
                        <div class="p-4 text-sm text-gray-600 break-all">
                            <p class="mb-3">Ruta intentada:</p>
                            <a href="${urlGrafico}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${urlGrafico}</a>
                        </div>
                    `;
                });
            }

            galeria.appendChild(card);
        });
    }

    document.getElementById('modal-analisis').classList.remove('hidden');
    lucide.createIcons();
};


// ==========================================
// MÓDULO PRINCIPAL DE LA APP
// ==========================================
const ANALYSIS_STORAGE_KEY = 'neuroMusicaAnalisisV2';
const ANALYSIS_CATEGORY_RULES = [
    { key: 'resumen', label: 'Resumen', tests: ['grafico_001', 'grafico_002', 'resumen', 'overview', 'general'] },
    { key: 'senal', label: 'Señal / envolvente', tests: ['envolvente', 'envelope', 'senal', 'signal', 'audio', 'onda', 'waveform', 'fft', 'frecuencia', 'spect', 'grafico_003', 'grafico_004', 'grafico_005', 'grafico_006', 'grafico_007'] },
    { key: 'picos', label: 'Picos / detección', tests: ['peak', 'pico', 'deteccion', 'detec', 'grafico_008', 'grafico_009', 'grafico_010', 'grafico_011'] },
    { key: 'ritmo', label: 'Ritmo', tests: ['ritmo', 'rhythm', 'asincronia', 'sincro', 'sync', 'grafico_012', 'grafico_013', 'grafico_014', 'grafico_015', 'grafico_016'] },
    { key: 'tempo', label: 'Tempo', tests: ['tempo', 'bpm', 'rampa', 'grafico_017', 'grafico_018', 'grafico_019'] },
    { key: 'precision', label: 'Precisión', tests: ['precision', 'accuracy', 'consistencia', 'iti', 'stats', 'grafico_020', 'grafico_021', 'grafico_022', 'grafico_023'] },
    { key: 'otros', label: 'Otros / adicionales', tests: ['trayectorias', '3d', '2d', 'html', 'adicional'] }
];

const app = {
    pacientes: [],
    pacientesFiltroTipo: 'adulto',
    init: function () {
        this.verificarConexion();
        this.cambiarVista('inicio');
        this.configurarBuscador();
    },
    verificarConexion: async function () {
        const dot = document.getElementById('status-dot');
        const text = document.getElementById('status-text');
        try {
            const respuesta = await fetch(CONFIG.API_URL);
            if (respuesta.ok) {
                this.pacientes = await respuesta.json();
                dot.className = "w-2.5 h-2.5 rounded-full bg-green-500";
                text.textContent = "Servidor Conectado";
                text.className = "text-white/80 font-medium text-green-300";
                this.renderizarTablaPacientes(this.pacientes);
            }
        } catch (error) {
            dot.className = "w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse";
            text.textContent = "Servidor Apagado";
            text.className = "text-white/80 font-medium";
        }
    },
    cambiarVista: function (vistaId) {
        document.querySelectorAll('.vista-seccion').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('block');
        });

        const vistaActiva = document.getElementById(`vista-${vistaId}`);
        if (vistaActiva) {
            vistaActiva.classList.remove('hidden');
            vistaActiva.classList.add('block');
        }

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('bg-white/20');
            btn.classList.add('hover:bg-white/10');
        });
        const navId = ['protocolo', 'evaluacion-nino', 'bnpm-modulo-a', 'bnpm-modulo-b'].includes(vistaId)
            ? 'evaluaciones'
            : vistaId;
        const btnActivo = document.getElementById(`nav-${navId}`);
        if (btnActivo) {
            btnActivo.classList.add('bg-white/20');
            btnActivo.classList.remove('hover:bg-white/10');
        }

        if (vistaId === 'pacientes') this.verificarConexion();
        if (vistaId === 'protocolo') protocolo.reiniciar();

        lucide.createIcons();
    },
    abrirEvaluacionAdulto: function () {
        this.cambiarVista('protocolo');
    },
    esPacienteAdulto: function (paciente) {
        return !this.esPacienteNino(paciente);
    },
    pacienteCoincideFiltroTipo: function (paciente) {
        return this.pacientesFiltroTipo === 'nino'
            ? this.esPacienteNino(paciente)
            : this.esPacienteAdulto(paciente);
    },
    actualizarTabsPacientes: function (datos) {
        const adultos = datos.filter(p => this.esPacienteAdulto(p)).length;
        const ninos = datos.filter(p => this.esPacienteNino(p)).length;
        const tabAdulto = document.getElementById('pacientes-tab-adulto');
        const tabNino = document.getElementById('pacientes-tab-nino');
        const resumen = document.getElementById('pacientes-tab-resumen');
        if (tabAdulto) {
            tabAdulto.className = this.pacientesFiltroTipo === 'adulto'
                ? 'px-4 py-2 rounded-full text-sm font-semibold border border-primary bg-primary text-white transition'
                : 'px-4 py-2 rounded-full text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition';
            tabAdulto.textContent = `Adultos (${adultos})`;
        }
        if (tabNino) {
            tabNino.className = this.pacientesFiltroTipo === 'nino'
                ? 'px-4 py-2 rounded-full text-sm font-semibold border border-action bg-action text-white transition'
                : 'px-4 py-2 rounded-full text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition';
            tabNino.textContent = `Niños/as (${ninos})`;
        }
        if (resumen) {
            resumen.textContent = this.pacientesFiltroTipo === 'nino'
                ? `${ninos} paciente(s) niño/a`
                : `${adultos} paciente(s) adulto`;
        }
    },
    cambiarFiltroPacientes: function (tipo) {
        this.pacientesFiltroTipo = tipo === 'nino' ? 'nino' : 'adulto';
        this.renderizarTablaPacientes(this.pacientes);
    },
    abrirNuevoPacienteDesdeListado: function () {
        if (this.pacientesFiltroTipo === 'nino') {
            this.abrirEvaluacionNino();
            return;
        }
        this.abrirEvaluacionAdulto();
    },
    renderizarTablaPacientes: function (datos) {
        const tbody = document.getElementById('tabla-pacientes-body');
        const msjVacio = document.getElementById('msj-sin-pacientes');
        const tablaContainer = document.querySelector('.table-container table');
        const colManoHabil = document.getElementById('pacientes-col-mano-habil');
        const textoBusqueda = document.getElementById('filtro-pacientes')?.value?.toLowerCase().trim() || '';

        tbody.innerHTML = '';

        const datosFiltrados = (datos || []).filter(p => {
            const coincideTipo = this.pacienteCoincideFiltroTipo(p);
            if (!coincideTipo) return false;
            if (!textoBusqueda) return true;
            return (p.nombre || '').toLowerCase().includes(textoBusqueda) ||
                ((p.diagnostico || '').toLowerCase().includes(textoBusqueda));
        });
        this.actualizarTabsPacientes(datos || []);

        if (!datosFiltrados.length) {
            msjVacio.classList.remove('hidden');
            tablaContainer.classList.add('hidden');
            const etiquetaTipo = this.pacientesFiltroTipo === 'nino' ? 'niños/as' : 'adultos';
            msjVacio.querySelector('p').textContent = textoBusqueda
                ? `No hay pacientes ${etiquetaTipo} que coincidan con la búsqueda.`
                : `No hay pacientes ${etiquetaTipo} registrados aún.`;
            return;
        }

        msjVacio.classList.add('hidden');
        tablaContainer.classList.remove('hidden');
        if (colManoHabil) {
            colManoHabil.style.display = this.pacientesFiltroTipo === 'nino' ? 'none' : '';
        }

        // Crear una lista con su índice real en el array original
        const conIndice = datosFiltrados.map(p => {
            const realIndex = this.pacientes.indexOf(p);
            return { p, realIndex };
        });

        [...conIndice].reverse().forEach(({ p, realIndex }) => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 transition-colors";
            const mostrarManoHabil = this.pacientesFiltroTipo !== 'nino';
            tr.innerHTML = `
                <td class="font-medium text-gray-600">${p.fecha ? new Date(p.fecha).toLocaleDateString() : '-'}</td>
                <td class="font-bold text-gray-800">${p.nombre}</td>
                <td class="text-gray-600">${p.diagnostico || '-'}</td>
                ${mostrarManoHabil ? `<td class="text-gray-600">${p.dominancia || '-'}</td>` : ''}
                <td class="text-center acciones-td flex items-center justify-center gap-1"></td>
            `;

            const accionesTd = tr.querySelector('.acciones-td');

            // Botón Ver Resultados / Videos
            const btnVer = document.createElement('button');
            btnVer.className = "text-primary hover:text-blue-800 p-2 bg-blue-50 rounded-lg tooltip";
            if (this.esPacienteNino(p)) {
                btnVer.title = "Abrir Evaluación Niño";
                btnVer.innerHTML = '<i data-lucide="baby" class="w-5 h-5"></i>';
                btnVer.onclick = () => this.abrirPacienteNinoDesdeRegistro(realIndex);
            } else {
                btnVer.title = "Ver Resultados y Videos";
                btnVer.innerHTML = '<i data-lucide="file-bar-chart-2" class="w-5 h-5"></i>';
                btnVer.onclick = () => this.verDetallePaciente(realIndex);
            }
            accionesTd.appendChild(btnVer);

            // Botón Descargar PDF
            const btnPDF = document.createElement('button');
            btnPDF.className = "text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg tooltip";
            btnPDF.innerHTML = '<i data-lucide="file-down" class="w-5 h-5"></i>';
            if (this.esPacienteNino(p)) {
                btnPDF.title = "Abrir PDF BNPM";
                btnPDF.onclick = () => {
                    this.bnpmPacienteSeleccionadoB = String(realIndex);
                    this.abrirModuloNino('b');
                    setTimeout(() => this.descargarPdfModuloB(), 0);
                };
            } else {
                btnPDF.title = "Descargar PDF";
                btnPDF.onclick = () => this.generarPDF(p);
            }
            accionesTd.appendChild(btnPDF);

            tbody.appendChild(tr);
        });
        lucide.createIcons();
    },
    configurarBuscador: function () {
        document.getElementById('filtro-pacientes')?.addEventListener('input', (e) => {
            this.renderizarTablaPacientes(this.pacientes);
        });
    },

    generarPDF: function (paciente) {
        if (!window.jspdf) {
            alert("Error: Las librerías de PDF no están cargadas. Revisa tu index.html");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageW = doc.internal.pageSize.getWidth();
        const fechaFormat = paciente.fecha ? new Date(paciente.fecha).toLocaleDateString('es-AR') : 'N/A';
        const PRIMARY = [74, 92, 146];    // #4a5c92
        const ACTION = [59, 141, 119];   // #3b8d77
        const DARK = [30, 41, 59];     // slate-800
        const LIGHT_BG = [248, 250, 252]; // slate-50
        const MID_GRAY = [100, 116, 139]; // slate-500

        // ── HEADER ──
        doc.setFillColor(...PRIMARY);
        doc.rect(0, 0, pageW, 38, 'F');
        doc.setFillColor(...ACTION);
        doc.rect(0, 38, pageW, 3, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("NeuroMúsica", 14, 17);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Plataforma de Evaluación en Musicoterapia", 14, 25);
        doc.setFontSize(9);
        doc.text(`Reporte generado: ${new Date().toLocaleDateString('es-AR')}`, 14, 33);

        doc.setFontSize(10);
        doc.text(`Fecha de evaluación: ${fechaFormat}`, pageW - 14, 25, { align: 'right' });
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(paciente.nombre || 'Paciente', pageW - 14, 17, { align: 'right' });

        let y = 50;
        doc.setTextColor(...DARK);

        // ── SECCIÓN: DATOS DEL PACIENTE ──
        doc.setFillColor(...LIGHT_BG);
        doc.roundedRect(14, y, pageW - 28, 52, 3, 3, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, y, pageW - 28, 52, 3, 3, 'S');

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...PRIMARY);
        doc.text("Datos del Paciente", 20, y + 9);
        doc.setDrawColor(...ACTION);
        doc.setLineWidth(0.5);
        doc.line(20, y + 12, 80, y + 12);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...MID_GRAY);

        const datosCol1 = [
            ['Investigador', paciente.investigador || 'N/A'],
            ['E-mail', paciente.email || 'N/A'],
            ['Diagnóstico', paciente.diagnostico || 'N/A'],
        ];
        const datosCol2 = [
            ['Psicopatología', paciente.psicopatologia || 'Ninguna'],
            ['Medicación', paciente.medicacion || 'Ninguna'],
            ['Mano hábil / Mano inicio', `${paciente.dominancia || 'N/A'}  ·  ${paciente.manoInicio || 'N/A'}`],
        ];

        datosCol1.forEach((d, i) => {
            const posY = y + 20 + i * 11;
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...DARK);
            doc.text(`${d[0]}:`, 22, posY);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...MID_GRAY);
            doc.text(d[1], 58, posY);
        });

        datosCol2.forEach((d, i) => {
            const posY = y + 20 + i * 11;
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...DARK);
            doc.text(`${d[0]}:`, pageW / 2 + 5, posY);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...MID_GRAY);
            doc.text(d[1], pageW / 2 + 50, posY);
        });

        y += 60;

        // ── SECCIÓN: MEDIDAS DE MANOS ──
        const med = paciente.medidasManos || {};
        const hayMedidas = med.md_mayor || med.md_indice || med.mi_mayor || med.mi_indice;

        if (hayMedidas) {
            y += 4;
            doc.autoTable({
                startY: y,
                head: [['', 'Mayor - muñeca (cm)', 'Índice (cm)']],
                body: [
                    ['Mano Derecha (MD)', med.md_mayor || '—', med.md_indice || '—'],
                    ['Mano Izquierda (MI)', med.mi_mayor || '—', med.mi_indice || '—'],
                ],
                theme: 'grid',
                headStyles: { fillColor: PRIMARY, fontSize: 8, fontStyle: 'bold', halign: 'center' },
                bodyStyles: { fontSize: 8, halign: 'center' },
                columnStyles: { 0: { fontStyle: 'bold', halign: 'left' } },
                styles: { cellPadding: 3 },
                margin: { left: 14, right: 14 },
                tableWidth: pageW - 28,
            });
            y = doc.lastAutoTable.finalY + 8;
        }

        // ── SECCIÓN: RESULTADOS POR PISTA ──
        if (paciente.evaluaciones_detalladas && paciente.evaluaciones_detalladas.length > 0) {
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...PRIMARY);
            doc.text("Resultados por Pista — Protocolo de 26 Audios", 14, y + 4);
            doc.setDrawColor(...ACTION);
            doc.setLineWidth(0.5);
            doc.line(14, y + 7, 120, y + 7);

            const filasTabla = paciente.evaluaciones_detalladas.map(ev => [
                ev.nro_pista,
                ev.mano_evaluada,
                ev.archivo.split('/').pop(),
                ev.rhythm_identification,
                ev.tempo_variations,
                ev.rhythmic_accuracy
            ]);

            doc.autoTable({
                startY: y + 11,
                head: [['N°', 'Mano', 'Archivo', 'Ident. Ritmo', 'Var. Tempo', 'Precisión Rítmica']],
                body: filasTabla,
                theme: 'striped',
                headStyles: {
                    fillColor: PRIMARY,
                    textColor: [255, 255, 255],
                    fontSize: 7.5,
                    fontStyle: 'bold',
                    halign: 'center',
                    cellPadding: 3,
                },
                bodyStyles: {
                    fontSize: 7,
                    cellPadding: 2.5,
                    textColor: DARK,
                },
                alternateRowStyles: { fillColor: [241, 245, 249] },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 10 },
                    1: { halign: 'center', cellWidth: 22 },
                    2: { cellWidth: 48 },
                    3: { halign: 'center' },
                    4: { halign: 'center' },
                    5: { halign: 'center' },
                },
                styles: { overflow: 'linebreak' },
                margin: { left: 14, right: 14 },
                didParseCell: function (data) {
                    if (data.section === 'body' && data.column.index >= 3) {
                        const val = data.cell.raw;
                        if (val === 'Consistente') data.cell.styles.textColor = ACTION;
                        else if (val === 'Inconsistente') data.cell.styles.textColor = [234, 88, 12];
                        else if (val === 'Nunca') data.cell.styles.textColor = [220, 38, 38];
                        else if (val === 'Rara vez') data.cell.styles.textColor = [202, 138, 4];
                    }
                }
            });
        } else {
            doc.setFontSize(10);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(...MID_GRAY);
            doc.text("Este paciente no cuenta con evaluaciones detalladas registradas.", 14, y + 4);
        }

        // ── FOOTER ──
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            const pageH = doc.internal.pageSize.getHeight();
            doc.setDrawColor(...PRIMARY);
            doc.setLineWidth(0.3);
            doc.line(14, pageH - 14, pageW - 14, pageH - 14);
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...MID_GRAY);
            doc.text("NeuroMúsica — Plataforma de Evaluación en Musicoterapia", 14, pageH - 9);
            doc.text(`Página ${i} de ${totalPages}`, pageW - 14, pageH - 9, { align: 'right' });
        }

        const nombreArchivo = `Reporte_${(paciente.nombre || 'Paciente').replace(/\s+/g, '_')}_${fechaFormat.replace(/\//g, '-')}.pdf`;
        doc.save(nombreArchivo);
    },

    // ==========================================
    // FUNCIONES DE MODAL Y VIDEOS
    // ==========================================
    _modalPacienteIndex: null,

    verDetallePaciente: async function (index) {
        const p = this.pacientes[index];
        if (!p) return;
        this._modalPacienteIndex = index;

        // Rellenar header
        document.getElementById('modal-titulo').textContent = p.nombre || 'Paciente';
        document.getElementById('modal-subtitulo').textContent =
            `${p.diagnostico || ''} · ${p.dominancia || ''} · ${p.fecha ? new Date(p.fecha).toLocaleDateString() : ''}`;

        // Info rápida
        const infoDiv = document.getElementById('modal-info');
        infoDiv.innerHTML = `
            <div class="bg-white px-3 py-2 rounded-lg border"><span class="text-gray-500 text-xs block">Investigador</span><span class="font-semibold text-gray-800">${p.investigador || 'N/A'}</span></div>
            <div class="bg-white px-3 py-2 rounded-lg border"><span class="text-gray-500 text-xs block">Mano hábil</span><span class="font-semibold text-gray-800">${p.dominancia || 'N/A'}</span></div>
            <div class="bg-white px-3 py-2 rounded-lg border"><span class="text-gray-500 text-xs block">Mano Inicio</span><span class="font-semibold text-gray-800">${p.manoInicio || 'N/A'}</span></div>
            <div class="bg-white px-3 py-2 rounded-lg border"><span class="text-gray-500 text-xs block">Medicación</span><span class="font-semibold text-gray-800">${p.medicacion || 'Ninguna'}</span></div>
        `;

        // Construir tabla — se llenará después con el estado de videos
        const tbody = document.getElementById('modal-tabla-body');
        tbody.innerHTML = '';

        const evals = p.evaluaciones_detalladas || [];
        evals.forEach((ev, i) => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 transition-colors";
            tr.innerHTML = `
                <td class="text-center font-bold text-primary">${ev.nro_pista}</td>
                <td class="text-center"><span class="px-2 py-0.5 rounded text-xs font-bold ${ev.mano_evaluada === 'Derecha' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">${ev.mano_evaluada}</span></td>
                <td class="text-xs font-mono text-gray-600">${ev.archivo.split('/').pop()}</td>
                <td class="text-center text-sm">${ev.rhythm_identification}</td>
                <td class="text-center text-sm">${ev.tempo_variations}</td>
                <td class="text-center text-sm">${ev.rhythmic_accuracy}</td>
                <td class="text-center video-cell" id="video-cell-${ev.nro_pista}">
                    <span class="text-gray-400 text-xs">Cargando...</span>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Mostrar modal
        document.getElementById('modal-detalle').classList.remove('hidden');
        lucide.createIcons();

        // Cargar estado de videos
        await this.cargarEstadoVideos(index, evals);
    },

    cargarEstadoVideos: async function (index, evals) {
        try {
            const resp = await fetch(`${CONFIG.API_URL}/${index}/videos`);
            const data = await resp.json();
            const videos = data.videos || {};

            let countVideos = 0;

            evals.forEach(ev => {
                const cell = document.getElementById(`video-cell-${ev.nro_pista}`);
                if (!cell) return;
                const pista = ev.nro_pista;

                if (videos[pista]) {
                    countVideos++;
                    cell.innerHTML = `
                        <div class="flex items-center justify-center gap-1">
                            <button onclick="app.verVideo('${videos[pista]}', ${pista})" class="bg-action/10 text-action hover:bg-action/20 p-1.5 rounded-lg transition" title="Ver video">
                                <i data-lucide="play-circle" class="w-4 h-4"></i>
                            </button>

                            <button onclick="app.analizarVideo(${index}, ${pista})" class="bg-purple-100 text-purple-600 hover:bg-purple-200 p-1.5 rounded-lg transition" title="Analizar con Python">
                                <i data-lucide="activity" class="w-4 h-4"></i>
                            </button>

                            <button onclick="app.eliminarVideo(${index}, ${pista})" class="bg-red-50 text-red-500 hover:bg-red-100 p-1.5 rounded-lg transition" title="Eliminar video">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                            <span class="text-green-600 text-[10px] font-bold ml-1">✓</span>
                        </div>
                    `;
                } else {
                    cell.innerHTML = `
                        <label class="cursor-pointer inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                            <i data-lucide="upload" class="w-3.5 h-3.5"></i> Subir
                            <input type="file" accept="video/*" class="hidden" onchange="app.subirVideo(${index}, ${pista}, this)">
                        </label>
                    `;
                }
            });

            document.getElementById('modal-contador-videos').textContent = `${countVideos} de ${evals.length} videos`;
            lucide.createIcons();
        } catch (error) {
            console.error("Error cargando videos:", error);
        }
    },

    subirVideo: async function (indexPaciente, nroPista, inputFile) {
        const file = inputFile.files[0];
        if (!file) return;

        const cell = document.getElementById(`video-cell-${nroPista}`);
        cell.innerHTML = `
            <div class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span class="text-xs text-gray-500">Subiendo...</span>
            </div>
        `;

        const formData = new FormData();
        formData.append('video', file);

        try {
            const resp = await fetch(`${CONFIG.API_URL}/${indexPaciente}/videos/${nroPista}`, {
                method: 'POST',
                body: formData
            });

            if (resp.ok) {
                // Recargar estado de videos
                const p = this.pacientes[indexPaciente];
                await this.cargarEstadoVideos(indexPaciente, p.evaluaciones_detalladas || []);
            } else {
                const err = await resp.text();
                alert(`Error subiendo video: ${err}`);
                cell.innerHTML = '<span class="text-red-500 text-xs">Error</span>';
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión al subir video.");
            cell.innerHTML = '<span class="text-red-500 text-xs">Error</span>';
        }
    },

    verVideo: function (rutaVideo, nroPista) {
        document.getElementById('modal-video-titulo').textContent = `Pista ${nroPista}`;
        const player = document.getElementById('modal-video-player');
        player.src = rutaVideo;
        document.getElementById('modal-video').classList.remove('hidden');
        player.play().catch(() => { });
    },

    eliminarVideo: async function (indexPaciente, nroPista) {
        if (!confirm(`¿Eliminar el video de la pista ${nroPista}?`)) return;

        try {
            const resp = await fetch(`${CONFIG.API_URL}/${indexPaciente}/videos/${nroPista}`, {
                method: 'DELETE'
            });
            if (resp.ok) {
                const p = this.pacientes[indexPaciente];
                await this.cargarEstadoVideos(indexPaciente, p.evaluaciones_detalladas || []);
            } else {
                alert("Error al eliminar video.");
            }
        } catch (error) {
            alert("Error de conexión.");
        }
    },

    // ==========================================
    // NUEVA FUNCIÓN: LLAMADA A PYTHON (MOTOR DE TESIS)
    // ==========================================
    analizarVideo: async function(indexPaciente, nroPista) {
        alert(`Iniciando análisis de la pista ${nroPista} con Python. Esto demorará unos segundos...`);

        try {
            const response = await fetch(`${CONFIG.API_URL}/${indexPaciente}/analizar/${nroPista}`, {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {
                console.log("✅ RESULTADO DEL ANÁLISIS DE PYTHON:", data);
                const metadata = data.metadata_extraida || {};
                const video = (data.analisis && data.analisis.video) || {};
                const resumen = [
                    `Archivo: ${data.archivo || 'Sin nombre'}`,
                    `Tipo: ${metadata.tipo_metronomo || 'No detectado'}`,
                    `Mano: ${metadata.mano || 'No detectada'}`,
                    `Sujeto: ${metadata.sujeto || 'No detectado'}`,
                    `Duración: ${video.duracion_segundos ?? 'No disponible'} s`,
                    `FPS: ${video.fps ?? 'No disponible'}`
                ].join('\n');

                alert(`¡Análisis completado!\n\n${resumen}`);
                this.verResultadosAnalisis(data, nroPista);
            } else {
                const detalleTexto = this.formatearDetalleError(data);
                console.error("❌ Error del servidor:", data);
                console.error("❌ Detalle del error:", detalleTexto);
                alert(`Error en el análisis: ${data.error || data.message || 'Sin detalle'}\n\n${detalleTexto}`);
            }
        } catch (error) {
            console.error("Error de conexión al analizar:", error);
            alert("No se pudo conectar con el servidor para analizar el video.");
        }
    },
    // ==========================================

    cerrarModal: function () {
        document.getElementById('modal-detalle').classList.add('hidden');
        this._modalPacienteIndex = null;
    },

    cerrarVideoModal: function () {
        const player = document.getElementById('modal-video-player');
        player.pause();
        player.src = '';
        document.getElementById('modal-video').classList.add('hidden');
    },

    formatearDetalleError: function (data) {
        const detalle = data && data.detalle;
        if (!detalle) {
            return 'Sin detalle adicional.';
        }
        if (typeof detalle === 'string') {
            return detalle;
        }
        try {
            return JSON.stringify(detalle, null, 2);
        } catch (error) {
            return String(detalle);
        }
    },

    normalizarUrlGrafico: function (grafico) {
        if (!grafico) {
            return '';
        }

        const valor = String(grafico).replace(/\\/g, '/');

        if (/^https?:\/\//i.test(valor)) {
            return valor;
        }

        if (valor.startsWith('/')) {
            return `${window.location.origin}${valor}`;
        }

        if (/^[A-Za-z]:\//.test(valor)) {
            const marca = '/analysis_outputs/';
            const indice = valor.toLowerCase().indexOf(marca);
            if (indice >= 0) {
                return `${window.location.origin}${valor.slice(indice)}`;
            }
        }

        return valor;
    },

    verResultadosAnalisis: function (data, nroPista) {
        const metadata = data.metadata_extraida || {};
        const video = (data.analisis && data.analisis.video) || {};
        const graficos = Array.isArray(data.graficos) ? data.graficos : [];

        document.getElementById('modal-analisis-titulo').textContent = `Resultados del análisis - Pista ${nroPista}`;
        document.getElementById('modal-analisis-subtitulo').textContent =
            `${metadata.tipo_metronomo || 'Tipo no detectado'} · ${metadata.mano || 'Mano no detectada'} · Sujeto ${metadata.sujeto || 'N/D'}`;

        document.getElementById('modal-analisis-resumen').textContent = [
            `Archivo: ${data.archivo || 'Sin nombre'}`,
            `Tipo: ${metadata.tipo_metronomo || 'No detectado'}`,
            `Mano: ${metadata.mano || 'No detectada'}`,
            `Sujeto: ${metadata.sujeto || 'No detectado'}`,
            `Duración: ${video.duracion_segundos ?? 'No disponible'} s`,
            `FPS: ${video.fps ?? 'No disponible'}`,
            `Gráficos generados: ${graficos.length}`
        ].join('\n');

        const galeria = document.getElementById('modal-analisis-galeria');
        galeria.innerHTML = '';

        if (!graficos.length) {
            galeria.innerHTML = `
                <div class="col-span-full bg-white border rounded-2xl p-8 text-center text-gray-500">
                    No se generaron gráficos visibles para esta corrida.
                </div>
            `;
        } else {
            graficos.forEach((grafico, idx) => {
                const ext = grafico.split('.').pop().toLowerCase();
                const card = document.createElement('div');
                card.className = 'bg-white rounded-2xl border shadow-sm overflow-hidden';

                if (ext === 'html') {
                    card.innerHTML = `
                        <div class="px-4 py-3 border-b bg-gray-50 font-semibold text-sm text-gray-700">
                            Gráfico interactivo ${idx + 1}
                        </div>
                        <iframe src="${grafico}" class="w-full" style="height:420px;border:0;"></iframe>
                    `;
                } else {
                    card.innerHTML = `
                        <div class="px-4 py-3 border-b bg-gray-50 font-semibold text-sm text-gray-700">
                            Gráfico ${idx + 1}
                        </div>
                        <img src="${grafico}" alt="Gráfico de análisis ${idx + 1}" class="w-full h-auto bg-white">
                    `;
                }

                galeria.appendChild(card);
            });
        }

        document.getElementById('modal-analisis').classList.remove('hidden');
        lucide.createIcons();
    },

    cerrarAnalisisModal: function () {
        document.getElementById('modal-analisis').classList.add('hidden');
    }
};

app.analisisPersistidos = {};
app.analisisActivo = null;
app.visorAnalisis = null;

app.crearClaveAnalisis = function (indexPaciente, nroPista) {
    return `paciente_${indexPaciente}_pista_${nroPista}`;
};

app.formatearFechaHora = function (valor) {
    if (!valor) return 'No disponible';
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return 'No disponible';
    return fecha.toLocaleString('es-AR');
};

app.extraerNombreArchivo = function (valor) {
    return String(valor || '').split('/').pop().split('\\').pop();
};

app.crearRutaManifestAnalisis = function (indexPaciente, nroPista) {
    return `${window.location.origin}/analysis_outputs/paciente_${indexPaciente}/pista_${nroPista}/analysis_results.json`;
};

app.leerAnalisisPersistidos = function () {
    try {
        return JSON.parse(localStorage.getItem(ANALYSIS_STORAGE_KEY) || '{}');
    } catch (error) {
        return {};
    }
};

app.guardarAnalisisPersistidos = function () {
    localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(this.analisisPersistidos || {}));
};

app.tituloGraficoDesdeNombre = function (nombre, indice) {
    const base = this.extraerNombreArchivo(nombre).replace(/\.[^.]+$/, '');
    const limpio = base
        .replace(/^grafico[_-]?/i, 'Gráfico ')
        .replace(/[_-]+/g, ' ')
        .replace(/\b(ms|iti|fft|bpm|2d|3d)\b/gi, txt => txt.toUpperCase())
        .trim();
    if (!limpio) return `Gráfico ${indice + 1}`;
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
};

app.categorizarGrafico = function (nombre, indice) {
    const normalizado = `${indice + 1} ${String(nombre || '').toLowerCase()}`;
    const regla = ANALYSIS_CATEGORY_RULES.find(item => item.tests.some(test => normalizado.includes(test)));
    return regla || ANALYSIS_CATEGORY_RULES[ANALYSIS_CATEGORY_RULES.length - 1];
};

app.normalizarGraficoAnalisis = function (grafico, indice) {
    const url = this.normalizarUrlGrafico(grafico);
    const nombre = this.extraerNombreArchivo(url || grafico) || `grafico_${indice + 1}`;
    const categoria = this.categorizarGrafico(nombre, indice);
    const extension = nombre.split('.').pop().toLowerCase();
    return {
        id: `${indice}-${nombre}`,
        index: indice,
        url,
        nombre,
        titulo: this.tituloGraficoDesdeNombre(nombre, indice),
        categoria: categoria.label,
        categoriaKey: categoria.key,
        tipo: extension === 'html' ? 'html' : 'imagen'
    };
};

app.normalizarResultadoAnalisis = function (data, nroPista, context = {}) {
    const metadata = data.metadata_extraida || data.metadata || {};
    const video = (data.analisis && data.analisis.video) || {};
    const graficos = (Array.isArray(data.graficos) ? data.graficos : [])
        .map((grafico, indice) => this.normalizarGraficoAnalisis(grafico, indice));
    const evaluacion = context.evaluacion || {};
    const paciente = context.paciente || {};
    return {
        clave: this.crearClaveAnalisis(context.indexPaciente, nroPista),
        indexPaciente: context.indexPaciente,
        nroPista,
        pacienteNombre: paciente.nombre || context.pacienteNombre || 'Paciente',
        fechaAnalisis: context.fechaAnalisis || data.fechaAnalisis || new Date().toISOString(),
        estado: 'Disponible',
        archivo: data.archivo || evaluacion.archivo || 'Sin nombre',
        manoEvaluada: evaluacion.mano_evaluada || metadata.mano || 'No detectada',
        metadata,
        video,
        graficos,
        cantidadGraficos: graficos.length,
        manifestUrl: context.manifestUrl || this.crearRutaManifestAnalisis(context.indexPaciente, nroPista),
        categoriaActiva: 'todas',
        origen: context.origen || 'runtime'
    };
};

app.obtenerVideosPaciente = async function (indexPaciente) {
    this.videosPorPacienteCache = this.videosPorPacienteCache || {};
    if (this.videosPorPacienteCache[indexPaciente]) {
        return this.videosPorPacienteCache[indexPaciente];
    }

    try {
        const resp = await fetch(`${CONFIG.API_URL}/${indexPaciente}/videos`);
        const data = await resp.json();
        const videos = data.videos || {};
        this.videosPorPacienteCache[indexPaciente] = videos;
        return videos;
    } catch (error) {
        return {};
    }
};

app.leerUint64Seguro = function (view, offset) {
    const high = view.getUint32(offset);
    const low = view.getUint32(offset + 4);
    return high * 4294967296 + low;
};

app.extraerMetadataMp4 = function (arrayBuffer) {
    const view = new DataView(arrayBuffer);
    const decoder = new TextDecoder('ascii');

    const leerTipo = (offset) => decoder.decode(new Uint8Array(arrayBuffer, offset, 4));
    const leerCajas = (start, end) => {
        const boxes = [];
        let offset = start;
        while (offset + 8 <= end) {
            let size = view.getUint32(offset);
            const type = leerTipo(offset + 4);
            let headerSize = 8;
            if (size === 1 && offset + 16 <= end) {
                size = this.leerUint64Seguro(view, offset + 8);
                headerSize = 16;
            } else if (size === 0) {
                size = end - offset;
            }
            if (!size || size < headerSize) break;
            boxes.push({
                type,
                start: offset,
                size,
                headerSize,
                contentStart: offset + headerSize,
                contentEnd: offset + size
            });
            offset += size;
        }
        return boxes;
    };

    const buscarCaja = (boxes, type) => boxes.find(box => box.type === type);
    const topLevel = leerCajas(0, arrayBuffer.byteLength);
    const moov = buscarCaja(topLevel, 'moov');
    if (!moov) return null;

    const moovChildren = leerCajas(moov.contentStart, moov.contentEnd);
    const tracks = moovChildren.filter(box => box.type === 'trak');

    for (const trak of tracks) {
        const trakChildren = leerCajas(trak.contentStart, trak.contentEnd);
        const mdia = buscarCaja(trakChildren, 'mdia');
        if (!mdia) continue;

        const mdiaChildren = leerCajas(mdia.contentStart, mdia.contentEnd);
        const hdlr = buscarCaja(mdiaChildren, 'hdlr');
        const mdhd = buscarCaja(mdiaChildren, 'mdhd');
        const minf = buscarCaja(mdiaChildren, 'minf');
        if (!hdlr || !mdhd || !minf) continue;

        const handlerType = leerTipo(hdlr.contentStart + 8);
        if (handlerType !== 'vide') continue;

        const mdhdVersion = view.getUint8(mdhd.contentStart);
        const timescale = mdhdVersion === 1
            ? view.getUint32(mdhd.contentStart + 20)
            : view.getUint32(mdhd.contentStart + 12);
        const duration = mdhdVersion === 1
            ? this.leerUint64Seguro(view, mdhd.contentStart + 24)
            : view.getUint32(mdhd.contentStart + 16);

        const minfChildren = leerCajas(minf.contentStart, minf.contentEnd);
        const stbl = buscarCaja(minfChildren, 'stbl');
        if (!stbl || !timescale || !duration) {
            return {
                duracion_segundos: timescale ? Number((duration / timescale).toFixed(3)) : null,
                fps: null
            };
        }

        const stblChildren = leerCajas(stbl.contentStart, stbl.contentEnd);
        const stts = buscarCaja(stblChildren, 'stts');
        let totalSamples = 0;

        if (stts) {
            const entryCount = view.getUint32(stts.contentStart + 4);
            let cursor = stts.contentStart + 8;
            for (let i = 0; i < entryCount; i++) {
                totalSamples += view.getUint32(cursor);
                cursor += 8;
            }
        }

        const duracionSegundos = duration / timescale;
        return {
            duracion_segundos: Number(duracionSegundos.toFixed(3)),
            fps: totalSamples > 0 && duracionSegundos > 0 ? Number((totalSamples / duracionSegundos).toFixed(3)) : null
        };
    }

    return null;
};

app.extraerDuracionDesdeVideo = function (url) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => resolve(Number.isFinite(video.duration) ? Number(video.duration.toFixed(3)) : null);
        video.onerror = () => resolve(null);
        video.src = url;
    });
};

app.completarMetadatosVideoFaltantes = async function (indexPaciente, nroPista, videoActual) {
    const video = { ...(videoActual || {}) };
    if (video.duracion_segundos != null && video.fps != null) {
        return video;
    }

    this.videoMetadataCache = this.videoMetadataCache || {};
    const cacheKey = `${indexPaciente}-${nroPista}`;
    if (this.videoMetadataCache[cacheKey]) {
        return { ...video, ...this.videoMetadataCache[cacheKey] };
    }

    const videos = await this.obtenerVideosPaciente(indexPaciente);
    const rutaVideo = videos[String(nroPista)] || videos[nroPista];
    if (!rutaVideo) return video;

    let metadata = null;
    try {
        const response = await fetch(rutaVideo);
        if (response.ok) {
            const buffer = await response.arrayBuffer();
            metadata = this.extraerMetadataMp4(buffer);
        }
    } catch (error) {
    }

    if (!metadata || metadata.duracion_segundos == null) {
        const duracion = await this.extraerDuracionDesdeVideo(rutaVideo);
        metadata = {
            ...(metadata || {}),
            duracion_segundos: duracion
        };
    }

    this.videoMetadataCache[cacheKey] = metadata || {};
    return { ...video, ...(metadata || {}) };
};

app.persistirResultadoAnalisis = function (resultado) {
    if (!resultado || resultado.indexPaciente == null || resultado.nroPista == null) return;
    this.analisisPersistidos[resultado.clave] = resultado;
    this.guardarAnalisisPersistidos();
};

app.cargarAnalisisGuardado = async function (indexPaciente, nroPista, opciones = {}) {
    const clave = this.crearClaveAnalisis(indexPaciente, nroPista);
    const existente = this.analisisPersistidos[clave] || null;
    if (!opciones.forzar && this.analisisPersistidos[clave]) {
        return this.analisisPersistidos[clave];
    }

    const manifestUrl = this.crearRutaManifestAnalisis(indexPaciente, nroPista);
    try {
        const response = await fetch(manifestUrl, { cache: 'no-store' });
        if (!response.ok) return this.analisisPersistidos[clave] || null;
        const manifest = await response.json();
        const paciente = this.pacientes[indexPaciente] || {};
        const evaluacion = (paciente.evaluaciones_detalladas || []).find(ev => String(ev.nro_pista) === String(nroPista)) || {};
        const resultado = this.normalizarResultadoAnalisis(
            {
                archivo: this.extraerNombreArchivo(manifest.video_path),
                metadata_extraida: manifest.metadata || {},
                analisis: { video: existente && existente.video ? existente.video : {} },
                graficos: manifest.generated_plots || []
            },
            nroPista,
            {
                indexPaciente,
                paciente,
                evaluacion,
                manifestUrl,
                origen: 'manifest',
                fechaAnalisis: (existente && existente.fechaAnalisis) || new Date().toISOString()
            }
        );
        resultado.video = await this.completarMetadatosVideoFaltantes(indexPaciente, nroPista, resultado.video);
        this.persistirResultadoAnalisis(resultado);
        return resultado;
    } catch (error) {
        return this.analisisPersistidos[clave] || null;
    }
};

app.renderizarAnalisisDisponibles = function (indexPaciente, evals) {
    const contenedor = document.getElementById('modal-analisis-disponibles');
    const contador = document.getElementById('modal-analisis-contador');
    if (!contenedor || !contador) return;

    const registros = (evals || [])
        .map(ev => this.analisisPersistidos[this.crearClaveAnalisis(indexPaciente, ev.nro_pista)])
        .filter(Boolean)
        .sort((a, b) => new Date(b.fechaAnalisis) - new Date(a.fechaAnalisis));

    contador.textContent = registros.length ? `${registros.length} disponibles` : 'Sin resultados guardados';

    if (!registros.length) {
        contenedor.innerHTML = `
            <div class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-500 text-center">
                Todavía no hay análisis persistidos para este paciente. Cuando ejecutes uno, va a quedar accesible desde acá si el manifiesto del resultado sigue disponible.
            </div>
        `;
        return;
    }

    contenedor.innerHTML = registros.map(item => `
        <div class="analysis-available-item">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Pista ${item.nroPista}</p>
                    <h5 class="font-semibold text-slate-800 mt-1 text-sm break-all">${item.archivo}</h5>
                    <p class="text-xs text-slate-500 mt-1">${item.metadata.tipo_metronomo || 'Tipo no detectado'} · ${item.manoEvaluada || 'Mano no detectada'} · ${item.cantidadGraficos} gráficos</p>
                </div>
                <span class="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">${item.estado}</span>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3 mt-3">
                <span class="text-xs text-slate-500">${this.formatearFechaHora(item.fechaAnalisis)}</span>
                <div class="flex items-center gap-2">
                    <button onclick="app.abrirAnalisisPersistido(${indexPaciente}, ${item.nroPista})" class="bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-semibold transition">Ver resultados</button>
                    <button onclick="app.descargarPdfAnalisisPersistido(${indexPaciente}, ${item.nroPista})" class="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition">PDF</button>
                </div>
            </div>
        </div>
    `).join('');
};

app.adjuntarAccionesAnalisisACelda = function (indexPaciente, nroPista) {
    const cell = document.getElementById(`video-cell-${nroPista}`);
    const resultado = this.analisisPersistidos[this.crearClaveAnalisis(indexPaciente, nroPista)];
    if (!cell || !resultado || cell.querySelector(`[data-analysis-action="${nroPista}"]`)) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'mt-2 flex items-center justify-center gap-1';
    wrapper.innerHTML = `
        <button data-analysis-action="${nroPista}" onclick="app.abrirAnalisisPersistido(${indexPaciente}, ${nroPista})" class="bg-primary/10 text-primary hover:bg-primary/20 p-1.5 rounded-lg transition" title="Ver análisis guardado">
            <i data-lucide="bar-chart-3" class="w-4 h-4"></i>
        </button>
        <button onclick="app.descargarPdfAnalisisPersistido(${indexPaciente}, ${nroPista})" class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition" title="Descargar PDF del análisis">
            <i data-lucide="file-down" class="w-4 h-4"></i>
        </button>
    `;
    cell.appendChild(wrapper);
    lucide.createIcons();
};

app.cargarAnalisisDisponibles = async function (indexPaciente, evals) {
    const contador = document.getElementById('modal-analisis-contador');
    if (contador) contador.textContent = 'Buscando...';
    await Promise.all((evals || []).map(ev => this.cargarAnalisisGuardado(indexPaciente, ev.nro_pista)));
    this.renderizarAnalisisDisponibles(indexPaciente, evals);
    (evals || []).forEach(ev => this.adjuntarAccionesAnalisisACelda(indexPaciente, ev.nro_pista));
};

app.abrirAnalisisPersistido = async function (indexPaciente, nroPista) {
    const resultado = await this.cargarAnalisisGuardado(indexPaciente, nroPista, { forzar: true });
    if (!resultado) {
        alert('No se encontraron resultados persistidos para este análisis.');
        return;
    }
    this.abrirResultadosAnalisis(resultado, nroPista, { reutilizarNormalizado: true });
};

app.descargarPdfAnalisisPersistido = async function (indexPaciente, nroPista) {
    const resultado = await this.cargarAnalisisGuardado(indexPaciente, nroPista, { forzar: true });
    if (!resultado) {
        alert('No se encontraron resultados para exportar.');
        return;
    }
    await this.descargarPdfAnalisis(resultado);
};

app.renderizarResumenAnalisis = function (resultado) {
    const metadata = resultado.metadata || {};
    const resumen = document.getElementById('modal-analisis-resumen');
    document.getElementById('modal-analisis-titulo').textContent = `Resultados del análisis - Pista ${resultado.nroPista}`;
    document.getElementById('modal-analisis-subtitulo').textContent = `${resultado.pacienteNombre || 'Paciente'} · ${this.formatearFechaHora(resultado.fechaAnalisis)}`;
    document.getElementById('modal-analisis-encabezado').textContent = `${metadata.tipo_metronomo || 'Tipo no detectado'} · ${metadata.mano || resultado.manoEvaluada || 'Mano no detectada'} · Sujeto ${metadata.sujeto || 'N/D'}`;
    document.getElementById('modal-analisis-archivo').textContent = `Archivo: ${resultado.archivo || 'No disponible'}`;
    document.getElementById('modal-analisis-estado').textContent = resultado.estado || 'Disponible';

    const items = [
        ['Paciente', resultado.pacienteNombre || 'No disponible'],
        ['Pista / evaluación', `Pista ${resultado.nroPista}`],
        ['Tipo', metadata.tipo_metronomo || 'No detectado'],
        ['Mano', metadata.mano || resultado.manoEvaluada || 'No detectada'],
        ['Estado', resultado.estado || 'Disponible'],
        ['Gráficos generados', String(resultado.cantidadGraficos || 0)]
    ];

    resumen.innerHTML = items.map(([label, value]) => `
        <div class="analysis-summary-card">
            <div class="analysis-summary-card-label">${label}</div>
            <div class="analysis-summary-card-value">${value}</div>
        </div>
    `).join('');
};

app.renderizarTabsAnalisis = function (resultado) {
    const tabs = document.getElementById('modal-analisis-categorias');
    const categorias = [
        { key: 'todas', label: `Todas (${resultado.graficos.length})` },
        ...ANALYSIS_CATEGORY_RULES
            .map(cat => ({
                key: cat.key,
                label: `${cat.label} (${resultado.graficos.filter(g => g.categoriaKey === cat.key).length})`
            }))
            .filter(cat => cat.key === 'todas' || resultado.graficos.some(g => g.categoriaKey === cat.key))
    ];

    tabs.innerHTML = categorias.map(cat => `
        <button class="analysis-tab ${resultado.categoriaActiva === cat.key ? 'active' : ''}" onclick="app.cambiarCategoriaAnalisis('${cat.key}')">${cat.label}</button>
    `).join('');
};

app.obtenerGraficosFiltrados = function () {
    if (!this.analisisActivo) return [];
    if (this.analisisActivo.categoriaActiva === 'todas') return this.analisisActivo.graficos;
    return this.analisisActivo.graficos.filter(g => g.categoriaKey === this.analisisActivo.categoriaActiva);
};

app.renderizarGaleriaAnalisis = function () {
    const galeria = document.getElementById('modal-analisis-galeria');
    const graficos = this.obtenerGraficosFiltrados();

    if (!graficos.length) {
        galeria.innerHTML = `
            <div class="analysis-quick-launch text-center text-gray-500">
                No hay gráficos en esta categoría para este análisis.
            </div>
        `;
        return;
    }

    const categoria = this.analisisActivo && this.analisisActivo.categoriaActiva === 'todas'
        ? 'Todos los gráficos'
        : graficos[0].categoria;

    galeria.innerHTML = `
        <div class="analysis-quick-launch">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Categoría activa</p>
                    <h4 class="text-lg font-semibold text-slate-800 mt-1">${categoria}</h4>
                    <p class="analysis-muted mt-1">${graficos.length} gráfico(s). Al elegir una categoría se abre directo el visor grande y podés recorrerlos con anterior / siguiente.</p>
                </div>
                <button onclick="app.abrirPrimerGraficoActivo()" class="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-semibold transition">Abrir visor</button>
            </div>
        </div>
    `;
};

app.cambiarCategoriaAnalisis = function (categoriaKey, abrirVisor = false) {
    if (!this.analisisActivo) return;
    this.analisisActivo.categoriaActiva = categoriaKey;
    this.renderizarTabsAnalisis(this.analisisActivo);
    this.renderizarGaleriaAnalisis();
    if (abrirVisor) {
        this.abrirPrimerGraficoActivo();
    }
};

app.abrirPrimerGraficoActivo = function () {
    const graficos = this.obtenerGraficosFiltrados();
    if (!graficos.length) return;
    this.abrirVisorAnalisis(graficos[0].id);
};

app.renderizarResumenAnalisis = function (resultado) {
    const metadata = resultado.metadata || {};
    const resumen = document.getElementById('modal-analisis-resumen');
    document.getElementById('modal-analisis-titulo').textContent = `Resultados del análisis - Pista ${resultado.nroPista}`;
    document.getElementById('modal-analisis-subtitulo').textContent = `${resultado.pacienteNombre || 'Paciente'} · ${this.formatearFechaHora(resultado.fechaAnalisis)}`;
    document.getElementById('modal-analisis-encabezado').textContent = `${metadata.tipo_metronomo || 'Tipo no detectado'} · ${metadata.mano || resultado.manoEvaluada || 'Mano no detectada'} · Sujeto ${metadata.sujeto || 'N/D'}`;
    document.getElementById('modal-analisis-archivo').textContent = `Archivo: ${resultado.archivo || 'No disponible'}`;
    document.getElementById('modal-analisis-estado').textContent = resultado.estado || 'Disponible';

    const items = [
        ['Paciente', resultado.pacienteNombre || 'No disponible'],
        ['Pista / evaluación', `Pista ${resultado.nroPista}`],
        ['Tipo', metadata.tipo_metronomo || 'No detectado'],
        ['Mano', metadata.mano || resultado.manoEvaluada || 'No detectada'],
        ['Gráficos', String(resultado.cantidadGraficos || 0)],
        ['Estado', resultado.estado || 'Disponible']
    ];

    resumen.innerHTML = items.map(([label, value]) => `
        <div class="analysis-summary-card">
            <div class="analysis-summary-card-label">${label}</div>
            <div class="analysis-summary-card-value">${value}</div>
        </div>
    `).join('');
};

app.renderizarTabsAnalisis = function (resultado) {
    const tabs = document.getElementById('modal-analisis-categorias');
    const categorias = [
        { key: 'todas', label: `Todas (${resultado.graficos.length})` },
        ...ANALYSIS_CATEGORY_RULES
            .map(cat => ({
                key: cat.key,
                label: `${cat.label} (${resultado.graficos.filter(g => g.categoriaKey === cat.key).length})`
            }))
            .filter(cat => cat.key === 'todas' || resultado.graficos.some(g => g.categoriaKey === cat.key))
    ];

    tabs.innerHTML = categorias.map(cat => `
        <button class="analysis-tab ${resultado.categoriaActiva === cat.key ? 'active' : ''}" onclick="app.cambiarCategoriaAnalisis('${cat.key}')">${cat.label}</button>
    `).join('');
};

app.renderizarGaleriaAnalisis = function () {
    const galeria = document.getElementById('modal-analisis-galeria');
    const graficos = this.obtenerGraficosFiltrados();

    if (!graficos.length) {
        galeria.innerHTML = `
            <div class="analysis-empty-state text-center text-gray-500">
                No hay gráficos en esta categoría para este análisis.
            </div>
        `;
        return;
    }

    galeria.innerHTML = `
        <div class="analysis-gallery-grid">
            ${graficos.map(item => `
                <article class="analysis-graph-card">
                    <button onclick="app.abrirVisorAnalisis('${item.id}')" class="analysis-graph-thumb" title="Abrir ${item.titulo}">
                        ${item.tipo === 'html'
                            ? `<div class="analysis-graph-placeholder">
                                <span class="analysis-graph-placeholder-badge">Interactivo</span>
                                <span class="analysis-graph-placeholder-title">${item.titulo}</span>
                               </div>`
                            : `<img src="${item.url}" alt="${item.titulo}" loading="lazy">`}
                    </button>
                    <div class="analysis-graph-card-body">
                        <div class="min-w-0">
                            <p class="analysis-graph-category">${item.categoria}</p>
                            <h4 class="analysis-graph-title">${item.titulo}</h4>
                            <p class="analysis-muted truncate mt-1">${item.nombre}</p>
                        </div>
                        <button onclick="app.abrirVisorAnalisis('${item.id}')" class="analysis-open-btn">Abrir</button>
                    </div>
                </article>
            `).join('')}
        </div>
    `;
};

app.cambiarCategoriaAnalisis = function (categoriaKey) {
    if (!this.analisisActivo) return;
    this.analisisActivo.categoriaActiva = categoriaKey;
    this.renderizarTabsAnalisis(this.analisisActivo);
    this.renderizarGaleriaAnalisis();
};

app.abrirResultadosAnalisis = function (data, nroPista, context = {}) {
    const resultado = context.reutilizarNormalizado
        ? { ...data, categoriaActiva: data.categoriaActiva || 'todas' }
        : this.normalizarResultadoAnalisis(data, nroPista, context);

    this.analisisActivo = resultado;
    this.persistirResultadoAnalisis(resultado);
    this.renderizarResumenAnalisis(resultado);
    this.renderizarTabsAnalisis(resultado);
    this.renderizarGaleriaAnalisis();

    document.getElementById('btn-analisis-ver-resultados').onclick = () => this.abrirPrimerGraficoActivo();
    document.getElementById('btn-analisis-pdf').onclick = () => this.descargarPdfAnalisis(this.analisisActivo);

    document.getElementById('modal-analisis').classList.remove('hidden');
    lucide.createIcons();
};

app.abrirVisorAnalisis = function (graficoId) {
    const graficos = this.obtenerGraficosFiltrados();
    const indice = graficos.findIndex(item => item.id === graficoId);
    if (indice < 0) return;
    this.visorAnalisis = { indice, graficos };
    this.actualizarVisorAnalisis();
    document.getElementById('modal-analisis-visor').classList.remove('hidden');
};

app.actualizarVisorAnalisis = function () {
    if (!this.visorAnalisis || !this.visorAnalisis.graficos.length) return;
    const actual = this.visorAnalisis.graficos[this.visorAnalisis.indice];
    document.getElementById('visor-analisis-categoria').textContent = `${actual.categoria} · ${this.visorAnalisis.indice + 1} de ${this.visorAnalisis.graficos.length}`;
    document.getElementById('visor-analisis-titulo').textContent = actual.titulo;
    document.getElementById('visor-analisis-contenido').innerHTML = actual.tipo === 'html'
        ? `<iframe src="${actual.url}" class="w-full rounded-2xl bg-white" style="min-height:72vh;border:0;"></iframe>`
        : `<div class="bg-white rounded-2xl p-3"><img src="${actual.url}" alt="${actual.titulo}" class="w-full h-auto rounded-xl"></div>`;
    document.getElementById('btn-visor-anterior').onclick = () => {
        this.visorAnalisis.indice = (this.visorAnalisis.indice - 1 + this.visorAnalisis.graficos.length) % this.visorAnalisis.graficos.length;
        this.actualizarVisorAnalisis();
    };
    document.getElementById('btn-visor-siguiente').onclick = () => {
        this.visorAnalisis.indice = (this.visorAnalisis.indice + 1) % this.visorAnalisis.graficos.length;
        this.actualizarVisorAnalisis();
    };
    lucide.createIcons();
};

app.cerrarVisorAnalisis = function () {
    document.getElementById('modal-analisis-visor').classList.add('hidden');
};

app.cargarImagenComoDataUrl = function (src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext('2d').drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = src;
    });
};

app.capturarGraficoHtml = function (src) {
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.left = '-10000px';
        iframe.style.top = '0';
        iframe.style.width = '1600px';
        iframe.style.height = '900px';
        iframe.src = src;
        document.body.appendChild(iframe);

        const limpiar = () => iframe.remove();
        iframe.onload = async () => {
            try {
                const plot = iframe.contentDocument && iframe.contentDocument.querySelector('.js-plotly-plot');
                const Plotly = iframe.contentWindow && iframe.contentWindow.Plotly;
                if (plot && Plotly && typeof Plotly.toImage === 'function') {
                    const dataUrl = await Plotly.toImage(plot, { format: 'png', width: 1600, height: 900 });
                    limpiar();
                    resolve(dataUrl);
                    return;
                }
            } catch (error) {
            }
            limpiar();
            resolve(null);
        };
        iframe.onerror = () => {
            limpiar();
            resolve(null);
        };
    });
};

app.extraerImagenPdfGrafico = async function (grafico) {
    if (grafico.tipo === 'html') {
        return this.capturarGraficoHtml(grafico.url);
    }
    return this.cargarImagenComoDataUrl(grafico.url);
};

app.descargarPdfAnalisis = async function (resultado) {
    if (!window.jspdf || !resultado) {
        alert('No se pudo preparar el PDF del análisis.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 14;
    const metadata = resultado.metadata || {};

    doc.setFillColor(74, 92, 146);
    doc.rect(0, 0, pageW, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Resultados de análisis', margin, 16);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`${resultado.pacienteNombre || 'Paciente'} · Pista ${resultado.nroPista}`, margin, 22);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    let y = 36;
    [
        ['Fecha del análisis', this.formatearFechaHora(resultado.fechaAnalisis)],
        ['Archivo', resultado.archivo || 'No disponible'],
        ['Tipo', metadata.tipo_metronomo || 'No detectado'],
        ['Mano', metadata.mano || resultado.manoEvaluada || 'No detectada'],
        ['Sujeto', metadata.sujeto || 'No detectado'],
        ['Duración', resultado.video.duracion_segundos != null ? `${resultado.video.duracion_segundos} s` : 'No disponible'],
        ['FPS', resultado.video.fps != null ? String(resultado.video.fps) : 'No disponible'],
        ['Cantidad de gráficos', String(resultado.graficos.length)]
    ].forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value), margin + 38, y);
        y += 6;
    });

    for (const grafico of resultado.graficos) {
        doc.addPage();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text(grafico.titulo, margin, 18);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(grafico.categoria, margin, 24);

        const imagen = await this.extraerImagenPdfGrafico(grafico);
        if (imagen) {
            const imgProps = doc.getImageProperties(imagen);
            const maxW = pageW - margin * 2;
            const maxH = pageH - 40;
            const ratio = Math.min(maxW / imgProps.width, maxH / imgProps.height);
            const renderW = imgProps.width * ratio;
            const renderH = imgProps.height * ratio;
            doc.addImage(imagen, 'PNG', margin, 30, renderW, renderH, undefined, 'FAST');
        } else {
            doc.setTextColor(220, 38, 38);
            doc.text('No fue posible rasterizar este gráfico automáticamente desde el frontend.', margin, 36);
            doc.setTextColor(59, 130, 246);
            doc.textWithLink('Abrir recurso original', margin, 44, { url: grafico.url });
        }
    }

    const nombre = `Analisis_${(resultado.pacienteNombre || 'Paciente').replace(/\s+/g, '_')}_P${resultado.nroPista}.pdf`;
    doc.save(nombre);
};

app.verResultadosAnalisis = function (data, nroPista, context = {}) {
    return this.abrirResultadosAnalisis(data, nroPista, context);
};

app.cerrarAnalisisModal = function () {
    this.cerrarVisorAnalisis();
    document.getElementById('modal-analisis').classList.add('hidden');
};

const __appInitOriginal = app.init.bind(app);
app.init = function () {
    this.analisisPersistidos = this.leerAnalisisPersistidos();
    __appInitOriginal();
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (!document.getElementById('modal-analisis-visor').classList.contains('hidden')) {
                this.cerrarVisorAnalisis();
                return;
            }
            if (!document.getElementById('modal-analisis').classList.contains('hidden')) {
                this.cerrarAnalisisModal();
            }
        }
    });
};

const __verDetallePacienteOriginal = app.verDetallePaciente.bind(app);
app.verDetallePaciente = async function (index) {
    this.pacienteActual = { index, paciente: this.pacientes[index] || null };
    await __verDetallePacienteOriginal(index);
    const paciente = this.pacientes[index] || {};
    await this.cargarAnalisisDisponibles(index, paciente.evaluaciones_detalladas || []);
};

const __analizarVideoOriginal = app.analizarVideo.bind(app);
app.analizarVideo = async function (indexPaciente, nroPista) {
    alert(`Iniciando análisis de la pista ${nroPista} con Python. Esto puede demorar unos minutos...`);
    const response = await fetch(`${CONFIG.API_URL}/${indexPaciente}/analizar/${nroPista}`, { method: 'POST' }).catch(() => null);
    if (!response) {
        alert('No se pudo conectar con el servidor para analizar el video.');
        return;
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const detalleTexto = this.formatearDetalleError(data);
        alert(`Error en el análisis: ${data.error || data.message || 'Sin detalle'}\n\n${detalleTexto}`);
        return;
    }

    const paciente = this.pacientes[indexPaciente] || {};
    const evaluacion = (paciente.evaluaciones_detalladas || []).find(ev => String(ev.nro_pista) === String(nroPista)) || {};
    const resultado = this.normalizarResultadoAnalisis(data, nroPista, {
        indexPaciente,
        paciente,
        evaluacion,
        origen: 'runtime'
    });
    this.persistirResultadoAnalisis(resultado);
    this.renderizarAnalisisDisponibles(indexPaciente, paciente.evaluaciones_detalladas || []);
    this.adjuntarAccionesAnalisisACelda(indexPaciente, nroPista);
    this.abrirResultadosAnalisis(resultado, nroPista, { reutilizarNormalizado: true });
};

// ==========================================
// MÓDULO DEL PROTOCOLO
// ==========================================

// NUEVA FUNCIÓN: Obtiene el valor de los inputs de forma 100% segura
const obtenerValorSeguro = (id) => {
    const elemento = document.getElementById(id);
    return elemento ? elemento.value : "";
};

const protocolo = {
    // agregadoGemini
    analizarVideo: async function(pistaNumero) {
        if (!app.pacienteActual) return;
        const index = app.pacienteActual.index;
        
        alert(`Iniciando análisis de la pista ${pistaNumero} con Python. Esto demorará unos segundos...`);

        try {
            const response = await fetch(`http://localhost:3000/api/pacientes/${index}/analizar/${pistaNumero}`, {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {
                console.log("✅ RESULTADO DEL ANÁLISIS:", data);
                const metadata = data.metadata_extraida || {};
                const video = (data.analisis && data.analisis.video) || {};
                alert(
                    `¡Análisis completado!\n\n` +
                    `Archivo: ${data.archivo || 'Sin nombre'}\n` +
                    `Tipo: ${metadata.tipo_metronomo || 'No detectado'}\n` +
                    `Mano: ${metadata.mano || 'No detectada'}\n` +
                    `Duración: ${video.duracion_segundos ?? 'No disponible'} s`
                );
                app.verResultadosAnalisis(data, pistaNumero);
            } else {
                const detalleTexto = app.formatearDetalleError(data);
                console.error("❌ Error del servidor:", data);
                console.error("❌ Detalle del error:", detalleTexto);
                alert(`Error: ${data.error || data.message || 'Revisa la consola'}\n\n${detalleTexto}`);
            }
        } catch (error) {
            console.error("Error al analizar:", error);
            alert("No se pudo conectar con el servidor para analizar.");
        }
    }, // hasta aca
    pasoActual: 1,
    playlistFinal: [],
    indiceAudioActual: 0,
    resultadosPistas: [],

    irPaso: function (numeroPaso) {
        if (this.pasoActual === 3 && numeroPaso === 4) {
            // Usamos obtenerValorSeguro para evitar errores si el HTML cambia
            const nombreVal = obtenerValorSeguro('dat-nombre');
            const manoVal = obtenerValorSeguro('dat-mano-inicio');

            if (!nombreVal || !manoVal) {
                alert("Completa los datos obligatorios, incluyendo el nombre y la mano de inicio.");
                return;
            }
        }
        document.querySelectorAll('.paso-container').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('block');
        });

        document.getElementById(`paso-${numeroPaso}`).classList.remove('hidden');
        document.getElementById(`paso-${numeroPaso}`).classList.add('block');

        for (let i = 1; i <= 4; i++) {
            const ind = document.getElementById(`ind-paso-${i}`);
            if (ind) {
                ind.className = (i <= numeroPaso) ? "text-primary border-b-2 border-primary pb-1 font-bold transition-all" : "text-gray-400 font-medium transition-all";
            }
        }
        this.pasoActual = numeroPaso;
    },

    reiniciar: function () {
        const form = document.getElementById('evaluationFormMedicion');
        if (form) form.reset();

        this.irPaso(1);
        this.playlistFinal = [];
        this.indiceAudioActual = 0;
        this.resultadosPistas = [];

        const zonaRep = document.getElementById('zona-reproductor');
        if (zonaRep) zonaRep.classList.add('hidden');

        const btnGen = document.getElementById('btn-generar-playlist');
        if (btnGen) btnGen.classList.remove('hidden');

        const btnSiguiente = document.getElementById('btn-siguiente-audio');
        if (btnSiguiente) {
            btnSiguiente.disabled = false;
            btnSiguiente.classList.remove('opacity-50', 'cursor-not-allowed');
            btnSiguiente.innerHTML = 'Guardar y Siguiente Pista <i data-lucide="skip-forward" class="w-5 h-5"></i>';
        }

        const audioPlayer = document.getElementById('stimulusAudioPlayer');
        if (audioPlayer) audioPlayer.src = '';
    },

    generarBloque13: function (manoDesignada) {
        let bloque = [];
        ESTRUCTURA_DE_AUDIOS.isocronos.forEach(audio => bloque.push({ archivo: audio, mano: manoDesignada }));
        ESTRUCTURA_DE_AUDIOS.abruptos.forEach(subcategoria => {
            const elegido = subcategoria[Math.floor(Math.random() * subcategoria.length)];
            bloque.push({ archivo: elegido, mano: manoDesignada });
        });
        ESTRUCTURA_DE_AUDIOS.rampa.forEach(subcategoria => {
            const elegido = subcategoria[Math.floor(Math.random() * subcategoria.length)];
            bloque.push({ archivo: elegido, mano: manoDesignada });
        });
        return bloque.sort(() => Math.random() - 0.5);
    },

    generarPlaylistCompleta: function () {
        const manoInicio = obtenerValorSeguro('dat-mano-inicio');
        const otraMano = (manoInicio === 'Derecha') ? 'Izquierda' : 'Derecha';

        const bloque1 = this.generarBloque13(manoInicio);
        const bloque2 = this.generarBloque13(otraMano);

        this.playlistFinal = [...bloque1, ...bloque2];
        this.indiceAudioActual = 0;
        this.resultadosPistas = [];

        document.getElementById('zona-reproductor').classList.remove('hidden');
        document.getElementById('btn-generar-playlist').classList.add('hidden');

        this.cargarAudioActual(false);
    },

    cargarAudioActual: function (autoplay = true) {
        const itemActual = this.playlistFinal[this.indiceAudioActual];

        const nombreLimpio = itemActual.archivo.split('/').pop();
        document.getElementById('nombre-audio-actual').textContent = nombreLimpio;
        document.getElementById('contador-audio').textContent = this.indiceAudioActual + 1;

        const indicador = document.getElementById('indicador-mano');
        indicador.textContent = itemActual.mano.toUpperCase();
        indicador.className = itemActual.mano === 'Derecha'
            ? "text-4xl font-black text-blue-600 tracking-wider"
            : "text-4xl font-black text-green-600 tracking-wider";

        const reproductor = document.getElementById('stimulusAudioPlayer');

        let rutaSegura = `audios/${itemActual.archivo}`;
        rutaSegura = encodeURI(rutaSegura).replace(/\+/g, '%2B');

        reproductor.src = rutaSegura;
        reproductor.load();
        this.actualizarEstadoTempoVariations();

        if (autoplay) {
            reproductor.play().catch(e => console.log("El navegador requiere interacción previa.", e));
        }
    },

    audioActualEsIsocrono: function () {
        const itemActual = this.playlistFinal[this.indiceAudioActual];
        if (!itemActual || !itemActual.archivo) return false;

        const archivoNormalizado = String(itemActual.archivo)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        return archivoNormalizado.includes('isocrono') || ESTRUCTURA_DE_AUDIOS.isocronos.includes(itemActual.archivo);
    },

    actualizarEstadoTempoVariations: function () {
        const selectTempo = document.getElementById('skill-tempo');
        if (!selectTempo) return;

        const esIsocrono = this.audioActualEsIsocrono();
        if (esIsocrono) {
            selectTempo.value = 'No evaluado';
        }

        selectTempo.disabled = esIsocrono;
        selectTempo.classList.toggle('bg-gray-100', esIsocrono);
        selectTempo.classList.toggle('text-gray-400', esIsocrono);
        selectTempo.classList.toggle('cursor-not-allowed', esIsocrono);
        selectTempo.classList.toggle('opacity-80', esIsocrono);
        selectTempo.classList.toggle('bg-white', !esIsocrono);
        selectTempo.title = esIsocrono ? 'Tempo Variations no aplica en audios isocronos.' : '';
    },

    siguienteAudio: function () {
        const itemActual = this.playlistFinal[this.indiceAudioActual];
        const pistaEvaluada = {
            nro_pista: this.indiceAudioActual + 1,
            archivo: itemActual.archivo,
            mano_evaluada: itemActual.mano,
            rhythm_identification: obtenerValorSeguro('skill-rhythm') || "No evaluado",
            tempo_variations: obtenerValorSeguro('skill-tempo') || "No evaluado",
            rhythmic_accuracy: obtenerValorSeguro('skill-accuracy') || "No evaluado"
        };

        this.resultadosPistas.push(pistaEvaluada);

        if (this.indiceAudioActual < this.playlistFinal.length - 1) {
            this.indiceAudioActual++;
            this.cargarAudioActual(true);

            const sr = document.getElementById('skill-rhythm');
            const st = document.getElementById('skill-tempo');
            const sa = document.getElementById('skill-accuracy');
            if (sr) sr.value = "No evaluado";
            if (st) st.value = "No evaluado";
            if (sa) sa.value = "No evaluado";
            this.actualizarEstadoTempoVariations();
        } else {
            document.getElementById('contador-audio').textContent = "26";
            document.getElementById('nombre-audio-actual').textContent = "BATERÍA COMPLETADA";

            const btnSiguiente = document.getElementById('btn-siguiente-audio');
            btnSiguiente.disabled = true;
            btnSiguiente.classList.add('opacity-50', 'cursor-not-allowed');
            btnSiguiente.innerHTML = 'Evaluación Finalizada <i data-lucide="check-circle" class="w-5 h-5"></i>';
            lucide.createIcons();

            alert("¡Excelente! Has completado la evaluación de los 26 audios. Haz clic en 'Finalizar y Guardar Sesión Completa'.");
        }
    },

    guardarEvaluacion: async function (evento) {
        evento.preventDefault();

        if (this.resultadosPistas.length < this.playlistFinal.length) {
            const confirmar = confirm(`Has evaluado ${this.resultadosPistas.length} de ${this.playlistFinal.length} pistas. ¿Seguro que deseas guardar la sesión incompleta?`);
            if (!confirmar) return;
        }

        // USO DE LA FUNCIÓN SEGURA PARA EVITAR CRASHES
        const datosCompletos = {
            fecha: obtenerValorSeguro('dat-fecha') || new Date().toISOString(),
            nombre: obtenerValorSeguro('dat-nombre'),
            email: obtenerValorSeguro('dat-email'),
            investigador: obtenerValorSeguro('dat-investigador'),
            medicacion: obtenerValorSeguro('dat-medicacion'),
            psicopatologia: obtenerValorSeguro('dat-psicopatologia'),
            diagnostico: obtenerValorSeguro('dat-diagnostico'),
            dominancia: obtenerValorSeguro('dat-dominancia'),
            tipo_registro: 'adulto',
            manoInicio: obtenerValorSeguro('dat-mano-inicio'),
            medidasManos: {
                md_mayor: obtenerValorSeguro('dat-mano-md-mayor'),
                md_indice: obtenerValorSeguro('dat-mano-md-indice'),
                mi_mayor: obtenerValorSeguro('dat-mano-mi-mayor'),
                mi_indice: obtenerValorSeguro('dat-mano-mi-indice')
            },
            evaluaciones_detalladas: this.resultadosPistas
        };

        try {
            const respuesta = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosCompletos)
            });

            if (respuesta.ok) {
                alert("Evaluación clínica guardada con éxito en el servidor.");
                app.cambiarVista('pacientes');
            } else {
                // Mejora: Mostrar el mensaje de error real que manda el servidor Node.js
                const mensajeError = await respuesta.text();
                alert(`Hubo un problema guardando en el servidor.\nDetalle: ${mensajeError}`);
            }
        } catch (error) {
            console.error("Error al conectar:", error);
            alert("Error al conectar con el servidor Node.js en localhost:3000. Revisa que el servidor esté corriendo.");
        }
    }
};

protocolo.analizarVideo = async function (pistaNumero) {
    if (!app.pacienteActual || app.pacienteActual.index == null) {
        alert('No hay un paciente activo asociado para ejecutar este análisis.');
        return;
    }
    await app.analizarVideo(app.pacienteActual.index, pistaNumero);
};

app.obtenerClaseValorClinico = function (valor) {
    if (!valor || valor === 'No evaluado') return 'track-clinical-empty';
    if (valor === 'Consistente') return 'track-clinical-good';
    if (valor === 'Rara vez') return 'track-clinical-mid';
    return 'track-clinical-bad';
};

app.renderizarBadgeClinico = function (valor) {
    const texto = valor || 'No evaluado';
    return `<span class="track-clinical-badge ${this.obtenerClaseValorClinico(texto)}">${texto}</span>`;
};

app.obtenerResultadoAnalisisPista = function (indexPaciente, nroPista) {
    return this.analisisPersistidos[this.crearClaveAnalisis(indexPaciente, nroPista)] || null;
};

app.renderizarResumenOperativoModal = function (indexPaciente, evals, videos) {
    let contenedor = document.getElementById('modal-resumen-operativo');
    const host = document.querySelector('#modal-detalle .overflow-x-auto');
    if (!host) return;

    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'modal-resumen-operativo';
        contenedor.className = 'flex flex-wrap gap-2 mb-4';
        host.parentNode.insertBefore(contenedor, host);
    }

    const total = (evals || []).length;
    const videosCargados = Object.keys(videos || {}).length;
    const analizados = (evals || []).filter(ev => this.obtenerResultadoAnalisisPista(indexPaciente, ev.nro_pista)).length;
    const pendientes = total - videosCargados;

    contenedor.innerHTML = `
        <span class="track-summary-pill">${total} pistas</span>
        <span class="track-summary-pill">${videosCargados} videos cargados</span>
        <span class="track-summary-pill">${analizados} análisis listos</span>
        <span class="track-summary-pill">${pendientes} pendientes</span>
    `;
};

app.configurarTablaOperativaModal = function () {
    const bloqueAnalisis = document.getElementById('modal-analisis-disponibles');
    if (bloqueAnalisis && bloqueAnalisis.parentElement) {
        bloqueAnalisis.parentElement.style.display = 'none';
    }

    const thead = document.querySelector('#modal-detalle table thead tr');
    if (!thead) return;

    thead.innerHTML = `
        <th class="w-12">N°</th>
        <th class="w-20">Mano</th>
        <th>Archivo audio</th>
        <th>Ritmo</th>
        <th>Tempo</th>
        <th>Precisión</th>
        <th class="w-36 text-center">Estado</th>
        <th class="w-64 text-center">Acciones</th>
    `;
};

app.renderizarEstadoPista = function ({ tieneVideo, tieneAnalisis }) {
    const badges = [];
    if (!tieneVideo) {
        badges.push('<span class="track-state-badge track-state-empty">Sin video</span>');
    } else {
        badges.push('<span class="track-state-badge track-state-video">Video cargado</span>');
    }
    if (tieneAnalisis) {
        badges.push('<span class="track-state-badge track-state-analysis">Analizado</span>');
        badges.push('<span class="track-state-badge track-state-pdf">PDF disponible</span>');
    }
    return `<div class="flex flex-wrap items-center justify-center gap-1">${badges.join('')}</div>`;
};

app.renderizarAccionesPista = function (indexPaciente, pista, rutaVideo, tieneAnalisis) {
    if (!rutaVideo) {
        return `
            <label class="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold transition">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i> Subir video
                <input type="file" accept="video/*" class="hidden" onchange="app.subirVideo(${indexPaciente}, ${pista}, this)">
            </label>
        `;
    }

    if (tieneAnalisis) {
        return `
            <div class="flex flex-wrap items-center justify-center gap-2">
                <button onclick="app.abrirAnalisisPersistido(${indexPaciente}, ${pista})" class="track-action-primary">Ver gráficos</button>
                <button onclick="app.descargarPdfAnalisisPersistido(${indexPaciente}, ${pista})" class="track-action-secondary">PDF</button>
                <button onclick="app.verVideo('${rutaVideo}', ${pista})" class="track-action-secondary">Video</button>
                <button onclick="app.eliminarVideo(${indexPaciente}, ${pista})" class="track-action-secondary">Eliminar</button>
            </div>
        `;
    }

    return `
        <div class="flex flex-wrap items-center justify-center gap-2">
            <button onclick="app.analizarVideo(${indexPaciente}, ${pista})" class="track-action-primary">Analizar</button>
            <button onclick="app.verVideo('${rutaVideo}', ${pista})" class="track-action-secondary">Ver video</button>
            <button onclick="app.eliminarVideo(${indexPaciente}, ${pista})" class="track-action-secondary">Eliminar</button>
        </div>
    `;
};

app.verDetallePaciente = async function (index) {
    const p = this.pacientes[index];
    if (!p) return;
    this._modalPacienteIndex = index;
    this.pacienteActual = { index, paciente: p };

    document.getElementById('modal-titulo').textContent = p.nombre || 'Paciente';
    document.getElementById('modal-subtitulo').textContent =
        `${p.diagnostico || ''} · ${p.dominancia || ''} · ${p.fecha ? new Date(p.fecha).toLocaleDateString() : ''}`;

    const infoDiv = document.getElementById('modal-info');
    infoDiv.innerHTML = `
        <div class="bg-white px-3 py-2 rounded-lg border"><span class="text-gray-500 text-xs block">Investigador</span><span class="font-semibold text-gray-800">${p.investigador || 'N/A'}</span></div>
        <div class="bg-white px-3 py-2 rounded-lg border"><span class="text-gray-500 text-xs block">Mano hábil</span><span class="font-semibold text-gray-800">${p.dominancia || 'N/A'}</span></div>
        <div class="bg-white px-3 py-2 rounded-lg border"><span class="text-gray-500 text-xs block">Mano Inicio</span><span class="font-semibold text-gray-800">${p.manoInicio || 'N/A'}</span></div>
        <div class="bg-white px-3 py-2 rounded-lg border"><span class="text-gray-500 text-xs block">Medicación</span><span class="font-semibold text-gray-800">${p.medicacion || 'Ninguna'}</span></div>
    `;

    this.configurarTablaOperativaModal();

    const tbody = document.getElementById('modal-tabla-body');
    tbody.innerHTML = '';

    const evals = p.evaluaciones_detalladas || [];
    evals.forEach(ev => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 transition-colors";
        tr.innerHTML = `
            <td class="text-center font-bold text-primary">${ev.nro_pista}</td>
            <td class="text-center"><span class="px-2 py-0.5 rounded text-xs font-bold ${ev.mano_evaluada === 'Derecha' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">${ev.mano_evaluada}</span></td>
            <td class="text-xs font-mono text-gray-600 break-all max-w-[220px]">${ev.archivo.split('/').pop()}</td>
            <td class="text-center text-sm">${this.renderizarBadgeClinico(ev.rhythm_identification)}</td>
            <td class="text-center text-sm">${this.renderizarBadgeClinico(ev.tempo_variations)}</td>
            <td class="text-center text-sm">${this.renderizarBadgeClinico(ev.rhythmic_accuracy)}</td>
            <td class="text-center align-middle" id="status-cell-${ev.nro_pista}">
                <span class="text-gray-400 text-xs">Cargando...</span>
            </td>
            <td class="text-center align-middle" id="video-cell-${ev.nro_pista}">
                <span class="text-gray-400 text-xs">Cargando...</span>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('modal-detalle').classList.remove('hidden');
    lucide.createIcons();

    await Promise.all(evals.map(ev => this.cargarAnalisisGuardado(index, ev.nro_pista)));
    await this.cargarEstadoVideos(index, evals);
};

app.cargarEstadoVideos = async function (index, evals) {
    try {
        const resp = await fetch(`${CONFIG.API_URL}/${index}/videos`);
        const data = await resp.json();
        const videos = data.videos || {};
        let countVideos = 0;

        evals.forEach(ev => {
            const pista = ev.nro_pista;
            const rutaVideo = videos[pista];
            const tieneVideo = Boolean(rutaVideo);
            const tieneAnalisis = Boolean(this.obtenerResultadoAnalisisPista(index, pista));
            const cell = document.getElementById(`video-cell-${pista}`);
            const statusCell = document.getElementById(`status-cell-${pista}`);

            if (tieneVideo) countVideos++;
            if (statusCell) statusCell.innerHTML = this.renderizarEstadoPista({ tieneVideo, tieneAnalisis });
            if (cell) cell.innerHTML = this.renderizarAccionesPista(index, pista, rutaVideo, tieneAnalisis);
        });

        document.getElementById('modal-contador-videos').textContent = `${countVideos} de ${evals.length} videos`;
        this.renderizarResumenOperativoModal(index, evals, videos);
        lucide.createIcons();
    } catch (error) {
        console.error("Error cargando videos:", error);
    }
};

app.cargarAnalisisDisponibles = async function (indexPaciente, evals) {
    await Promise.all((evals || []).map(ev => this.cargarAnalisisGuardado(indexPaciente, ev.nro_pista)));
};

app.calcularResumenHome = function () {
    const pacientes = Array.isArray(this.pacientes) ? this.pacientes : [];
    const totalPacientes = pacientes.length;
    const evaluacionesEnCurso = pacientes.filter(p => Array.isArray(p.evaluaciones_detalladas) && p.evaluaciones_detalladas.length > 0).length;
    const analisisListos = Object.keys(this.analisisPersistidos || {}).length;
    const analisisPendientes = pacientes.reduce((acc, paciente, indexPaciente) => {
        const evals = Array.isArray(paciente.evaluaciones_detalladas) ? paciente.evaluaciones_detalladas : [];
        return acc + evals.filter(ev => !this.obtenerResultadoAnalisisPista(indexPaciente, ev.nro_pista)).length;
    }, 0);

    return [
        `${evaluacionesEnCurso} evaluaciones en curso`,
        `${totalPacientes} pacientes registrados`,
        `${analisisPendientes} análisis pendientes`,
        `${analisisListos} análisis listos`
    ];
};

app.obtenerItemsContinuarTrabajo = function () {
    const pacientes = (this.pacientes || [])
        .map((paciente, index) => ({ paciente, index }))
        .sort((a, b) => new Date(b.paciente.fecha || 0) - new Date(a.paciente.fecha || 0));

    const items = [];

    pacientes.slice(0, 3).forEach(({ paciente, index }) => {
        items.push({
            key: `paciente-${index}`,
            titulo: paciente.nombre || 'Paciente',
            subtitulo: 'Paciente reciente',
            estado: paciente.diagnostico || 'Sin diagnóstico',
            accion: 'Abrir',
            handler: `app.abrirPacienteDesdeHome(${index})`
        });
    });

    pacientes.forEach(({ paciente, index }) => {
        const evals = Array.isArray(paciente.evaluaciones_detalladas) ? paciente.evaluaciones_detalladas : [];
        if (!evals.length || items.length >= 6) return;
        const analizados = evals.filter(ev => this.obtenerResultadoAnalisisPista(index, ev.nro_pista)).length;
        items.push({
            key: `curso-${index}`,
            titulo: paciente.nombre || 'Paciente',
            subtitulo: 'Evaluación en curso',
            estado: `${analizados} de ${evals.length} análisis disponibles`,
            accion: 'Continuar',
            handler: `app.abrirPacienteDesdeHome(${index})`
        });
    });

    return items.slice(0, 6);
};

app.renderizarInicioPanel = function () {
    const resumen = document.getElementById('home-resumen');
    const trabajo = document.getElementById('home-continuar-trabajo');
    if (!resumen || !trabajo) return;

    resumen.innerHTML = this.calcularResumenHome().map(item => `
        <span class="track-summary-pill">${item}</span>
    `).join('');

    const items = this.obtenerItemsContinuarTrabajo();
    if (!items.length) {
        trabajo.innerHTML = `
            <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                No hay evaluaciones recientes para continuar.
            </div>
        `;
        return;
    }

    trabajo.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${items.map(item => `
                <article class="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div class="min-w-0">
                        <p class="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">${item.subtitulo}</p>
                        <h4 class="text-base font-semibold text-slate-800 mt-1 truncate">${item.titulo}</h4>
                        <p class="text-sm text-slate-500 mt-1">${item.estado}</p>
                    </div>
                    <button onclick="${item.handler}" class="track-action-secondary">${item.accion}</button>
                </article>
            `).join('')}
        </div>
    `;
};

app.abrirPacienteDesdeHome = function (index) {
    this.cambiarVista('pacientes');
    setTimeout(() => this.verDetallePaciente(index), 0);
};

app.abrirPacienteNinoDesdeRegistro = function (index) {
    this.bnpmPacienteSeleccionadoA = String(index);
    this.bnpmPacienteSeleccionadoB = String(index);
    this.cambiarVista('evaluacion-nino');
};

const __appVerificarConexionOriginal = app.verificarConexion.bind(app);
app.verificarConexion = async function () {
    await __appVerificarConexionOriginal();
    this.renderizarInicioPanel();
};

const __appCambiarVistaOriginal = app.cambiarVista.bind(app);
app.cambiarVista = function (vistaId) {
    __appCambiarVistaOriginal(vistaId);
    if (vistaId === 'inicio') {
        this.renderizarInicioPanel();
    }
};

const BNPM_STORAGE_KEY = 'neuroMusicaBNPMV1';
const BNPM_FREQUENCY_OPTIONS = ['Nunca', 'Raramente', 'A veces', 'Frecuentemente', 'Siempre'];
const BNPM_SCALE_04 = ['0', '1', '2', '3', '4'];
const BNPM_SCALE_15 = ['1', '2', '3', '4', '5'];

const BNPM_MODULE_A_SECTIONS = [
    {
        title: 'Datos basicos',
        copy: 'Informacion general que contextualiza la evaluacion familiar.',
        fields: [
            { type: 'text', name: 'child_name', label: 'Nombre completo del nino o nina' },
            { type: 'date', name: 'child_birth_date', label: 'Fecha de nacimiento' },
            { type: 'number', name: 'child_age', label: 'Edad' },
            { type: 'text', name: 'respondent_name', label: 'Quien responde' },
            { type: 'text', name: 'respondent_relation', label: 'Relacion con el nino' },
            { type: 'date', name: 'form_date', label: 'Fecha' },
            { type: 'text', name: 'referral_source', label: 'Derivacion' },
            { type: 'textarea', name: 'consultation_reason', label: 'Motivo de consulta', wide: true }
        ]
    },
    {
        title: '1. Silencio, ambiente sonoro en el hogar y comportamientos espontaneos',
        fields: [
            { type: 'radio', name: 'home_sound_environment', label: 'Como describirias el ambiente habitual de la casa?', options: ['Muy silenciosa', 'Silencio moderado', 'Ruidos normales', 'Bastante ruidosa', 'Muy ruidosa'], wide: true },
            { type: 'radio', name: 'school_sound_environment', label: 'Como describirias el ambiente habitual de la institucion educativa?', options: ['Muy silenciosa', 'Silencio moderado', 'Ruidos normales', 'Bastante ruidosa', 'Muy ruidosa'], wide: true },
            { type: 'checkbox-group', name: 'silence_behavior', label: 'Como se comporta cuando se encuentra en silencio?', options: ['Se muestra tranquila', 'Se inquieta', 'Busca generar sonidos', 'Pide que pongan musica', 'No se observan cambios'], wide: true },
            { type: 'text', name: 'silence_behavior_other', label: 'Otros comportamientos observados' },
            { type: 'radio', name: 'vocalizes_in_silence', label: 'Vocaliza mas cuando el ambiente esta silencioso?', options: ['Si', 'No', 'A veces'] },
            { type: 'text', name: 'vocalizes_in_silence_notes', label: 'Observaciones sobre vocalizaciones' },
            { type: 'checkbox-group', name: 'self_stimulation_sound', label: 'Cuando no hay musica, hace alguna de estas cosas?', options: ['Golpea superficies', 'Mueve objetos que suenan', 'Juguetea con el timbre de su voz', 'Busca objetos que vibren', 'Produce sonidos repetitivos'], wide: true },
            { type: 'text', name: 'self_stimulation_other', label: 'Otra conducta sonora' }
        ]
    },
    {
        title: '2. Respuestas espontaneas a la musica',
        fields: [
            { type: 'radio', name: 'music_seek_frequency', label: 'Busca musica por iniciativa propia?', options: BNPM_FREQUENCY_OPTIONS },
            { type: 'checkbox-group', name: 'first_response_music', label: 'Cuando suena musica, que suele hacer primero?', options: ['Se queda quieta escuchando', 'Sonrie', 'Se mueve automaticamente', 'Se acerca a la fuente sonora', 'Cambia de actividad', 'Se tapa los oidos'], wide: true },
            { type: 'text', name: 'first_response_music_other', label: 'Otra respuesta inicial' },
            { type: 'radio', name: 'attentive_listening', label: 'Parece escuchar con atencion cuando algo le interesa sonoramente?', options: ['Si', 'No', 'A veces'] },
            { type: 'text', name: 'attentive_listening_examples', label: 'Ejemplos de atencion auditiva' },
            { type: 'radio', name: 'recognizes_songs', label: 'Reconoce canciones aunque no las este mirando?', options: ['Si', 'No', 'No estoy seguro/a'] }
        ]
    },
    {
        title: '3. Preferencias y aversiones musicales',
        fields: [
            { type: 'checkbox-group', name: 'liked_music_types', label: 'Musica que le gusta', options: ['Infantil o canciones simples', 'Musica ritmica', 'Melodias suaves', 'Musica rapida', 'Musica lenta', 'Voces femeninas', 'Voces masculinas', 'Instrumental'], wide: true },
            { type: 'text', name: 'liked_music_other', label: 'Otra preferencia musical' },
            { type: 'textarea', name: 'favorite_songs', label: 'Canciones, artistas o estilos favoritos', wide: true },
            { type: 'textarea', name: 'disliked_music_types', label: 'Tipos de musica que rechaza o le generan molestia', wide: true },
            { type: 'checkbox-group', name: 'rejection_expression', label: 'Como expresa el rechazo?', options: ['Se tapa los oidos', 'Se aleja', 'Se irrita', 'Cambia de actividad', 'Llora'], wide: true },
            { type: 'text', name: 'rejection_expression_other', label: 'Otra forma de rechazo' }
        ]
    },
    {
        title: '4. Perfil sensorial auditivo',
        fields: [
            { type: 'scale', name: 'sens_loud_sounds', label: 'Sensibilidad a sonidos fuertes (1-5)', scale: BNPM_SCALE_15 },
            { type: 'scale', name: 'sens_soft_sounds', label: 'Sensibilidad a sonidos suaves (1-5)', scale: BNPM_SCALE_15 },
            { type: 'scale', name: 'sens_loud_voices', label: 'Sensibilidad a voces fuertes (1-5)', scale: BNPM_SCALE_15 },
            { type: 'scale', name: 'sens_instruments', label: 'Sensibilidad a instrumentos musicales (1-5)', scale: BNPM_SCALE_15 },
            { type: 'checkbox-group', name: 'preferred_timbres', label: 'Que timbres prefiere?', options: ['Percusion suave', 'Percusion fuerte', 'Piano', 'Cuerdas', 'Sonidos metalicos', 'Campanas', 'Voz humana', 'Vibracion'], wide: true },
            { type: 'text', name: 'preferred_timbres_other', label: 'Otros timbres preferidos' },
            { type: 'textarea', name: 'avoided_timbres', label: 'Timbres que evita', wide: true }
        ]
    },
    {
        title: '5. Movimiento y ritmo',
        fields: [
            { type: 'radio', name: 'moves_with_music', label: 'Se mueve cuando escucha musica?', options: BNPM_FREQUENCY_OPTIONS },
            { type: 'checkbox-group', name: 'movement_behaviors', label: 'Comportamientos observados', options: ['Balanceo', 'Aplausos', 'Saltos', 'Movimientos de cabeza', 'Movimientos repetitivos'], wide: true },
            { type: 'text', name: 'movement_behaviors_other', label: 'Otro comportamiento motor' },
            { type: 'scale', name: 'rhythm_pulse_stable', label: 'Mantiene un pulso estable (1-5)', scale: BNPM_SCALE_15 },
            { type: 'scale', name: 'rhythm_sync_steps', label: 'Sincroniza palmas o pasos (1-5)', scale: BNPM_SCALE_15 },
            { type: 'scale', name: 'rhythm_reproduce_patterns', label: 'Reproduce ritmos simples (1-5)', scale: BNPM_SCALE_15 }
        ]
    },
    {
        title: '6. Tacto, vibracion y propiocepcion',
        fields: [
            { type: 'radio', name: 'hits_instruments_hard', label: 'Golpea muy fuerte los instrumentos?', options: ['Si', 'No', 'A veces'] },
            { type: 'radio', name: 'seeks_vibrations', label: 'Busca vibraciones?', options: ['Si', 'No'] },
            { type: 'text', name: 'seeks_vibrations_details', label: 'Si busca vibraciones, cuales?' },
            { type: 'radio', name: 'avoids_textures', label: 'Evita tocar ciertas texturas de instrumentos?', options: ['Si', 'No'] },
            { type: 'text', name: 'avoids_textures_details', label: 'Materiales evitados' },
            { type: 'radio', name: 'seeks_material_temperature', label: 'Busca tocar temperatura o metal de instrumentos?', options: ['Si', 'No'] },
            { type: 'text', name: 'seeks_material_temperature_details', label: 'Materiales o superficies buscadas' }
        ]
    },
    {
        title: '7. Regulacion emocional con musica y con silencio',
        fields: [
            { type: 'textarea', name: 'calming_music', label: 'Musica que calma', wide: true },
            { type: 'textarea', name: 'activating_music', label: 'Musica que activa', wide: true },
            { type: 'textarea', name: 'rejecting_sounds', label: 'Sonidos que generan rechazo', wide: true },
            { type: 'checkbox-group', name: 'emotional_reactions', label: 'Reacciones emocionales observadas', options: ['Sonrie', 'Se relaja', 'Se activa mucho', 'Se angustia', 'Se tapa los oidos', 'Busca contencion'], wide: true },
            { type: 'text', name: 'emotional_reactions_other', label: 'Otra reaccion emocional' }
        ]
    },
    {
        title: '8. Comunicacion y musica',
        fields: [
            { type: 'radio', name: 'vocalizes_with_music', label: 'Vocaliza cuando escucha musica?', options: ['Si', 'No', 'A veces'] },
            { type: 'radio', name: 'vocalizes_more_in_silence', label: 'Vocaliza mas en silencio?', options: ['Si', 'No', 'No lo tengo claro'] },
            { type: 'radio', name: 'imitates_melodies', label: 'Imita melodias o sonidos?', options: ['Si', 'No', 'Intentos parciales'] },
            { type: 'radio', name: 'uses_music_to_communicate', label: 'Usa la musica para pedir, anticipar o regularse?', options: ['Si', 'No', 'No lo se'] },
            { type: 'text', name: 'uses_music_to_communicate_examples', label: 'Ejemplos' }
        ]
    },
    {
        title: '9. Observaciones adicionales de la familia',
        fields: [
            { type: 'textarea', name: 'family_additional_notes', label: 'Observaciones abiertas', wide: true }
        ]
    }
];

const BNPM_MODULE_A_DOMAINS = [
    {
        key: 'regulacion',
        label: 'Regulacion sensorial y tonica',
        items: [
            'Reacciona negativamente ante sonidos intensos',
            'Se tapa los oidos frente a ciertos sonidos',
            'Busca generar sonidos cuando hay silencio',
            'Parece necesitar ruido o musica para regularse',
            'Se sobreexcita con estimulos sonoros',
            'Evita ambientes sonoros',
            'Busca vibraciones o graves'
        ]
    },
    {
        key: 'temporal',
        label: 'Procesamiento temporal',
        items: [
            'Se mueve espontaneamente siguiendo musica',
            'Mantiene un ritmo estable',
            'Se desorganiza cuando cambia el tempo',
            'Anticipa pausas o finales musicales',
            'Repite patrones ritmicos simples',
            'Muestra dificultad para sincronizarse'
        ]
    },
    {
        key: 'audio_motor',
        label: 'Integracion audio-motora',
        items: [
            'Coordina movimiento con sonido',
            'Ajusta su movimiento al ritmo',
            'Puede iniciar movimiento a partir de estimulos sonoros',
            'Presenta movimientos repetitivos no ajustados al entorno',
            'Tiene dificultad para coordinar acciones con musica'
        ]
    },
    {
        key: 'comunicacion',
        label: 'Comunicacion y sincronia',
        items: [
            'Vocaliza en interaccion con musica',
            'Imita sonidos o melodias',
            'Responde a estimulos musicales del otro',
            'Participa en juegos de turno',
            'Usa sonidos o musica para comunicarse',
            'Presenta dificultad para sostener intercambios'
        ]
    },
    {
        key: 'ejecutivas',
        label: 'Funciones ejecutivas en contexto musical',
        items: [
            'Mantiene la atencion en actividades musicales',
            'Puede esperar pausas musicales',
            'Cambia su conducta ante cambios en la musica',
            'Se frustra ante cambios o demandas',
            'Persevera en patrones repetitivos',
            'Puede seguir consignas musicales simples'
        ]
    }
];

const BNPM_MODULE_B = {
    domains: [
        {
            key: 'sensorial',
            label: 'Dominio 1 - Regulacion sensorial',
            tasks: [
                { key: 'intensidad_sonora', title: 'Tarea 1: Intensidad sonora', observables: ['Sobresalto', 'Evitacion', 'Busqueda de sonido', 'Indiferencia', 'Regulacion adecuada'] },
                { key: 'silencio', title: 'Tarea 2: Silencio', observables: ['Genera sonidos', 'Inquietud motora', 'Se autorregula', 'Evita el silencio', 'Contacto visual', 'Desconexion'], numeric: [{ name: 'latencia_ruptura_silencio', label: 'Latencia a ruptura del silencio (segundos)' }], subscales: ['Regulacion', 'Busqueda', 'Atencion', 'Tolerancia temporal', 'Social'] }
            ]
        },
        {
            key: 'temporal',
            label: 'Dominio 2 - Procesamiento temporal',
            tasks: [
                { key: 'sincronizacion', title: 'Tarea 1: Sincronizacion', observables: ['Sincronizado', 'Variable', 'Muy inestable', 'No logra'], extrasChoice: { name: 'sincronizacion_tipo_error', label: 'Tipo de error', options: ['Adelantado', 'Atrasado', 'Mixto'] }, numeric: [{ name: 'sincronizacion_error_medio', label: 'Error medio (ms)' }, { name: 'sincronizacion_jitter', label: 'Jitter (ms)' }] },
                { key: 'continuacion', title: 'Tarea 2: Continuacion', observables: ['Mantiene tempo', 'Deriva progresiva', 'Pierde ritmo'] },
                { key: 'cambio_tempo', title: 'Tarea 3: Cambio de tempo', observables: ['Se adapta rapido', 'Adaptacion lenta', 'No se adapta'], numeric: [{ name: 'cambio_tempo_latencia', label: 'Latencia de ajuste' }] }
            ]
        },
        {
            key: 'audio_motor',
            label: 'Dominio 3 - Integracion audio-motora',
            tasks: [
                { key: 'movimiento_libre', title: 'Movimiento libre', observables: ['Coordinado', 'Parcial', 'Desorganizado', 'Estereotipado'] },
                { key: 'imitacion_motora', title: 'Imitacion motora', observables: ['Precisa', 'Aproximada', 'Fallida'], numeric: [{ name: 'imitacion_motora_latencia', label: 'Latencia' }] },
                { key: 'acoplamiento', title: 'Acoplamiento', observables: ['Sincronia', 'Intermitente', 'No acopla'] }
            ]
        },
        {
            key: 'comunicacion',
            label: 'Dominio 4 - Comunicacion musical',
            tasks: [
                { key: 'turn_taking', title: 'Turn-taking', observables: ['Espera turno', 'Se adelanta', 'No responde'] },
                { key: 'imitacion_vocal', title: 'Imitacion vocal', observables: ['Reproduce', 'Aproxima', 'No imita'] },
                { key: 'interaccion_libre', title: 'Interaccion libre', observables: ['Inicia', 'Responde', 'Pasivo'], extrasChoice: { name: 'interaccion_libre_reciprocidad', label: 'Reciprocidad', options: ['Alta', 'Media', 'Baja'] } }
            ]
        },
        {
            key: 'ejecutivo',
            label: 'Dominio 5 - Funciones ejecutivas',
            tasks: [
                { key: 'stop_musical', title: 'Stop musical', observables: ['Se detiene', 'Parcial', 'No inhibe'] },
                { key: 'cambio_regla', title: 'Cambio de regla', observables: ['Flexible', 'Persevera', 'Confusion'] },
                { key: 'secuencia', title: 'Secuencia', observables: ['Correcta', 'Parcial', 'Fallida'] }
            ]
        }
    ],
    markers: ['Hipersensibilidad', 'Busqueda sensorial', 'Bajo registro', 'Asincronia temporal', 'Impulsividad', 'Rigidez', 'Baja reciprocidad', 'Desorganizacion motora']
};

app.escapeHtml = function (value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

app.formatearBnpmTexto = function (value) {
    return String(value ?? '')
        .replace(/Modulo/g, 'Módulo')
        .replace(/modulo/g, 'módulo')
        .replace(/Nino/g, 'Niño')
        .replace(/nino/g, 'niño')
        .replace(/nina/g, 'niña')
        .replace(/basicos/g, 'básicos')
        .replace(/Basicos/g, 'Básicos')
        .replace(/evaluacion/g, 'evaluación')
        .replace(/Evaluacion/g, 'Evaluación')
        .replace(/clinico/g, 'clínico')
        .replace(/clinica/g, 'clínica')
        .replace(/clinicas/g, 'clínicas')
        .replace(/clinicos/g, 'clínicos')
        .replace(/musica/g, 'música')
        .replace(/Musica/g, 'Música')
        .replace(/diagnostico/g, 'diagnóstico')
        .replace(/Diagnostico/g, 'Diagnóstico')
        .replace(/comunicacion/g, 'comunicación')
        .replace(/Comunicacion/g, 'Comunicación')
        .replace(/regulacion/g, 'regulación')
        .replace(/Regulacion/g, 'Regulación')
        .replace(/integracion/g, 'integración')
        .replace(/Integracion/g, 'Integración')
        .replace(/orientacion/g, 'orientación')
        .replace(/Orientacion/g, 'Orientación')
        .replace(/terapeutica/g, 'terapéutica')
        .replace(/Terapeutica/g, 'Terapéutica')
        .replace(/observacion/g, 'observación')
        .replace(/Observacion/g, 'Observación')
        .replace(/observaciones iniciales/g, 'observaciones iniciales')
        .replace(/opcion/g, 'opción')
        .replace(/Opcion/g, 'Opción')
        .replace(/publica/g, 'pública')
        .replace(/Publica/g, 'Pública')
        .replace(/version/g, 'versión')
        .replace(/Version/g, 'Versión')
        .replace(/seccion/g, 'sección')
        .replace(/Seccion/g, 'Sección')
        .replace(/todavia/g, 'todavía')
        .replace(/Aun/g, 'Aún')
        .replace(/aun/g, 'aún')
        .replace(/ultimo/g, 'último')
        .replace(/Ultimo/g, 'Último')
        .replace(/diagnostico/g, 'diagnóstico');
};

app.leerBnpmStorage = function () {
    try {
        return JSON.parse(localStorage.getItem(BNPM_STORAGE_KEY) || '{}');
    } catch (error) {
        return {};
    }
};

app.guardarBnpmStorage = function (data) {
    localStorage.setItem(BNPM_STORAGE_KEY, JSON.stringify(data));
};

app.esPacienteNino = function (paciente) {
    return !!paciente && (
        paciente.tipo_registro === 'nino' ||
        paciente.tipo_registro === 'niño' ||
        paciente.tipo_evaluacion === 'bnpm_nino' ||
        paciente.tipo_evaluacion === 'bnpm-niño' ||
        paciente.bnpm
    );
};

app.obtenerPacientesNino = function () {
    return this.pacientes
        .map((paciente, index) => ({ paciente, index }))
        .filter(item => this.esPacienteNino(item.paciente));
};

app.obtenerBnpmPacienteDefault = function () {
    if (this.pacienteActual && this.pacienteActual.index != null && this.esPacienteNino(this.pacientes[this.pacienteActual.index])) {
        return String(this.pacienteActual.index);
    }
    const primerNino = this.obtenerPacientesNino()[0];
    return primerNino ? String(primerNino.index) : '';
};

app.obtenerBnpmPacienteRecord = function (patientIndex) {
    const paciente = this.pacientes[Number(patientIndex)];
    if (paciente && paciente.bnpm) {
        return paciente.bnpm;
    }
    const storage = this.leerBnpmStorage();
    return storage[String(patientIndex)] || null;
};

app.guardarBnpmModulo = function (moduleKey, patientIndex, payload) {
    const storage = this.leerBnpmStorage();
    const paciente = this.pacientes[Number(patientIndex)] || {};
    const key = String(patientIndex);
    storage[key] = storage[key] || {};
    storage[key].patientIndex = Number(patientIndex);
    storage[key].patientName = paciente.nombre || 'Paciente';
    storage[key][moduleKey === 'a' ? 'moduloA' : 'moduloB'] = {
        savedAt: new Date().toISOString(),
        values: payload
    };
    this.guardarBnpmStorage(storage);
};

app.obtenerBnpmValores = function (moduleKey, patientIndex) {
    const record = this.obtenerBnpmPacienteRecord(patientIndex);
    if (!record) return {};
    const modulo = moduleKey === 'a' ? record.moduloA : record.moduloB;
    return (modulo && modulo.values) || {};
};

app.obtenerBnpmFechaGuardado = function (moduleKey, patientIndex) {
    const record = this.obtenerBnpmPacienteRecord(patientIndex);
    if (!record) return '';
    const modulo = moduleKey === 'a' ? record.moduloA : record.moduloB;
    return modulo && modulo.savedAt ? new Date(modulo.savedAt).toLocaleString('es-AR') : '';
};

app.obtenerOpcionesPacientesBnpm = function (selectedIndex) {
    return this.obtenerPacientesNino().map(({ paciente, index }) => `
        <option value="${index}" ${String(selectedIndex) === String(index) ? 'selected' : ''}>${this.escapeHtml(paciente.nombre || `Paciente ${index + 1}`)}</option>
    `).join('');
};

app.obtenerValorBnpm = function (values, name) {
    return values && Object.prototype.hasOwnProperty.call(values, name) ? values[name] : '';
};

app.obtenerArrayBnpm = function (values, name) {
    const value = this.obtenerValorBnpm(values, name);
    if (Array.isArray(value)) return value;
    if (value === '' || value == null) return [];
    return [value];
};

app.renderBnpmField = function (field, values) {
    const fieldClass = `bnpm-field${field.wide ? ' bnpm-field-wide' : ''}`;
    const currentValue = this.obtenerValorBnpm(values, field.name);
    const currentArray = this.obtenerArrayBnpm(values, field.name);

    if (field.type === 'textarea') {
        return `
            <label class="${fieldClass}">
                <span class="bnpm-label">${this.formatearBnpmTexto(field.label)}</span>
                <textarea name="${field.name}" class="bnpm-textarea">${this.escapeHtml(currentValue)}</textarea>
            </label>
        `;
    }

    if (field.type === 'text' || field.type === 'number' || field.type === 'date') {
        return `
            <label class="${fieldClass}">
                <span class="bnpm-label">${this.formatearBnpmTexto(field.label)}</span>
                <input type="${field.type}" name="${field.name}" value="${this.escapeHtml(currentValue)}" class="bnpm-input">
            </label>
        `;
    }

    if (field.type === 'radio') {
        return `
            <div class="${fieldClass}">
                <span class="bnpm-label">${this.formatearBnpmTexto(field.label)}</span>
                <div class="bnpm-choice-group">
                    ${field.options.map(option => `
                        <label class="bnpm-choice-chip">
                            <input type="radio" name="${field.name}" value="${this.escapeHtml(option)}" ${currentValue === option ? 'checked' : ''}>
                            <span>${this.escapeHtml(this.formatearBnpmTexto(option))}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if (field.type === 'checkbox-group') {
        return `
            <div class="${fieldClass}">
                <span class="bnpm-label">${this.formatearBnpmTexto(field.label)}</span>
                <div class="bnpm-choice-group">
                    ${field.options.map(option => `
                        <label class="bnpm-choice-chip">
                            <input type="checkbox" name="${field.name}" value="${this.escapeHtml(option)}" ${currentArray.includes(option) ? 'checked' : ''}>
                            <span>${this.escapeHtml(this.formatearBnpmTexto(option))}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if (field.type === 'scale') {
        return `
            <div class="${fieldClass}">
                <span class="bnpm-label">${this.formatearBnpmTexto(field.label)}</span>
                <div class="bnpm-scale-group">
                    ${field.scale.map(option => `
                        <label class="bnpm-scale-option">
                            <input type="radio" name="${field.name}" value="${option}" ${String(currentValue) === String(option) ? 'checked' : ''}>
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    return '';
};

app.serializarFormularioBnpm = function (form) {
    const data = {};
    Array.from(form.elements).forEach(element => {
        if (!element.name || element.disabled) return;

        if (element.type === 'checkbox') {
            if (!Array.isArray(data[element.name])) {
                data[element.name] = [];
            }
            if (element.checked) {
                data[element.name].push(element.value);
            }
            return;
        }

        if (element.type === 'radio') {
            if (element.checked) {
                data[element.name] = element.value;
            } else if (!Object.prototype.hasOwnProperty.call(data, element.name)) {
                data[element.name] = '';
            }
            return;
        }

        data[element.name] = element.value;
    });
    return data;
};

app.obtenerDatosPacienteNinoDesdeFormulario = function (moduleKey) {
    const prefix = `bnpm-${moduleKey}-new-`;
    return {
        nombre: document.getElementById(`${prefix}name`)?.value?.trim() || '',
        fecha_nacimiento: document.getElementById(`${prefix}birth-date`)?.value || '',
        edad: document.getElementById(`${prefix}age`)?.value || '',
        fecha: document.getElementById(`${prefix}evaluation-date`)?.value || new Date().toISOString().slice(0, 10),
        diagnostico: document.getElementById(`${prefix}diagnosis`)?.value?.trim() || '',
        derivacion: document.getElementById(`${prefix}referral`)?.value?.trim() || '',
        observaciones_iniciales: document.getElementById(`${prefix}notes`)?.value?.trim() || ''
    };
};

app.crearPacienteNinoBnpm = async function (moduleKey) {
    const datos = this.obtenerDatosPacienteNinoDesdeFormulario(moduleKey);
    if (!datos.nombre) {
        alert('Completa al menos el nombre del paciente niño para crearlo.');
        return;
    }

    const payload = {
        fecha: datos.fecha,
        nombre: datos.nombre,
        email: '',
        investigador: '',
        medicacion: '',
        psicopatologia: '',
        diagnostico: datos.diagnostico,
        dominancia: '',
        manoInicio: '',
        medidasManos: {},
        evaluaciones_detalladas: [],
        tipo_registro: 'nino',
        tipo_evaluacion: 'bnpm_nino',
        fecha_nacimiento: datos.fecha_nacimiento,
        edad: datos.edad,
        derivacion: datos.derivacion,
        observaciones_iniciales: datos.observaciones_iniciales,
        bnpm: {
            moduloA: null,
            moduloB: null,
            compartir_familia: {
                estado: 'placeholder'
            }
        }
    };

    const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(() => null);

    if (!response || !response.ok) {
        alert('No se pudo crear el paciente niño en el registro.');
        return;
    }

    await this.verificarConexion();
    const match = [...this.pacientes]
        .map((paciente, index) => ({ paciente, index }))
        .reverse()
        .find(({ paciente }) => this.esPacienteNino(paciente) && paciente.nombre === datos.nombre && String(paciente.fecha || '') === String(datos.fecha || ''));

    const newIndex = match ? match.index : this.obtenerBnpmPacienteDefault();
    this[`bnpmPacienteSeleccionado${moduleKey.toUpperCase()}`] = String(newIndex);
    this.renderizarModuloNino(moduleKey);
    alert(`Paciente niño creado: ${datos.nombre}.`);
};

app.actualizarPacienteBnpm = async function (patientIndex, payload) {
    const response = await fetch(`${CONFIG.API_URL}/${patientIndex}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(() => null);

    if (!response || !response.ok) {
        return false;
    }

    await this.verificarConexion();
    return true;
};

app.abrirEvaluacionNino = function () {
    this.cambiarVista('evaluacion-nino');
};

app.abrirModuloNino = function (moduleKey) {
    this.cambiarVista(`bnpm-modulo-${moduleKey}`);
    this.renderizarModuloNino(moduleKey);
};

app.renderizarModuloNino = function (moduleKey) {
    const root = document.getElementById(`bnpm-modulo-${moduleKey}-root`);
    if (!root) return;

    const selectedIndex = this[`bnpmPacienteSeleccionado${moduleKey.toUpperCase()}`] ?? this.obtenerBnpmPacienteDefault();
    this[`bnpmPacienteSeleccionado${moduleKey.toUpperCase()}`] = selectedIndex;
    const patient = selectedIndex !== '' ? (this.pacientes[Number(selectedIndex)] || {}) : {};
    const hasChildPatients = this.obtenerPacientesNino().length > 0;
    const savedAt = selectedIndex !== '' ? this.obtenerBnpmFechaGuardado(moduleKey, selectedIndex) : '';
    const toolbarNote = moduleKey === 'b'
        ? 'Módulo B guarda y actualiza el registro del paciente niño dentro de la plataforma. Módulo A y B comparten el mismo paciente.'
        : 'La opción para compartir con familia queda preparada visualmente, pero sin enlace funcional hasta contar con una ruta pública o soporte específico.';

    root.innerHTML = `
        <div class="bnpm-shell">
            <div class="bnpm-header">
                <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Evaluación Niño</p>
                        <h2 class="text-3xl font-serif font-bold mt-2">${moduleKey === 'a' ? 'Módulo A - Familia' : 'Módulo B - Registro clínico'}</h2>
                        <p class="text-white/80 mt-2">${moduleKey === 'a' ? 'Base digital para observaciones familiares y escalas de perfil musical.' : 'Registro profesional con dominios, tareas, puntajes, observables y orientación inicial.'}</p>
                    </div>
                    <button type="button" onclick="app.cambiarVista('evaluacion-nino')" class="bg-white/15 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold text-sm transition inline-flex items-center gap-2">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i> Volver a Módulos
                    </button>
                </div>
            </div>
            <div class="bnpm-toolbar">
                <div>
                    <label class="bnpm-label">Paciente niño</label>
                    <select id="bnpm-${moduleKey}-patient" class="bnpm-toolbar-select" onchange="app.cambiarPacienteBnpm('${moduleKey}', this.value)">
                        <option value="" ${selectedIndex === '' ? 'selected' : ''}>${hasChildPatients ? 'Seleccionar paciente niño...' : 'Primero crea un paciente niño'}</option>
                        ${this.obtenerOpcionesPacientesBnpm(selectedIndex)}
                    </select>
                    <p class="text-xs text-slate-500 mt-2">${savedAt ? `Último guardado: ${this.escapeHtml(savedAt)}` : 'Aún no hay una versión guardada para este paciente.'}</p>
                </div>
                <div class="bnpm-toolbar-actions">
                    <button type="button" onclick="app.crearPacienteNinoBnpm('${moduleKey}')" class="track-action-secondary">Nuevo paciente niño</button>
                    ${moduleKey === 'a'
                        ? `
                            <button type="button" onclick="app.guardarFormularioBnpm('a')" class="track-action-primary">Guardar borrador</button>
                            <button type="button" onclick="app.compartirModuloAFamilia()" class="track-action-secondary">Generar enlace</button>
                        `
                        : `
                            <button type="button" onclick="app.guardarFormularioBnpm('b')" class="track-action-primary">Guardar módulo</button>
                            <button type="button" onclick="app.descargarPdfModuloB()" class="track-action-secondary">Descargar PDF</button>
                        `}
                </div>
            </div>
            <div class="bnpm-form">
                <div class="bnpm-note">${toolbarNote}</div>
                ${this.renderizarCreadorPacienteNino(moduleKey)}
                ${selectedIndex === ''
                    ? `
                        <div class="bnpm-empty mt-4">
                            ${hasChildPatients ? 'Selecciona un paciente niño existente o crea uno nuevo para empezar.' : 'Todavía no hay pacientes niño registrados. Completa el bloque superior para crear el primero.'}
                        </div>
                    `
                    : (moduleKey === 'a' ? this.renderizarModuloAFormulario(selectedIndex, patient) : this.renderizarModuloBFormulario(selectedIndex, patient))}
            </div>
        </div>
    `;

    if (moduleKey === 'b') {
        document.getElementById('bnpm-form-b')?.addEventListener('input', () => this.actualizarResumenModuloB());
        this.actualizarResumenModuloB();
    }

    lucide.createIcons();
};

app.cambiarPacienteBnpm = function (moduleKey, patientIndex) {
    this[`bnpmPacienteSeleccionado${moduleKey.toUpperCase()}`] = String(patientIndex);
    this.renderizarModuloNino(moduleKey);
};

app.renderizarCreadorPacienteNino = function (moduleKey) {
    const prefix = `bnpm-${moduleKey}-new`;
    return `
        <section class="bnpm-section bnpm-section-soft">
            <div class="bnpm-section-title">Crear paciente niño</div>
            <p class="bnpm-section-copy">Este registro es independiente de Evaluación Adulto y servirá como base compartida entre Módulo A y Módulo B.</p>
            <div class="bnpm-grid">
                <label class="bnpm-field">
                    <span class="bnpm-label">Nombre y apellido</span>
                    <input id="${prefix}-name" type="text" class="bnpm-input">
                </label>
                <label class="bnpm-field">
                    <span class="bnpm-label">Fecha de nacimiento</span>
                    <input id="${prefix}-birth-date" type="date" class="bnpm-input">
                </label>
                <label class="bnpm-field">
                    <span class="bnpm-label">Edad</span>
                    <input id="${prefix}-age" type="number" class="bnpm-input">
                </label>
                <label class="bnpm-field">
                    <span class="bnpm-label">Fecha de evaluación</span>
                    <input id="${prefix}-evaluation-date" type="date" class="bnpm-input" value="${new Date().toISOString().slice(0, 10)}">
                </label>
                <label class="bnpm-field">
                    <span class="bnpm-label">Diagnóstico</span>
                    <input id="${prefix}-diagnosis" type="text" class="bnpm-input">
                </label>
                <label class="bnpm-field">
                    <span class="bnpm-label">Derivación</span>
                    <input id="${prefix}-referral" type="text" class="bnpm-input">
                </label>
                <label class="bnpm-field bnpm-field-wide">
                    <span class="bnpm-label">Observaciones iniciales</span>
                    <textarea id="${prefix}-notes" class="bnpm-textarea"></textarea>
                </label>
            </div>
        </section>
    `;
};

app.renderizarModuloAFormulario = function (patientIndex, patient) {
    const values = this.obtenerBnpmValores('a', patientIndex);
    const resumen = this.calcularResumenModuloA(values);
    return `
        <form id="bnpm-form-a" onsubmit="app.handleSubmitBnpm(event, 'a')">
            <div class="bnpm-section bnpm-section-soft">
                <div class="bnpm-section-title">Paciente seleccionado</div>
                <div class="bnpm-section-copy mt-1">${this.escapeHtml(patient.nombre || 'Paciente')} ${patient.diagnostico ? `· ${this.escapeHtml(patient.diagnostico)}` : ''}</div>
            </div>
            ${BNPM_MODULE_A_SECTIONS.map(section => `
                <section class="bnpm-section">
                    <div class="bnpm-section-title">${this.formatearBnpmTexto(section.title)}</div>
                    ${section.copy ? `<p class="bnpm-section-copy">${this.formatearBnpmTexto(section.copy)}</p>` : ''}
                    <div class="bnpm-grid">
                        ${section.fields.map(field => this.renderBnpmField(field, values)).join('')}
                    </div>
                </section>
            `).join('')}
            <section class="bnpm-section">
                <div class="bnpm-section-title">Bloque de puntajes por dominio</div>
                <p class="bnpm-section-copy">Escala sugerida: 0 = Nunca, 1 = Raramente, 2 = A veces, 3 = Frecuentemente, 4 = Siempre.</p>
                ${BNPM_MODULE_A_DOMAINS.map(domain => `
                    <div class="bnpm-domain-block mt-4">
                        <div class="bnpm-domain-head">
                            <h4>${this.formatearBnpmTexto(domain.label)}</h4>
                        </div>
                        ${domain.items.map((item, index) => `
                            <div class="bnpm-task">
                                <div class="bnpm-task-title">${this.formatearBnpmTexto(item)}</div>
                                <div class="bnpm-scale-group mt-3">
                                    ${BNPM_SCALE_04.map(option => `
                                        <label class="bnpm-scale-option">
                                            <input type="radio" name="module_a_${domain.key}_${index}" value="${option}" ${String(this.obtenerValorBnpm(values, `module_a_${domain.key}_${index}`)) === option ? 'checked' : ''}>
                                            <span>${option}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
                <div class="bnpm-summary-grid">
                    ${resumen.map(item => `
                            <div class="bnpm-summary-card">
                            <div class="bnpm-summary-card-label">${this.formatearBnpmTexto(item.label)}</div>
                            <div class="bnpm-summary-card-value">${item.value}</div>
                        </div>
                    `).join('')}
                </div>
            </section>
        </form>
    `;
};

app.renderizarModuloBFormulario = function (patientIndex, patient) {
    const values = this.obtenerBnpmValores('b', patientIndex);
    const summary = this.calcularResumenModuloB(values);
    return `
        <form id="bnpm-form-b" onsubmit="app.handleSubmitBnpm(event, 'b')">
            <section class="bnpm-section">
                <div class="bnpm-section-title">1. Datos generales</div>
                <div class="bnpm-grid">
                    ${this.renderBnpmField({ type: 'text', name: 'patient_name', label: 'Nombre del paciente' }, { ...values, patient_name: this.obtenerValorBnpm(values, 'patient_name') || patient.nombre || '' })}
                    ${this.renderBnpmField({ type: 'number', name: 'patient_age', label: 'Edad' }, values)}
                    ${this.renderBnpmField({ type: 'date', name: 'clinical_date', label: 'Fecha' }, values)}
                    ${this.renderBnpmField({ type: 'text', name: 'evaluator_name', label: 'Evaluador' }, values)}
                    ${this.renderBnpmField({ type: 'radio', name: 'clinical_context', label: 'Contexto', options: ['Consultorio', 'Escuela', 'Otro'] }, values)}
                    ${this.renderBnpmField({ type: 'text', name: 'clinical_context_other', label: 'Si es otro, detallar' }, values)}
                </div>
            </section>
            ${BNPM_MODULE_B.domains.map(domain => `
                <section class="bnpm-domain-block">
                    <div class="bnpm-domain-head">
                        <h4>${this.formatearBnpmTexto(domain.label)}</h4>
                    </div>
                    ${domain.tasks.map(task => `
                        <div class="bnpm-task">
                            <div class="bnpm-task-title">${this.formatearBnpmTexto(task.title)}</div>
                            <div class="bnpm-grid mt-4">
                                ${this.renderBnpmField({ type: 'scale', name: `${task.key}_score`, label: 'Puntaje global (0-4)', scale: BNPM_SCALE_04 }, values)}
                                ${task.numeric ? task.numeric.map(item => this.renderBnpmField({ type: 'number', name: item.name, label: item.label }, values)).join('') : ''}
                                ${task.extrasChoice ? this.renderBnpmField({ type: 'radio', name: task.extrasChoice.name, label: task.extrasChoice.label, options: task.extrasChoice.options, wide: true }, values) : ''}
                                ${task.subscales ? `
                                    <div class="bnpm-field bnpm-field-wide">
                                        <span class="bnpm-label">Subdimensiones opcionales</span>
                                        <div class="bnpm-grid">
                                            ${task.subscales.map(subscale => this.renderBnpmField({ type: 'scale', name: `${task.key}_sub_${subscale.toLowerCase().replace(/\s+/g, '_')}`, label: subscale, scale: BNPM_SCALE_04 }, values)).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                ${this.renderBnpmField({ type: 'checkbox-group', name: `${task.key}_observables`, label: 'Observables', options: task.observables, wide: true }, values)}
                                ${this.renderBnpmField({ type: 'textarea', name: `${task.key}_notes`, label: 'Notas clinicas', wide: true }, values)}
                            </div>
                        </div>
                    `).join('')}
                </section>
            `).join('')}
            <section class="bnpm-section bnpm-section-soft">
                <div class="bnpm-section-title">4. Resumen por dominio</div>
                <div id="bnpm-modulo-b-summary" class="bnpm-summary-grid">
                    ${summary.map(item => `
                        <div class="bnpm-summary-card">
                            <div class="bnpm-summary-card-label">${this.formatearBnpmTexto(item.label)}</div>
                            <div class="bnpm-summary-card-value">${item.value}</div>
                        </div>
                    `).join('')}
                </div>
            </section>
            <section class="bnpm-section">
                <div class="bnpm-section-title">5. Marcadores clínicos globales</div>
                <div class="bnpm-grid">
                    ${this.renderBnpmField({ type: 'checkbox-group', name: 'global_markers', label: 'Marcar lo predominante', options: BNPM_MODULE_B.markers, wide: true }, values)}
                </div>
            </section>
            <section class="bnpm-section">
                <div class="bnpm-section-title">6. Observaciones clínicas integradas</div>
                <div class="bnpm-grid">
                    ${this.renderBnpmField({ type: 'textarea', name: 'integrated_observations', label: 'Observaciones clínicas integradas', wide: true }, values)}
                </div>
            </section>
            <section class="bnpm-section">
                <div class="bnpm-section-title">7. Orientación terapéutica inicial</div>
                <div class="bnpm-grid">
                    ${this.renderBnpmField({ type: 'textarea', name: 'initial_guidance', label: 'Orientación terapéutica inicial', wide: true }, values)}
                </div>
            </section>
        </form>
    `;
};

app.calcularResumenModuloA = function (values) {
    return BNPM_MODULE_A_DOMAINS.map(domain => {
        const scores = domain.items.map((_, index) => Number(this.obtenerValorBnpm(values, `module_a_${domain.key}_${index}`))).filter(Number.isFinite);
        const average = scores.length ? (scores.reduce((acc, value) => acc + value, 0) / scores.length).toFixed(1) : 'N/D';
        return { label: domain.label, value: average };
    });
};

app.calcularResumenModuloB = function (values) {
    return BNPM_MODULE_B.domains.map(domain => {
        const scores = domain.tasks
            .map(task => Number(this.obtenerValorBnpm(values, `${task.key}_score`)))
            .filter(Number.isFinite);
        const average = scores.length ? (scores.reduce((acc, value) => acc + value, 0) / scores.length).toFixed(1) : 'N/D';
        return { label: domain.label.replace('Dominio ', ''), value: average };
    });
};

app.actualizarResumenModuloB = function () {
    const form = document.getElementById('bnpm-form-b');
    const container = document.getElementById('bnpm-modulo-b-summary');
    if (!form || !container) return;
    const values = this.serializarFormularioBnpm(form);
    const summary = this.calcularResumenModuloB(values);
    container.innerHTML = summary.map(item => `
        <div class="bnpm-summary-card">
            <div class="bnpm-summary-card-label">${this.formatearBnpmTexto(item.label)}</div>
            <div class="bnpm-summary-card-value">${item.value}</div>
        </div>
    `).join('');
};

app.handleSubmitBnpm = function (event, moduleKey) {
    event.preventDefault();
    this.guardarFormularioBnpm(moduleKey);
};

app.guardarFormularioBnpm = async function (moduleKey) {
    const form = document.getElementById(`bnpm-form-${moduleKey}`);
    const patientIndex = this[`bnpmPacienteSeleccionado${moduleKey.toUpperCase()}`];
    if (!form || patientIndex === '') {
        alert('Selecciona o crea primero un paciente niño.');
        return;
    }

    const payload = this.serializarFormularioBnpm(form);
    const patient = this.pacientes[Number(patientIndex)] || {};
    const backendPayload = {
        nombre: payload.patient_name || patient.nombre || patient.nombre,
        edad: payload.patient_age || patient.edad || '',
        fecha: payload.clinical_date || patient.fecha || new Date().toISOString().slice(0, 10),
        tipo_registro: 'nino',
        tipo_evaluacion: 'bnpm_nino',
        bnpm: {
            ...(patient.bnpm || {}),
            [moduleKey === 'a' ? 'moduloA' : 'moduloB']: {
                savedAt: new Date().toISOString(),
                values: payload
            },
            compartir_familia: {
                estado: 'placeholder'
            }
        }
    };

    this.guardarBnpmModulo(moduleKey, patientIndex, payload);
    const ok = await this.actualizarPacienteBnpm(patientIndex, backendPayload);
    if (!ok) {
        alert('No se pudo guardar el módulo en el registro del paciente. Se conservó una copia local en este navegador.');
    }
    this.renderizarModuloNino(moduleKey);
    alert(`Módulo ${moduleKey.toUpperCase()} guardado para ${this.pacientes[Number(patientIndex)]?.nombre || 'el paciente seleccionado'}.`);
};

app.compartirModuloAFamilia = function () {
    alert('La opción para compartir con familia queda preparada como siguiente paso, pero hoy no existe una ruta pública ni soporte backend para generar un enlace funcional.');
};

app.descargarPdfModuloB = function () {
    const form = document.getElementById('bnpm-form-b');
    const patientIndex = this.bnpmPacienteSeleccionadoB;
    if (!form || patientIndex === '' || !window.jspdf) {
        alert('No fue posible preparar el PDF del Módulo B.');
        return;
    }

    const values = this.serializarFormularioBnpm(form);
    const summary = this.calcularResumenModuloB(values);
    const patient = this.pacientes[Number(patientIndex)] || {};
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 14;
    let y = 18;

    const ensureSpace = (extra = 20) => {
        if (y + extra > 285) {
            doc.addPage();
            y = 18;
        }
    };

    doc.setFillColor(74, 92, 146);
    doc.rect(0, 0, pageW, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('BNPM - Módulo B', margin, 14);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Planilla de registro clínico', margin, 20);

    y = 34;
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Datos generales', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    [
        ['Paciente', values.patient_name || patient.nombre || 'No indicado'],
        ['Edad', values.patient_age || 'No indicada'],
        ['Fecha', values.clinical_date || 'No indicada'],
        ['Evaluador', values.evaluator_name || 'No indicado'],
        ['Contexto', values.clinical_context === 'Otro' ? `${values.clinical_context || ''} ${values.clinical_context_other || ''}`.trim() : (values.clinical_context || 'No indicado')]
    ].forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value), margin + 28, y);
        y += 6;
    });

    BNPM_MODULE_B.domains.forEach(domain => {
        ensureSpace(28);
        y += 3;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(domain.label, margin, y);
        y += 4;

        const body = domain.tasks.map(task => [
            task.title,
            values[`${task.key}_score`] || 'N/D',
            this.obtenerArrayBnpm(values, `${task.key}_observables`).join(', ') || '-',
            values[`${task.key}_notes`] || '-'
        ]);

        doc.autoTable({
            startY: y + 2,
            head: [['Tarea', 'Puntaje', 'Observables', 'Notas']],
            body,
            margin: { left: margin, right: margin },
            styles: { fontSize: 8, cellPadding: 2.5, textColor: [51, 65, 85] },
            headStyles: { fillColor: [74, 92, 146], textColor: [255, 255, 255] },
            columnStyles: {
                0: { cellWidth: 42 },
                1: { cellWidth: 18 },
                2: { cellWidth: 55 },
                3: { cellWidth: 61 }
            }
        });
        y = doc.lastAutoTable.finalY + 6;
    });

    ensureSpace(32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Resumen por dominio', margin, y);
    y += 4;
    doc.autoTable({
        startY: y + 2,
        head: [['Dominio', 'Promedio']],
        body: summary.map(item => [item.label, item.value]),
        margin: { left: margin, right: margin },
        styles: { fontSize: 8.5, cellPadding: 2.5 },
        headStyles: { fillColor: [59, 141, 119], textColor: [255, 255, 255] }
    });
    y = doc.lastAutoTable.finalY + 8;

    const markers = this.obtenerArrayBnpm(values, 'global_markers').join(', ') || 'Sin marcadores seleccionados';
    ensureSpace(40);
    doc.setFont('helvetica', 'bold');
    doc.text('Marcadores clinicos globales', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const markersLines = doc.splitTextToSize(markers, pageW - margin * 2);
    doc.text(markersLines, margin, y);
    y += markersLines.length * 4 + 4;

    ['integrated_observations', 'initial_guidance'].forEach((field, index) => {
        ensureSpace(36);
        doc.setFont('helvetica', 'bold');
        doc.text(index === 0 ? 'Observaciones clínicas integradas' : 'Orientación terapéutica inicial', margin, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(values[field] || 'Sin contenido registrado.', pageW - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * 4 + 4;
    });

    const filenameBase = (values.patient_name || patient.nombre || 'Paciente').replace(/\s+/g, '_');
    doc.save(`BNPM_Módulo_B_${filenameBase}.pdf`);
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();

    document.getElementById('btn-generar-playlist')?.addEventListener('click', () => protocolo.generarPlaylistCompleta());
    document.getElementById('btn-siguiente-audio')?.addEventListener('click', () => protocolo.siguienteAudio());
    document.getElementById('evaluationFormMedicion')?.addEventListener('submit', (e) => protocolo.guardarEvaluacion(e));
});
