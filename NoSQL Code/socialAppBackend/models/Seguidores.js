// Llamado de librerías
import mongoose from "mongoose";

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

export default Seguidores;