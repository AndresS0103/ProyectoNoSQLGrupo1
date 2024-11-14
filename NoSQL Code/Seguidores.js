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

// Esquema para Seguidores
const SchemaSeguidores = new mongoose.Schema({
    seguidor_id: String,
    usuario_id: String, 
    seguido_id: String, 
    fecha_seguimiento: Date 
});

const Seguidores = mongoose.model('Seguidores', SchemaSeguidores);

// Ruta GET para obtener todos los seguidores
app.get('/Seguidores', async (req, res) => {
    try {
        const seguidores = await Seguidores.find();
        res.json(seguidores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los seguidores: " + error.message });
    }
});

// Ruta GET para obtener un seguimiento específico por ID
app.get('/Seguidores/:id', async (req, res) => {
    try {
        const seguidor = await Seguidores.findOne({ seguidor_id: req.params.id });
        if (!seguidor) return res.status(404).json({ message: "Seguimiento no encontrado" });
        res.json(seguidor);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el seguimiento: " + error.message });
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
