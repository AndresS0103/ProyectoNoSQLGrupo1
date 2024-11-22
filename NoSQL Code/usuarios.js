// Llamado de librerías
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Puerto y host
const port = 3002;
const hostname = 'http://localhost';

app.use(express.json());

// Conexión a MongoDB en la nube
const urlNube = "mongodb+srv://AndresS0103:6bnjnTQoHXzfRAgq@proyectoredsocialnosql.qdhat.mongodb.net/RedSocialDB";
mongoose.connect(urlNube, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Base de datos en la nube conectada...'))
.catch((error) => console.log('Error al conectar a la base de datos: ' + error));

// Esquema para Usuarios
const SchemaUsuarios = new mongoose.Schema({
    usuario_id: String,
    nombre: String,
    email: String,
    fecha_registro: Date,
    biografia: String,
    foto_perfil: String,
    seguidores: [String],
    seguidos: [String]
});

const Usuarios = mongoose.model('Usuarios', SchemaUsuarios, 'Usuarios'); // Usar colección existente

// Ruta GET para obtener el listado de todos los usuarios
app.get('/Usuarios', async (req, res) => {
    try {
        const usuarios = await Usuarios.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios: " + error.message });
    }
});

// Ruta GET para obtener un usuario por su usuario_id
app.get('/Usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuarios.findOne({ usuario_id: req.params.id });
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario: " + error.message });
    }
});

// Ruta POST para crear un nuevo usuario
app.post('/Usuarios', async (req, res) => {
    const { usuario_id, nombre, email, fecha_registro, biografia, foto_perfil, seguidores, seguidos } = req.body;
    const nuevoUsuario = new Usuarios({
        usuario_id,
        nombre,
        email,
        fecha_registro,
        biografia,
        foto_perfil,
        seguidores,
        seguidos
    });

    try {
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el usuario: " + error.message });
    }
});

// Ruta PUT para actualizar un usuario por su usuario_id
app.put('/Usuarios/:id', async (req, res) => {
    const { nombre, email, biografia, foto_perfil, seguidores, seguidos } = req.body;

    try {
        const usuarioActualizado = await Usuarios.findOneAndUpdate(
            { usuario_id: req.params.id },
            { nombre, email, biografia, foto_perfil, seguidores, seguidos },
            { new: true }
        );

        if (!usuarioActualizado) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario: " + error.message });
    }
});

// Ruta DELETE para eliminar un usuario por su usuario_id
app.delete('/Usuarios/:id', async (req, res) => {
    try {
        const usuarioEliminado = await Usuarios.findOneAndDelete({ usuario_id: req.params.id });
        if (!usuarioEliminado) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario: " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
