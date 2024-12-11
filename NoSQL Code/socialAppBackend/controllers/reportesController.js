import Reportes from '../models/reportes.js';

// Ruta GET para obtener todos los reportes
export const getAllReportes = async (req, res) => {
    try {
        const reportes = await Reportes.find();
        res.json(reportes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los reportes: " + error.message });
    }
};

// Ruta GET para obtener un reporte por ID
export const getReporteById = async (req, res) => {
    try {
        const reporte = await Reportes.findOne({ reporte_id: req.params.id });
        if (!reporte) return res.status(404).json({ message: "Reporte no encontrado" });
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el reporte: " + error.message });
    }
};

// Ruta POST para crear un nuevo reporte
export const createReporte = async (req, res) => {
    const { reporte_id, tipo, publicacion_id, comentario_id, usuario_reportante, razon, fecha_reporte } = req.body;
    const nuevoReporte = new Reportes({
        reporte_id,
        tipo,
        publicacion_id,
        comentario_id,
        usuario_reportante,
        razon,
        fecha_reporte
    });
    try {
        const reporteGuardado = await nuevoReporte.save();
        res.status(201).json(reporteGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el reporte: " + error.message });
    }
};

// Ruta PUT para actualizar un reporte por ID
export const updateReporte = async (req, res) => {
    const { razon } = req.body; // Permitir solo actualizar la razón
    try {
        const reporteActualizado = await Reportes.findOneAndUpdate(
            { reporte_id: req.params.id },
            { razon },
            { new: true }
        );
        if (!reporteActualizado) return res.status(404).json({ message: "Reporte no encontrado" });
        res.json(reporteActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el reporte: " + error.message });
    }
};

// Ruta DELETE para eliminar un reporte por ID
export const deleteReporte = async (req, res) => {
    try {
        const reporteEliminado = await Reportes.findOneAndDelete({ reporte_id: req.params.id });
        if (!reporteEliminado) return res.status(404).json({ message: "Reporte no encontrado" });
        res.json({ message: "Reporte eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el reporte: " + error.message });
    }
};