import Notificaciones from '../models/notificaciones.js';

// Ruta GET para obtener todas las notificaciones
export const getAllNotificaciones = async (req, res) => {
    try {
      const { usuario_id } = req.query;
  
      let notificaciones;
      if (usuario_id) {
        // Filtrar notificaciones por usuario_id
        notificaciones = await Notificaciones.find({ usuario_id });
      } else {
        // Obtener todas las notificaciones
        notificaciones = await Notificaciones.find();
      }
  
      res.json(notificaciones);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las notificaciones: " + error.message });
    }
  };

// Ruta GET para obtener una notificación por ID
export const getNotificacionById = async (req, res) => {
    try {
        const notificacion = await Notificaciones.findOne({ notificacion_id: req.params.id });
        if (!notificacion) return res.status(404).json({ message: "Notificación no encontrada" });
        res.json(notificacion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la notificación: " + error.message });
    }
};

// Ruta POST para crear una nueva notificación
export const createNotificacion = async (req, res) => {
    const { notificacion_id, usuario_id, tipo, referencia_id, leido, fecha_notificacion } = req.body;
    const nuevaNotificacion = new Notificaciones({
        notificacion_id,
        usuario_id,
        tipo,
        referencia_id,
        leido,
        fecha_notificacion
    });
    try {
        const notificacionGuardada = await nuevaNotificacion.save();
        res.status(201).json(notificacionGuardada);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la notificación: " + error.message });
    }
};

// Ruta PUT para actualizar una notificación por ID
export const updateNotificacion = async (req, res) => {
    const { leido } = req.body; // Solo se permite actualizar el estado de lectura
    try {
        const notificacionActualizada = await Notificaciones.findOneAndUpdate(
            { notificacion_id: req.params.id },
            { tipo, referencia_id, leido, fecha_notificacion },
            { new: true }
        );

        if (!notificacionActualizada) return res.status(404).json({ message: "Notificación no encontrada" });
        res.json(notificacionActualizada);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la notificación: " + error.message });
    }
};

// Ruta DELETE para eliminar una notificación por ID
export const deleteNotificacion = async (req, res) => {
    try {
        const notificacionEliminada = await Notificaciones.findOneAndDelete({ notificacion_id: req.params.id });
        if (!notificacionEliminada) return res.status(404).json({ message: "Notificación no encontrada" });
        res.json({ message: "Notificación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la notificación: " + error.message });
    }
};
