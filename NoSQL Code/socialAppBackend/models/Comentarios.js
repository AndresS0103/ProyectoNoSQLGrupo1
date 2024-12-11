// Llamado de librerías
import mongoose from "mongoose";

// Esquema para Comentarios
const SchemaComentarios = new mongoose.Schema({
    comentario_id: String,
    publicacion_id: String, 
    usuario_id: String, 
    contenido: String,
    fecha_comentario: Date 
});

const Comentarios = mongoose.model("Comentarios", SchemaComentarios, 'Comentarios');

export default Comentarios;