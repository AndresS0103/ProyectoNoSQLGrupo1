// Llamado de librerías
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

// Puerto y host
const port = 3003;
const hostname = 'http://localhost';

app.use(express.json());
app.use(cors())


// Conexión a MongoDB en la nube
const urlNube = "mongodb+srv://AndresS0103:6bnjnTQoHXzfRAgq@proyectoredsocialnosql.qdhat.mongodb.net/RedSocialDB";
mongoose.connect(urlNube)
    .then(() => console.log('Base de datos en la nube conectada...'))
    .catch((error) => console.log('Error al conectar a la base de datos: ' + error));

// Esquema para Publicaciones
const SchemaPublicaciones = new mongoose.Schema({
    publicacion_id: String,
    usuario_id: String,
    contenido: String,
    fecha_publicacion: Date,
    imagen: String,
    // Lista de usuarios que han dado "me gusta"
    me_gusta: [String], 
    // Lista de comentarios en la publicación
    comentarios: [String] 
});

const Publicaciones = mongoose.model('Publicaciones', SchemaPublicaciones, 'Publicaciones');
// Ruta GET para obtener todas las publicaciones
app.get('/Publicaciones', async (req, res) => {
    try {
        const publicaciones = await Publicaciones.find();
        res.json(publicaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las publicaciones: " + error.message });
    }
});

// Ruta GET para obtener una publicación por ID
app.get('/Publicaciones/:id', async (req, res) => {
    try {
        const publicacion = await Publicaciones.findOne({ publicacion_id: req.params.id });
        if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
        res.json(publicacion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la publicación: " + error.message });
    }
});

// Ruta POST para crear una nueva publicación
app.post('/Publicaciones', async (req, res) => {
    const { publicacion_id, usuario_id, contenido, fecha_publicacion, imagen, me_gusta, comentarios } = req.body;
    const nuevaPublicacion = new Publicaciones({
        publicacion_id,
        usuario_id,
        contenido,
        fecha_publicacion,
        imagen,
        me_gusta,
        comentarios
    });

    try {
        const publicacionGuardada = await nuevaPublicacion.save();
        res.status(201).json(publicacionGuardada);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la publicación: " + error.message });
    }
});

// Ruta PUT para actualizar una publicación por ID
app.put('/Publicaciones/:id', async (req, res) => {
    const { contenido, imagen, me_gusta, comentarios } = req.body;

    try {
        const publicacionActualizada = await Publicaciones.findOneAndUpdate(
            { publicacion_id: req.params.id },
            { contenido, imagen, me_gusta, comentarios },
            { new: true }
        );

        if (!publicacionActualizada) return res.status(404).json({ message: "Publicación no encontrada" });
        res.json(publicacionActualizada);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la publicación: " + error.message });
    }
});

// Ruta DELETE para eliminar una publicación por ID
app.delete('/Publicaciones/:id', async (req, res) => {
    try {
        const publicacionEliminada = await Publicaciones.findOneAndDelete({ publicacion_id: req.params.id });
        if (!publicacionEliminada) return res.status(404).json({ message: "Publicación no encontrada" });
        res.json({ message: "Publicación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la publicación: " + error.message });
    }
});

app.put('/Publicaciones/:publicacionId/add-like', async (req, res) => {
    const { usuario_id } = req.body; // ID del usuario que dio "me gusta"
    const { publicacionId } = req.params;

    try {
        const publicacion = await Publicaciones.findOneAndUpdate(
            { publicacion_id: publicacionId },
            { $addToSet: { me_gusta: usuario_id } }, // Asegura que no se duplique
            { new: true }
        );
        if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
        res.json(publicacion); // Devuelve la publicación actualizada
    } catch (error) {
        res.status(500).json({ message: "Error al agregar 'Me gusta': " + error.message });
    }
});

// Ruta PUT para eliminar un "Me gusta"
app.put('/Publicaciones/:publicacionId/remove-like', async (req, res) => {
    const { usuario_id } = req.body; // ID del usuario que quitó "me gusta"
    const { publicacionId } = req.params;

    try {
        const publicacion = await Publicaciones.findOneAndUpdate(
            { publicacion_id: publicacionId },
            { $pull: { me_gusta: usuario_id } }, // Elimina el usuario_id del array
            { new: true }
        );
        if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
        res.json(publicacion); // Devuelve la publicación actualizada
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar 'Me gusta': " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});

