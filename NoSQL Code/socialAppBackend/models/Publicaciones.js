// Llamado de librerías
import mongoose from "mongoose";

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

export default Publicaciones;