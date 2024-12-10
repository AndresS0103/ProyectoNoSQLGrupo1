const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Puerto y host
const port = 3007;
const hostname = 'http://localhost';

// Permitir formato JSON en las solicitudes
app.use(express.json());
app.use(cors());

// Conexión a MongoDB en la nube
const urlNube = "mongodb+srv://AndresS0103:6bnjnTQoHXzfRAgq@proyectoredsocialnosql.qdhat.mongodb.net/RedSocialDB";
mongoose.connect(urlNube)
    .then(() => console.log('Base de datos en la nube conectada...'))
    .catch((error) => console.log('Error al conectar a la base de datos: ' + error));

// Esquema para Seguidores
const SchemaSeguidores = new mongoose.Schema({
    seguidor_id: String,
    // ID del usuario que es seguido
    usuario_id: String,
    // ID del usuario que sigue 
    seguido_id: String, 
    // Fecha en la que comenzó el seguimiento
    fecha_seguimiento: Date 
});

const Seguidores = mongoose.model('Seguidores', SchemaSeguidores, 'Seguidores');

// Ruta GET para obtener todos los seguidores
app.get('/Seguidores', async (req, res) => {
    try {
        const seguidores = await Seguidores.find();
        res.json(seguidores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los seguidores: " + error.message });
    }
});

// Ruta GET para obtener todos los seguidores de un usuario específico
app.get('/Seguidores/:usuario_id', async (req, res) => {
    try {
        // Filtra por seguido_id (los usuarios que siguen al usuario actual)
        const seguidores = await Seguidores.find({ seguido_id: req.params.usuario_id });
        if (!seguidores || seguidores.length === 0) {
            //Devuelve un array vacío si no hay seguidores
            return res.json([]); 
        }
        res.json(seguidores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los seguidores: " + error.message });
    }
});


// Ruta POST para crear un nuevo seguimiento
app.post('/Seguidores', async (req, res) => {
    const { seguidor_id, usuario_id, seguido_id, fecha_seguimiento } = req.body;
    const nuevoSeguidor = new Seguidores({
        seguidor_id,
        usuario_id,
        seguido_id,
        fecha_seguimiento
    });

    try {
        const seguimientoGuardado = await nuevoSeguidor.save();
        res.status(201).json(seguimientoGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el seguimiento: " + error.message });
    }
});

// Ruta PUT para actualizar la fecha de seguimiento por ID
app.put('/Seguidores/:id', async (req, res) => {
    const { fecha_seguimiento } = req.body;

    try {
        const seguidorActualizado = await Seguidores.findOneAndUpdate(
            { seguidor_id: req.params.id },
            { fecha_seguimiento },
            { new: true }
        );

        if (!seguidorActualizado) return res.status(404).json({ message: "Seguimiento no encontrado" });
        res.json(seguidorActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el seguimiento: " + error.message });
    }
});

// Ruta DELETE para eliminar un seguimiento por ID
app.delete('/Seguidores/:id', async (req, res) => {
    try {
        const seguidorEliminado = await Seguidores.findOneAndDelete({ seguidor_id: req.params.id });
        if (!seguidorEliminado) return res.status(404).json({ message: "Seguimiento no encontrado" });
        res.json({ message: "Seguimiento eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el seguimiento: " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
