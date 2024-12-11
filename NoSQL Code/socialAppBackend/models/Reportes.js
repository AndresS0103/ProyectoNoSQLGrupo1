// Llamado de librerías
import mongoose from "mongoose";

const SchemaReportes = new mongoose.Schema({
    reporte_id: String,
    // Tipo de reporte: "publicacion" o "comentario"
    tipo: String, 
    // ID de la publicación
    publicacion_id: String, 
    // ID del comentario (si es un comentario o si no lo dejamos vacio)
    comentario_id: String, 
    // ID del usuario que reporta
    usuario_reportante: String, 
    // Razón del reporte
    razon: String, 
    // Fecha en la que se creó el reporte
    fecha_reporte: Date 
});

const Reportes = mongoose.model('Reportes', SchemaReportes, 'Reportes'); 

export default Reportes;   