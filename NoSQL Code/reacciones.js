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

// Esquema para Reacciones
const SchemaReacciones = new mongoose.Schema({
    reaccion_id: String,
    publicacion_id: String, 
    usuario_id: String, 
    tipo_reaccion: String, 
    fecha_reaccion: Date
});

const Reacciones = mongoose.model('Reacciones', SchemaReacciones);

// Ruta GET para obtener todas las reacciones
app.get('/Reacciones', async (req, res) => {
    try {
        const reacciones = await Reacciones.find();
        res.json(reacciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las reacciones: " + error.message });
    }
});

// Ruta GET para obtener una reacción por ID
app.get('/Reacciones/:id', async (req, res) => {
    try {
        const reaccion = await Reacciones.findOne({ reaccion_id: req.params.id });
        if (!reaccion) return res.status(404).json({ message: "Reacción no encontrada" });
        res.json(reaccion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la reacción: " + error.message });
    }
});

// Ruta POST para crear una nueva reacción
app.post('/Reacciones', async (req, res) => {
    const { reaccion_id, publicacion_id, usuario_id, tipo_reaccion, fecha_reaccion } = req.body;
    const nuevaReaccion = new Reacciones({
        reaccion_id,
        publicacion_id,
        usuario_id,
        tipo_reaccion,
        fecha_reaccion
    });

    try {
        const reaccionGuardada = await nuevaReaccion.save();
        res.status(201).json(reaccionGuardada);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reacción: " + error.message });
    }
});

// Ruta PUT para actualizar una reacción por ID
app.put('/Reacciones/:id', async (req, res) => {
    const { tipo_reaccion } = req.body; 

    try {
        const reaccionActualizada = await Reacciones.findOneAndUpdate(
            { reaccion_id: req.params.id },
            { tipo_reaccion },
            { new: true }
        );

        if (!reaccionActualizada) return res.status(404).json({ message: "Reacción no encontrada" });
        res.json(reaccionActualizada);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la reacción: " + error.message });
    }
});

// Ruta DELETE para eliminar una reacción por ID
app.delete('/Reacciones/:id', async (req, res) => {
    try {
        const reaccionEliminada = await Reacciones.findOneAndDelete({ reaccion_id: req.params.id });
        if (!reaccionEliminada) return res.status(404).json({ message: "Reacción no encontrada" });
        res.json({ message: "Reacción eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la reacción: " + error.message });
    }
});
