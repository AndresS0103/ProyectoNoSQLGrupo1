import Reacciones from '../models/reacciones.js';

// Ruta GET para obtener todas las reacciones
export const getAllReacciones = async (req, res) => {
    try {
        const reacciones = await Reacciones.find();
        res.json(reacciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las reacciones: " + error.message });
    }
};

// Ruta GET para obtener una reacción por ID
export const getReaccionById = async (req, res) => {
    try {
        const reaccion = await Reacciones.findOne({ reaccion_id: req.params.id });
        if (!reaccion) return res.status(404).json({ message: "Reacción no encontrada" });
        res.json(reaccion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la reacción: " + error.message });
    }
};

// Ruta POST para crear una nueva reacción
export const createReaccion = async (req, res) => {
    const { reaccion_id, publicacion_id, usuario_id, tipo_reaccion, fecha_reaccion } = req.body;
    const nuevaReaccion = new Reacciones({
        reaccion_id,
        publicacion_id,
        usuario_id,
        tipo_reaccion,
        fecha_reaccion
    });
    try {
        const reaccionGuardada = await nuevaReaccion.save();
        res.status(201).json(reaccionGuardada);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reacción: " + error.message });
    }
};

// Ruta PUT para actualizar una reacción por ID
export const updateReaccion = async (req, res) => {
    const { tipo_reaccion, fecha_reaccion } = req.body;
    try {
        const reaccionActualizada = await Reacciones.findOneAndUpdate(
            { reaccion_id: req.params.id },
            { tipo_reaccion, fecha_reaccion },
            { new: true }
        );
        if (!reaccionActualizada) return res.status(404).json({ message: "Reacción no encontrada" });
        res.json(reaccionActualizada);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la reacción: " + error.message });
    }
};

// Ruta DELETE para eliminar una reacción por ID
export const deleteReaccion = async (req, res) => {
    try {
        const reaccionEliminada = await Reacciones.findOneAndDelete({ reaccion_id: req.params.id });
        if (!reaccionEliminada) return res.status(404).json({ message: "Reacción no encontrada" });
        res.json({ message: "Reacción eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la reacción: " + error.message });
    }
};