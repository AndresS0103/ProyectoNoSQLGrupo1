// Llamado de librerías
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Puerto y host
const port = 3002;
const hostname = 'http://localhost';

// Permitir formato JSON en las solicitudes
app.use(express.json());

// Conexión a MongoDB en la nube
const urlNube = "mongodb+srv://AndresS0103:6bnjnTQoHXzfRAgq@proyectoredsocialnosql.qdhat.mongodb.net/RedSocialDB";
mongoose.connect(urlNube)
    .then(() => console.log('Base de datos en la nube conectada...'))
    .catch((error) => console.log('Error al conectar a la base de datos: ' + error));

// Esquema para Notificaciones
const SchemaNotificaciones = new mongoose.Schema({
    notificacion_id: String,
    // ID del usuario al que pertenece la notificación
    usuario_id: String, 
    // Tipo de notificación (nuevo_seguidor, nuevo_comentario)
    tipo: String, 
    // ID relacionado con la notificación (comentario, publicación)
    referencia_id: String, 
     // Estado de lectura de la notificación
    leido: Boolean,
    // Fecha en la que se creó la notificación
    fecha_notificacion: Date 
});

const Notificaciones = mongoose.model('Notificaciones', SchemaNotificaciones, 'Notificaciones'); 

// Ruta GET para obtener todas las notificaciones
app.get('/Notificaciones', async (req, res) => {
    try {
        const notificaciones = await Notificaciones.find();
        res.json(notificaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las notificaciones: " + error.message });
    }
});

// Ruta GET para obtener una notificación por ID
app.get('/Notificaciones/:id', async (req, res) => {
    try {
        const notificacion = await Notificaciones.findOne({ notificacion_id: req.params.id });
        if (!notificacion) return res.status(404).json({ message: "Notificación no encontrada" });
        res.json(notificacion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la notificación: " + error.message });
    }
});

// Ruta POST para crear una nueva notificación
app.post('/Notificaciones', async (req, res) => {
    const { notificacion_id, usuario_id, tipo, referencia_id, leido, fecha_notificacion } = req.body;
    const nuevaNotificacion = new Notificaciones({
        notificacion_id,
        usuario_id,
        tipo,
        referencia_id,
        leido,
        fecha_notificacion
    });

    try {
        const notificacionGuardada = await nuevaNotificacion.save();
        res.status(201).json(notificacionGuardada);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la notificación: " + error.message });
    }
});

// Ruta PUT para actualizar una notificación por ID
app.put('/Notificaciones/:id', async (req, res) => {
    const { leido } = req.body; // Solo se permite actualizar el estado de lectura

    try {
        const notificacionActualizada = await Notificaciones.findOneAndUpdate(
            { notificacion_id: req.params.id },
            { leido },
            { new: true }
        );

        if (!notificacionActualizada) return res.status(404).json({ message: "Notificación no encontrada" });
        res.json(notificacionActualizada);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la notificación: " + error.message });
    }
});

// Ruta DELETE para eliminar una notificación por ID
app.delete('/Notificaciones/:id', async (req, res) => {
    try {
        const notificacionEliminada = await Notificaciones.findOneAndDelete({ notificacion_id: req.params.id });
        if (!notificacionEliminada) return res.status(404).json({ message: "Notificación no encontrada" });
        res.json({ message: "Notificación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la notificación: " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
