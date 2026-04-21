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
        "isocronos/metronomo_isócrono80bpm.wav",
        "isocronos/metronomo_isócrono108bpm.wav",
        "isocronos/metronomo_isócrono120bpm.wav",
        "isocronos/metronomo_isócrono132bpm.wav",
        "isocronos/metronomo_isócrono160bpm.wav"
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
        const btnActivo = document.getElementById(`nav-${vistaId}`);
        if (btnActivo) {
            btnActivo.classList.add('bg-white/20');
            btnActivo.classList.remove('hover:bg-white/10');
        }

        if (vistaId === 'pacientes') this.verificarConexion();
        if (vistaId === 'protocolo') protocolo.reiniciar();

        lucide.createIcons();
    },
    renderizarTablaPacientes: function (datos) {
        const tbody = document.getElementById('tabla-pacientes-body');
        const msjVacio = document.getElementById('msj-sin-pacientes');
        const tablaContainer = document.querySelector('.table-container table');

        tbody.innerHTML = '';

        if (!datos || datos.length === 0) {
            msjVacio.classList.remove('hidden');
            tablaContainer.classList.add('hidden');
            return;
        }

        msjVacio.classList.add('hidden');
        tablaContainer.classList.remove('hidden');

        // Crear una lista con su índice real en el array original
        const conIndice = datos.map(p => {
            const realIndex = this.pacientes.indexOf(p);
            return { p, realIndex };
        });

        [...conIndice].reverse().forEach(({ p, realIndex }) => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 transition-colors";
            tr.innerHTML = `
                <td class="font-medium text-gray-600">${p.fecha ? new Date(p.fecha).toLocaleDateString() : '-'}</td>
                <td class="font-bold text-gray-800">${p.nombre}</td>
                <td class="text-gray-600">${p.diagnostico || '-'}</td>
                <td class="text-gray-600">${p.dominancia || '-'}</td>
                <td class="text-center acciones-td flex items-center justify-center gap-1"></td>
            `;

            const accionesTd = tr.querySelector('.acciones-td');

            // Botón Ver Resultados / Videos
            const btnVer = document.createElement('button');
            btnVer.className = "text-primary hover:text-blue-800 p-2 bg-blue-50 rounded-lg tooltip";
            btnVer.title = "Ver Resultados y Videos";
            btnVer.innerHTML = '<i data-lucide="file-bar-chart-2" class="w-5 h-5"></i>';
            btnVer.onclick = () => this.verDetallePaciente(realIndex);
            accionesTd.appendChild(btnVer);

            // Botón Descargar PDF
            const btnPDF = document.createElement('button');
            btnPDF.className = "text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg tooltip";
            btnPDF.title = "Descargar PDF";
            btnPDF.innerHTML = '<i data-lucide="file-down" class="w-5 h-5"></i>';
            btnPDF.onclick = () => this.generarPDF(p);
            accionesTd.appendChild(btnPDF);

            tbody.appendChild(tr);
        });
        lucide.createIcons();
    },
    configurarBuscador: function () {
        document.getElementById('filtro-pacientes')?.addEventListener('input', (e) => {
            const txt = e.target.value.toLowerCase();
            this.renderizarTablaPacientes(this.pacientes.filter(p =>
                p.nombre.toLowerCase().includes(txt) ||
                (p.diagnostico && p.diagnostico.toLowerCase().includes(txt))
            ));
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
            ['Dominancia / Mano inicio', `${paciente.dominancia || 'N/A'}  ·  ${paciente.manoInicio || 'N/A'}`],
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
            <div class="bg-white px-3 py-2 rounded-lg border"><span class="text-gray-500 text-xs block">Dominancia</span><span class="font-semibold text-gray-800">${p.dominancia || 'N/A'}</span></div>
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

        if (autoplay) {
            reproductor.play().catch(e => console.log("El navegador requiere interacción previa.", e));
        }
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
        <div class="bg-white px-3 py-2 rounded-lg border"><span class="text-gray-500 text-xs block">Dominancia</span><span class="font-semibold text-gray-800">${p.dominancia || 'N/A'}</span></div>
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

document.addEventListener('DOMContentLoaded', () => {
    app.init();

    document.getElementById('btn-generar-playlist')?.addEventListener('click', () => protocolo.generarPlaylistCompleta());
    document.getElementById('btn-siguiente-audio')?.addEventListener('click', () => protocolo.siguienteAudio());
    document.getElementById('evaluationFormMedicion')?.addEventListener('submit', (e) => protocolo.guardarEvaluacion(e));
});

