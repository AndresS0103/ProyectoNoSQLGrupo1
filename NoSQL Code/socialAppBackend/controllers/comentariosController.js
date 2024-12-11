import Comentarios from '../models/comentarios.js'; // Importa el modelo 'Comentarios' para interactuar con la base de datos.

// Ruta GET para obtener los comentarios de una publicación específica
export const getAllComentarios = async (req, res) => {
    const { publicacion_id } = req.query; // Extrae el ID de la publicación desde los parámetros de consulta.
    try {
        // Busca todos los comentarios asociados con el ID de la publicación.
        const comentarios = await Comentarios.find({ publicacion_id });
        res.json(comentarios); // Devuelve los comentarios en formato JSON.
    } catch (error) {
        // Maneja errores y responde con un mensaje de error y un código 500.
        res.status(500).json({ message: "Error al obtener los comentarios: " + error.message });
    }
};

// Ruta GET para obtener un comentario por ID
export const getComentarioById = async (req, res) => {
    try {
        // Busca un comentario por su ID único.
        const comentario = await Comentarios.findOne({ comentario_id: req.params.id });
        if (!comentario) 
            return res.status(404).json({ message: 'Comentario no encontrado' }); // Si no se encuentra, responde con un código 404.
        res.json(comentario); // Devuelve el comentario encontrado.
    } catch (error) {
        // Maneja errores y responde con un mensaje de error y un código 500.
        res.status(500).json({ message: 'Error al obtener el comentario: ' + error.message });
    }
};

// Ruta POST para crear un nuevo comentario
export const createComentario = async (req, res) => {
    // Extrae los datos del cuerpo de la solicitud para crear un nuevo comentario.
    const { comentario_id, publicacion_id, usuario_id, contenido, fecha_comentario } = req.body;
    const nuevoComentario = new Comentarios({
        comentario_id, // ID único del comentario.
        publicacion_id, // ID de la publicación asociada.
        usuario_id, // ID del usuario que realizó el comentario.
        contenido, // Texto del comentario.
        fecha_comentario, // Fecha en que se realizó el comentario.
    });

    try {
        // Guarda el nuevo comentario en la base de datos.
        const comentarioGuardado = await nuevoComentario.save();
        res.status(201).json(comentarioGuardado); // Responde con el comentario creado y un código 201.
    } catch (error) {
        // Maneja errores y responde con un mensaje de error y un código 500.
        res.status(500).json({ message: 'Error al crear el comentario: ' + error.message });
    }
};

// Ruta PUT para actualizar un comentario por ID
export const updateComentario = async (req, res) => {
    const { contenido } = req.body; // Extrae el nuevo contenido del cuerpo de la solicitud.
    try {
        // Busca y actualiza el comentario por su ID único, devolviendo el documento actualizado.
        const comentarioActualizado = await Comentarios.findOneAndUpdate(
            { comentario_id: req.params.id },
            { contenido },
            { new: true } // La opción 'new: true' asegura que se devuelva el documento actualizado.
        );

        if (!comentarioActualizado) 
            return res.status(404).json({ message: 'Comentario no encontrado' }); // Si no se encuentra, responde con un código 404.
        res.json(comentarioActualizado); // Responde con el comentario actualizado.
    } catch (error) {
        // Maneja errores y responde con un mensaje de error y un código 500.
        res.status(500).json({ message: 'Error al actualizar el comentario: ' + error.message });
    }
};

// Ruta DELETE para eliminar un comentario por ID
export const deleteComentario = async (req, res) => {
    try {
        // Busca y elimina el comentario por su ID único.
        const comentarioEliminado = await Comentarios.findOneAndDelete({ comentario_id: req.params.id });
        if (!comentarioEliminado) 
            return res.status(404).json({ message: 'Comentario no encontrado' }); // Si no se encuentra, responde con un código 404.
        res.json({ message: 'Comentario eliminado correctamente' }); // Confirma la eliminación del comentario.
    } catch (error) {
        // Maneja errores y responde con un mensaje de error y un código 500.
        res.status(500).json({ message: 'Error al eliminar el comentario: ' + error.message });
    }
};
