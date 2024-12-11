import Seguidores from '../models/seguidores.js';

// Ruta GET para obtener todos los seguidores
export const getAllSeguidores = async (req, res) => {
    try {
        const seguidores = await Seguidores.find();
        res.json(seguidores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los seguidores: " + error.message });
    }
};

// Ruta GET para obtener todos los seguidores de un usuario específico
export const getSeguidoresByUsuarioId = async (req, res) => {
    try {
        // Filtra por seguido_id (los usuarios que siguen al usuario actual)
        const seguidores = await Seguidores.find({ seguido_id: req.params.usuario_id });
        if (!seguidores || seguidores.length === 0) {
            return res.status(404).json({ message: "Seguidores no encontrados" });
        }
        res.json(seguidores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los seguidores: " + error.message });
    }
};

// Ruta POST para crear un nuevo seguimiento
export const createSeguidor = async (req, res) => {
    const { seguidor_id, usuario_id, seguido_id, fecha_seguimiento } = req.body;
    const nuevoSeguidor = new Seguidores({
        seguidor_id,
        usuario_id,
        seguido_id,
        fecha_seguimiento
    });
    try {
        const seguidorGuardado = await nuevoSeguidor.save();
        res.status(201).json(seguidorGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el seguidor: " + error.message });
    }
};

// Ruta PUT para actualizar la fecha de seguimiento por ID
export const updateSeguidor = async (req, res) => {
    const { fecha_seguimiento } = req.body;
    try {
        const seguidorActualizado = await Seguidores.findOneAndUpdate(
            { seguidor_id: req.params.id },
            { fecha_seguimiento },
            { new: true }
        );

        if (!seguidorActualizado) return res.status(404).json({ message: "Seguimiento no encontrado" });
        res.json(seguidorActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el seguimiento: " + error.message });
    }
};

// Ruta DELETE para eliminar un seguimiento por ID
export const deleteSeguidor = async (req, res) => {
    try {
        const seguidorEliminado = await Seguidores.findOneAndDelete({ seguidor_id: req.params.id });
        if (!seguidorEliminado) return res.status(404).json({ message: "Seguimiento no encontrado" });
        res.json({ message: "Seguimiento eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el seguimiento: " + error.message });
    }
};