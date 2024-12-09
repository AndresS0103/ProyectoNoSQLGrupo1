// Llamado de librerías
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

// Puerto y host
const port = 3005;
const hostname = 'http://localhost';

// Permitir formato JSON en las solicitudes
app.use(express.json());
app.use(cors())

// Conexión a MongoDB en la nube
const urlNube = "mongodb+srv://AndresS0103:6bnjnTQoHXzfRAgq@proyectoredsocialnosql.qdhat.mongodb.net/RedSocialDB";
mongoose.connect(urlNube)
    .then(() => console.log('Base de datos en la nube conectada...'))
    .catch((error) => console.log('Error al conectar a la base de datos: ' + error));

// Esquema para Comentarios
const SchemaComentarios = new mongoose.Schema({
    comentario_id: String,
    // ID de la publicación a la que pertenece el comentario
    publicacion_id: String, 
    // ID del usuario que hizo el comentario
    usuario_id: String, 
    // Contenido del comentario
    contenido: String,
    // Fecha en la que se creó el comentario
    fecha_comentario: Date 
});

const Comentarios = mongoose.model('Comentarios', SchemaComentarios, 'Comentarios'); 

// Ruta GET para obtener los comentarios de una publicación específica
app.get('/Comentarios', async (req, res) => {
    const { publicacion_id } = req.query;

    try {
        const comentarios = await Comentarios.find({ publicacion_id });
        res.json(comentarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los comentarios: " + error.message });
    }
});



// Ruta GET para obtener un comentario por ID
app.get('/Comentarios/:id', async (req, res) => {
    try {
        const comentario = await Comentarios.findOne({ comentario_id: req.params.id });
        if (!comentario) return res.status(404).json({ message: "Comentario no encontrado" });
        res.json(comentario);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el comentario: " + error.message });
    }
});

// Ruta POST para crear un nuevo comentario
app.post('/Comentarios', async (req, res) => {
    const { comentario_id, publicacion_id, usuario_id, contenido, fecha_comentario } = req.body;
    const nuevoComentario = new Comentarios({
        comentario_id,
        publicacion_id,
        usuario_id,
        contenido,
        fecha_comentario
    });

    try {
        const comentarioGuardado = await nuevoComentario.save();
        res.status(201).json(comentarioGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el comentario: " + error.message });
    }
});

// Ruta PUT para actualizar un comentario por ID
app.put('/Comentarios/:id', async (req, res) => {
    const { contenido } = req.body;

    try {
        const comentarioActualizado = await Comentarios.findOneAndUpdate(
            { comentario_id: req.params.id },
            { contenido },
            { new: true }
        );

        if (!comentarioActualizado) return res.status(404).json({ message: "Comentario no encontrado" });
        res.json(comentarioActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el comentario: " + error.message });
    }
});

// Ruta DELETE para eliminar un comentario por ID
app.delete('/Comentarios/:id', async (req, res) => {
    try {
        const comentarioEliminado = await Comentarios.findOneAndDelete({ comentario_id: req.params.id });
        if (!comentarioEliminado) return res.status(404).json({ message: "Comentario no encontrado" });
        res.json({ message: "Comentario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el comentario: " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
