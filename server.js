const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
// 👇 ESTO ES LO IMPORTANTE
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;
const archivoDatos = path.join(__dirname, 'pacientes.json');
const videosDir = path.join(__dirname, 'videos');
const analysisOutputsDir = path.join(__dirname, 'analysis_outputs');

if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
}
if (!fs.existsSync(analysisOutputsDir)) {
    fs.mkdirSync(analysisOutputsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/audios', express.static(path.join(__dirname, 'audios')));
app.use('/videos', express.static(videosDir));
app.use('/analysis_outputs', express.static(analysisOutputsDir));

function leerPacientes() {
    if (!fs.existsSync(archivoDatos)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(archivoDatos, 'utf-8'));
}

function normalizarTexto(valor) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/Ã³/g, 'o')
        .replace(/Ã¡/g, 'a')
        .replace(/Ã©/g, 'e')
        .replace(/Ã­/g, 'i')
        .replace(/Ãº/g, 'u')
        .replace(/Ã±/g, 'n')
        .replace(/\\/g, '/')
        .toLowerCase();
}

function obtenerRutaAudioPaciente(index, pista) {
    const pacientes = leerPacientes();
    const paciente = pacientes[Number(index)];
    if (!paciente || !Array.isArray(paciente.evaluaciones_detalladas)) {
        return null;
    }

    const evaluacion = paciente.evaluaciones_detalladas.find(
        ev => String(ev.nro_pista) === String(pista)
    );
    if (!evaluacion || !evaluacion.archivo) {
        return null;
    }

    const audiosBase = path.join(__dirname, 'audios');
    const archivoOriginal = String(evaluacion.archivo);
    const rutaDirecta = path.join(audiosBase, ...archivoOriginal.split('/'));
    if (fs.existsSync(rutaDirecta)) {
        return rutaDirecta;
    }

    const normalizadoObjetivo = normalizarTexto(archivoOriginal);
    const archivosDisponibles = fs.readdirSync(audiosBase, { recursive: true, withFileTypes: true });

    for (const entrada of archivosDisponibles) {
        if (!entrada.isFile()) {
            continue;
        }
        const relativa = path.relative(audiosBase, path.join(entrada.parentPath, entrada.name));
        if (normalizarTexto(relativa) === normalizadoObjetivo) {
            return path.join(entrada.parentPath, entrada.name);
        }
    }

    const basenameObjetivo = normalizarTexto(path.basename(archivoOriginal));
    for (const entrada of archivosDisponibles) {
        if (!entrada.isFile()) {
            continue;
        }
        if (normalizarTexto(entrada.name) === basenameObjetivo) {
            return path.join(entrada.parentPath, entrada.name);
        }
    }

    return null;
}

function localPathToPublicUrl(localPath) {
    const relative = path.relative(analysisOutputsDir, localPath).split(path.sep).join('/');
    return `/analysis_outputs/${relative}`;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pacienteDir = path.join(videosDir, `paciente_${req.params.index}`);
        if (!fs.existsSync(pacienteDir)) {
            fs.mkdirSync(pacienteDir, { recursive: true });
        }
        cb(null, pacienteDir);
    },
    filename: function (req, file, cb) {
        const nombreLimpio = file.originalname.replace(/\s+/g, '_');
        const nombreFinal = `pista_${req.params.pista}_${nombreLimpio}`;
        cb(null, nombreFinal);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /video\//;
        if (allowedTypes.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de video.'));
        }
    }
});

app.get('/api/pacientes', (req, res) => {
    const pacientes = leerPacientes();

    const pacientesConVideos = pacientes.map(p => ({
        ...p,
        videos: p.videos || {}
    }));

    res.json(pacientesConVideos);
});

app.post('/api/pacientes', (req, res) => {
    const pacientes = leerPacientes();
    pacientes.push(req.body);
    fs.writeFileSync(archivoDatos, JSON.stringify(pacientes, null, 2));
    res.status(201).json({ mensaje: 'Paciente guardado con éxito' });
});

app.patch('/api/pacientes/:index', (req, res) => {
    const pacientes = leerPacientes();
    const index = Number(req.params.index);

    if (!Number.isInteger(index) || index < 0 || index >= pacientes.length) {
        return res.status(404).json({ error: 'Paciente no encontrado.' });
    }

    const actual = pacientes[index] || {};
    const payload = req.body || {};

    pacientes[index] = {
        ...actual,
        ...payload,
        bnpm: {
            ...(actual.bnpm || {}),
            ...(payload.bnpm || {})
        }
    };

    fs.writeFileSync(archivoDatos, JSON.stringify(pacientes, null, 2));
    res.json({ mensaje: 'Paciente actualizado con Ã©xito.', paciente: pacientes[index] });
});

app.post('/api/pacientes/:index/videos/:pista', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo de video.' });
    }

    res.status(201).json({
        mensaje: 'Video subido correctamente.',
        archivo: req.file.filename,
        ruta: `/videos/paciente_${req.params.index}/${req.file.filename}`
    });
});

app.get('/api/pacientes/:index/videos', (req, res) => {
    const pacienteDir = path.join(videosDir, `paciente_${req.params.index}`);
    if (!fs.existsSync(pacienteDir)) {
        return res.json({ videos: {} });
    }

    const archivos = fs.readdirSync(pacienteDir);
    const videos = {};

    archivos.forEach(archivo => {
        const match = archivo.match(/pista_(\d+)/);
        if (match) {
            videos[match[1]] = `/videos/paciente_${req.params.index}/${archivo}`;
        }
    });

    res.json({ videos });
});

app.delete('/api/pacientes/:index/videos/:pista', (req, res) => {
    const pacienteDir = path.join(videosDir, `paciente_${req.params.index}`);
    if (!fs.existsSync(pacienteDir)) {
        return res.status(404).json({ error: 'No se encontró el directorio.' });
    }

    const archivos = fs.readdirSync(pacienteDir);
    const archivoVideo = archivos.find(f => f.startsWith(`pista_${req.params.pista}`));

    if (!archivoVideo) {
        return res.status(404).json({ error: 'Video no encontrado.' });
    }

    fs.unlinkSync(path.join(pacienteDir, archivoVideo));
    res.json({ mensaje: 'Video eliminado.' });
});

app.post('/api/pacientes/:index/analizar/:pista', async (req, res) => {
    try {
        const { index, pista } = req.params;
        const pacienteDir = path.join(videosDir, `paciente_${index}`);

        if (!fs.existsSync(pacienteDir)) {
            return res.status(404).json({ error: 'Carpeta del paciente no encontrada.' });
        }

        const archivos = fs.readdirSync(pacienteDir);
        const nombreArchivo = archivos.find(f => f.startsWith(`pista_${pista}`));
        if (!nombreArchivo) {
            return res.status(404).json({ error: 'No se encontró el video de esta pista.' });
        }

        const rutaAudioMetronomo = obtenerRutaAudioPaciente(index, pista);
        if (!rutaAudioMetronomo || !fs.existsSync(rutaAudioMetronomo)) {
            return res.status(404).json({ error: 'No se encontró el audio del metrónomo asociado a esta pista.' });
        }

        const rutaVideo = path.join(pacienteDir, nombreArchivo);
        const outputDir = path.join(analysisOutputsDir, `paciente_${index}`, `pista_${pista}`);

        const response = await fetch('https://backend-tesis-music.onrender.com/analizar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ruta_video: rutaVideo,
                nombre_archivo: nombreArchivo,
                ruta_audio_metronomo: rutaAudioMetronomo,
                output_dir: outputDir
            })
        });

        const rawText = await response.text();
        let data = {};

        try {
            data = rawText ? JSON.parse(rawText) : {};
        } catch (parseError) {
            console.error('Respuesta inválida del servidor Python:', rawText);
            return res.status(502).json({
                error: 'El servidor Python devolvió una respuesta no válida.',
                detalle: rawText
            });
        }

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.message || data.error || 'Error durante el análisis.',
                detalle: data
            });
        }

        if (Array.isArray(data.graficos)) {
            data.graficos = data.graficos
                .filter(filePath => fs.existsSync(filePath))
                .map(localPathToPublicUrl);
        }

        if (Array.isArray(data.generated_files)) {
            data.generated_files = data.generated_files
                .filter(filePath => fs.existsSync(filePath))
                .map(localPathToPublicUrl);
        }

        res.json(data);
    } catch (error) {
        console.error('Error al contactar con Python:', error);
        res.status(500).json({
            error: 'El servidor de Python no respondió.',
            detalle: error.message
        });
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('\n==============================================');
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log('Carpeta de audios activada y lista.');
    console.log('Carpeta de videos activada y lista.');
    console.log('Carpeta de resultados de análisis activada.');
    console.log('==============================================\n');
});

