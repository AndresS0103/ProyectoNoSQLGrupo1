// Llamado de librerías
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

// Puerto y host
const port = 3006;
const hostname = 'http://localhost';

// Permitir formato JSON en las solicitudes
app.use(express.json());
app.use(cors());

// Conexión a MongoDB en la nube
const urlNube = "mongodb+srv://AndresS0103:6bnjnTQoHXzfRAgq@proyectoredsocialnosql.qdhat.mongodb.net/RedSocialDB";
mongoose.connect(urlNube)
    .then(() => console.log('Base de datos en la nube conectada...'))
    .catch((error) => console.log('Error al conectar a la base de datos: ' + error));

const SchemaReportes = new mongoose.Schema({
    reporte_id: String,
    // Tipo de reporte: "publicacion" o "comentario"
    tipo: String, 
    // ID de la publicación
    publicacion_id: String, 
    // ID del comentario (si es un comentario o si no lo dejamos vacio)
    comentario_id: String, 
    // ID del usuario que reporta
    usuario_reportante: String, 
    // Razón del reporte
    razon: String, 
    // Fecha en la que se creó el reporte
    fecha_reporte: Date 
});

const Reportes = mongoose.model('Reportes', SchemaReportes, 'Reportes'); 

// Ruta GET para obtener todos los reportes
app.get('/Reportes', async (req, res) => {
    try {
        const reportes = await Reportes.find();
        res.json(reportes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los reportes: " + error.message });
    }
});

// Ruta GET para obtener un reporte por ID
app.get('/Reportes/:id', async (req, res) => {
    try {
        const reporte = await Reportes.findOne({ reporte_id: req.params.id });
        if (!reporte) return res.status(404).json({ message: "Reporte no encontrado" });
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el reporte: " + error.message });
    }
});

// Ruta POST para crear un nuevo reporte
app.post('/Reportes', async (req, res) => {
    const { reporte_id, tipo, publicacion_id, comentario_id, usuario_reportante, razon, fecha_reporte } = req.body;
    const nuevoReporte = new Reportes({
        reporte_id,
        tipo,
        publicacion_id,
        comentario_id,
        usuario_reportante,
        razon,
        fecha_reporte
    });

    try {
        const reporteGuardado = await nuevoReporte.save();
        res.status(201).json(reporteGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el reporte: " + error.message });
    }
});

// Ruta PUT para actualizar un reporte por ID
app.put('/Reportes/:id', async (req, res) => {
    const { razon } = req.body; // Permitir solo actualizar la razón

    try {
        const reporteActualizado = await Reportes.findOneAndUpdate(
            { reporte_id: req.params.id },
            { razon },
            { new: true }
        );

        if (!reporteActualizado) return res.status(404).json({ message: "Reporte no encontrado" });
        res.json(reporteActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el reporte: " + error.message });
    }
});

// Ruta DELETE para eliminar un reporte por ID
app.delete('/Reportes/:id', async (req, res) => {
    try {
        const reporteEliminado = await Reportes.findOneAndDelete({ reporte_id: req.params.id });
        if (!reporteEliminado) return res.status(404).json({ message: "Reporte no encontrado" });
        res.json({ message: "Reporte eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el reporte: " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
