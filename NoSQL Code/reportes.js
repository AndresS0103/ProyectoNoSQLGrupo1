const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Puerto y host
const port = 3002;
const hostname = 'http://localhost';

// Permitir formato JSON en las solicitudes
app.use(express.json());

// Conexión a MongoDB en la nube
//cambiar esto por la conexion que tengo en el atlas
const urlNube = "mongodb+srv://usuario:contraseña@cluster.mongodb.net/RedSocialDB?retryWrites=true&w=majority";
mongoose.connect(urlNube, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Base de datos en la nube conectada...'))
.catch((error) => console.log('Error al conectar a la base de datos: ' + error));

// Esquema para Reportes
const SchemaReportes = new mongoose.Schema({
    reporte_id: String,
    tipo: String, 
    publicacion_id: String,
    comentario_id: String, 
    usuario_reportante: String, 
    razon: String, 
    fecha_reporte: Date
});

const Reportes = mongoose.model('Reportes', SchemaReportes);

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
    const { razon } = req.body; 

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
