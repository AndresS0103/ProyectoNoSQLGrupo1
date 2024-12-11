import express from 'express';
import { getAllMensajes, getMensajeById, createMensaje, updateMensaje, deleteMensaje } from '../controllers/mensajesController.js';

const router = express.Router();

router.get('/', getAllMensajes);
router.get('/:id', getMensajeById);
router.post('/', createMensaje);
router.put('/:id', updateMensaje);
router.delete('/:id', deleteMensaje);

export default router;