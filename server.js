const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
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
app.use(express.static(__dirname));
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
    res.json(leerPacientes());
});

app.post('/api/pacientes', (req, res) => {
    const pacientes = leerPacientes();
    pacientes.push(req.body);
    fs.writeFileSync(archivoDatos, JSON.stringify(pacientes, null, 2));
    res.status(201).json({ mensaje: 'Paciente guardado con éxito' });
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

        // ✅ RESPUESTA TEMPORAL
        return res.json({
            mensaje: "Análisis no disponible en producción aún",
            paciente: index,
            pista: pista,
            graficos: [],
            generated_files: []
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Error en el servidor.',
            detalle: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log('\n==============================================');
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('Carpeta de audios activada y lista.');
    console.log('Carpeta de videos activada y lista.');
    console.log('Carpeta de resultados de análisis activada.');
    console.log('==============================================\n');
});
