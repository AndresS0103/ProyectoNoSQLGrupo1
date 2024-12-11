import Publicaciones from '../models/publicaciones.js';

// Ruta GET para obtener todas las publicaciones
export const getAllPublicaciones = async (req, res) => {
    try {
        const publicaciones = await Publicaciones.find();
        res.json(publicaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las publicaciones: " + error.message });
    }
};

// Ruta GET para obtener una publicación por ID
export const getPublicacionById = async (req, res) => {
    try {
        const publicacion = await Publicaciones.findOne({ publicacion_id: req.params.id });
        if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
        res.json(publicacion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la publicación: " + error.message });
    }
};

// Ruta POST para crear una nueva publicación
export const createPublicacion = async (req, res) => {
    const { publicacion_id, usuario_id, contenido, fecha_publicacion, imagen, me_gusta, comentarios } = req.body;
    const nuevaPublicacion = new Publicaciones({
        publicacion_id,
        usuario_id,
        contenido,
        fecha_publicacion,
        imagen,
        me_gusta,
        comentarios
    });
    try {
        const publicacionGuardada = await nuevaPublicacion.save();
        res.status(201).json(publicacionGuardada);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la publicación: " + error.message });
    }
};

// Ruta PUT para actualizar una publicación por ID
export const updatePublicacion = async (req, res) => {
    const { contenido, imagen, me_gusta, comentarios } = req.body;
    try {
        const publicacionActualizada = await Publicaciones.findOneAndUpdate(
            { publicacion_id: req.params.id },
            { contenido, imagen, me_gusta, comentarios },
            { new: true }
        );
        if (!publicacionActualizada) return res.status(404).json({ message: "Publicación no encontrada" });
        res.json(publicacionActualizada);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la publicación: " + error.message });
    }
};

// Ruta DELETE para eliminar una publicación por ID
export const deletePublicacion = async (req, res) => {
    try {
        const publicacionEliminada = await Publicaciones.findOneAndDelete({ publicacion_id: req.params.id });
        if (!publicacionEliminada) return res.status(404).json({ message: "Publicación no encontrada" });
        res.json({ message: "Publicación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la publicación: " + error.message });
    }
};

// Ruta PUT para agregar un "Me gusta"
export const addLike = async (req, res) => {
    const { usuario_id } = req.body; // ID del usuario que dio "me gusta"
    const { publicacionId } = req.params;
    try {
        const publicacion = await Publicaciones.findOneAndUpdate(
            { publicacion_id: publicacionId },
            { $addToSet: { me_gusta: usuario_id } }, // Asegura que no se duplique
            { new: true }
        );
        if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
        res.json(publicacion); // Devuelve la publicación actualizada
    } catch (error) {
        res.status(500).json({ message: "Error al agregar 'Me gusta': " + error.message });
    }
};

// Ruta PUT para eliminar un "Me gusta"
export const removeLike = async (req, res) => {
    const { usuario_id } = req.body; // ID del usuario que quitó "me gusta"
    const { publicacionId } = req.params;
    try {
        const publicacion = await Publicaciones.findOneAndUpdate(
            { publicacion_id: publicacionId },
            { $pull: { me_gusta: usuario_id } }, // Elimina el usuario_id del array
            { new: true }
        );
        if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
        res.json(publicacion); // Devuelve la publicación actualizada
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar 'Me gusta': " + error.message });
    }
};