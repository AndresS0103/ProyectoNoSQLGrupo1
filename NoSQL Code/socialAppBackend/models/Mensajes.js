// Llamado de librerías
import mongoose from "mongoose";

// Esquema para Mensajes
const SchemaMensajes = new mongoose.Schema({
    mensaje_id: String,
    // ID del usuario que envía el mensaje
    emisor_id: String, 
    // ID del usuario que recibe el mensaje
    receptor_id: String, 
    // Contenido del mensaje
    contenido: String, 
    // Fecha de envío del mensaje
    fecha_envio: Date, 
    // Estado de lectura (true/false)
    leido: Boolean 
});

const Mensajes = mongoose.model('Mensajes', SchemaMensajes, 'Mensajes'); 

export default Mensajes;
