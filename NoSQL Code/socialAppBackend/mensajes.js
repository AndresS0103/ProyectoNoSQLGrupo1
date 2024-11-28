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

// Esquema para Mensajes
const SchemaMensajes = new mongoose.Schema({
    mensaje_id: String,
    // ID del usuario que envía el mensaje
    emisor_id: String, 
    // ID del usuario que recibe el mensaje
    receptor_id: String, 
    // Contenido del mensaje
    contenido: String, 
    // Fecha de envío del mensaje
    fecha_envio: Date, 
    // Estado de lectura (true/false)
    leido: Boolean 
});

const Mensajes = mongoose.model('Mensajes', SchemaMensajes, 'Mensajes'); 

// Ruta GET para obtener todos los mensajes
app.get('/Mensajes', async (req, res) => {
    try {
        const mensajes = await Mensajes.find();
        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los mensajes: " + error.message });
    }
});

// Ruta GET para obtener un mensaje por ID
app.get('/Mensajes/:id', async (req, res) => {
    try {
        const mensaje = await Mensajes.findOne({ mensaje_id: req.params.id });
        if (!mensaje) return res.status(404).json({ message: "Mensaje no encontrado" });
        res.json(mensaje);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el mensaje: " + error.message });
    }
});

// Ruta POST para crear un nuevo mensaje
app.post('/Mensajes', async (req, res) => {
    const { mensaje_id, emisor_id, receptor_id, contenido, fecha_envio, leido } = req.body;
    const nuevoMensaje = new Mensajes({
        mensaje_id,
        emisor_id,
        receptor_id,
        contenido,
        fecha_envio,
        leido
    });

    try {
        const mensajeGuardado = await nuevoMensaje.save();
        res.status(201).json(mensajeGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el mensaje: " + error.message });
    }
});

// Ruta PUT para actualizar el estado de lectura de un mensaje por ID
app.put('/Mensajes/:id', async (req, res) => {
    const { leido } = req.body;

    try {
        const mensajeActualizado = await Mensajes.findOneAndUpdate(
            { mensaje_id: req.params.id },
            { leido },
            { new: true }
        );

        if (!mensajeActualizado) return res.status(404).json({ message: "Mensaje no encontrado" });
        res.json(mensajeActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el mensaje: " + error.message });
    }
});

// Ruta DELETE para eliminar un mensaje por ID
app.delete('/Mensajes/:id', async (req, res) => {
    try {
        const mensajeEliminado = await Mensajes.findOneAndDelete({ mensaje_id: req.params.id });
        if (!mensajeEliminado) return res.status(404).json({ message: "Mensaje no encontrado" });
        res.json({ message: "Mensaje eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el mensaje: " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
