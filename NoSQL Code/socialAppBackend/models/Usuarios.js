// Llamado de librerías
import mongoose from "mongoose";

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

const Usuarios = mongoose.model('Usuarios', SchemaUsuarios, 'Usuarios');

export default Usuarios;
