import express from 'express';
import { getAllReacciones, getReaccionById, createReaccion, updateReaccion, deleteReaccion } from '../controllers/reaccionesController.js';

const router = express.Router();

router.get('/', getAllReacciones);
router.get('/:id', getReaccionById);
router.post('/', createReaccion);
router.put('/:id', updateReaccion);
router.delete('/:id', deleteReaccion);

export default router;