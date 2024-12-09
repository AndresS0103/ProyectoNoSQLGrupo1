// Llamado de librerías
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

// Puerto y host
const port = 3004;
const hostname = 'http://localhost';

// Permitir formato JSON en las solicitudes
app.use(express.json());
app.use(cors())

// Conexión a MongoDB en la nube
const urlNube = "mongodb+srv://AndresS0103:6bnjnTQoHXzfRAgq@proyectoredsocialnosql.qdhat.mongodb.net/RedSocialDB";
mongoose.connect(urlNube)
    .then(() => console.log('Base de datos en la nube conectada...'))
    .catch((error) => console.log('Error al conectar a la base de datos: ' + error));

// Esquema para Reacciones
const SchemaReacciones = new mongoose.Schema({
    reaccion_id: String,
    // ID de la publicación a la que pertenece la reacción
    publicacion_id: String, 
    // ID del usuario que realizó la reacción
    usuario_id: String, 
     // Tipo de reacción (me gusta, me encanta)
    tipo_reaccion: String,
    fecha_reaccion: Date
});

const Reacciones = mongoose.model('Reacciones', SchemaReacciones, 'Reacciones'); 

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

// Ruta PUT para agregar un "Me gusta"
app.put('/Reacciones/:publicacionId/add-like', async (req, res) => {
    const { usuario_id } = req.body;
    const { publicacionId } = req.params;
  
    try {
      const publicacion = await Reacciones.findOneAndUpdate(
        { publicacion_id: publicacionId },
        { $addToSet: { me_gusta: usuario_id } }, // Asegura que el usuario_id no se duplique
        { new: true }
      );
      if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
      res.json(publicacion);
    } catch (error) {
      res.status(500).json({ message: "Error al agregar 'Me gusta': " + error.message });
    }
  });
  
  // Ruta PUT para eliminar un "Me gusta"
  app.put('/Reacciones/:publicacionId/remove-like', async (req, res) => {
    const { usuario_id } = req.body;
    const { publicacionId } = req.params;
  
    try {
      const publicacion = await Reacciones.findOneAndUpdate(
        { publicacion_id: publicacionId },
        { $pull: { me_gusta: usuario_id } }, // Elimina el usuario_id de la lista
        { new: true }
      );
      if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
      res.json(publicacion);
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar 'Me gusta': " + error.message });
    }
  });

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
