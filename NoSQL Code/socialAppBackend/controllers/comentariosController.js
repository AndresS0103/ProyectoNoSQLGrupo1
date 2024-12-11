import Comentarios from '../models/comentarios.js';

// Ruta GET para obtener los comentarios de una publicación específica
export const getAllComentarios = async (req, res) => {
    const { publicacion_id } = req.query;
    try {
        const comentarios = await Comentarios.find({ publicacion_id });
        res.json(comentarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los comentarios: " + error.message });
    }
};

// Ruta GET para obtener un comentario por ID
export const getComentarioById = async (req, res) => {
    try {
        const comentario = await Comentarios.findOne({ comentario_id: req.params.id });
        if (!comentario) return res.status(404).json({ message: 'Comentario no encontrado' });
        res.json(comentario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el comentario: ' + error.message });
    }
};

// Ruta POST para crear un nuevo comentario
export const createComentario = async (req, res) => {
    const { comentario_id, publicacion_id, usuario_id, contenido, fecha_comentario } = req.body;
    const nuevoComentario = new Comentarios({
        comentario_id,
        publicacion_id,
        usuario_id,
        contenido,
        fecha_comentario,
    });

    try {
        const comentarioGuardado = await nuevoComentario.save();
        res.status(201).json(comentarioGuardado);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el comentario: ' + error.message });
    }
};

// Ruta PUT para actualizar un comentario por ID
export const updateComentario = async (req, res) => {
    const { contenido } = req.body;
    try {
        const comentarioActualizado = await Comentarios.findOneAndUpdate(
            { comentario_id: req.params.id },
            { contenido },
            { new: true }
        );

        if (!comentarioActualizado) return res.status(404).json({ message: 'Comentario no encontrado' });
        res.json(comentarioActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el comentario: ' + error.message });
    }
};

// Ruta DELETE para eliminar un comentario por ID
export const deleteComentario = async (req, res) => {
    try {
        const comentarioEliminado = await Comentarios.findOneAndDelete({ comentario_id: req.params.id });
        if (!comentarioEliminado) return res.status(404).json({ message: 'Comentario no encontrado' });
        res.json({ message: 'Comentario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el comentario: ' + error.message });
    }
};