// Llamado de librerías
import mongoose from "mongoose";

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

export default Reacciones;