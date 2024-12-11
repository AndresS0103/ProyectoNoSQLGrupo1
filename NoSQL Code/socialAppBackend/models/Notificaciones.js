// Llamado de librerías
import mongoose from "mongoose";

// Esquema para Notificaciones
const SchemaNotificaciones = new mongoose.Schema({
    notificacion_id: String,
    // ID del usuario al que pertenece la notificación
    usuario_id: String, 
    // Tipo de notificación (nuevo_seguidor, nuevo_comentario)
    tipo: String, 
    // ID relacionado con la notificación (comentario, publicación)
    referencia_id: String, 
     // Estado de lectura de la notificación
    leido: Boolean,
    // Fecha en la que se creó la notificación
    fecha_notificacion: Date 
});

const Notificaciones = mongoose.model('Notificaciones', SchemaNotificaciones, 'Notificaciones'); 

export default Notificaciones;