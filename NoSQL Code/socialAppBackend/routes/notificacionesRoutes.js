import express from 'express';
import { getAllNotificaciones, getNotificacionById, createNotificacion, updateNotificacion, deleteNotificacion } from '../controllers/notificacionesController.js';

const router = express.Router();

router.get('/', getAllNotificaciones);
router.get('/:id', getNotificacionById);
router.post('/', createNotificacion);
router.put('/:id', updateNotificacion);
router.delete('/:id', deleteNotificacion);

export default router;