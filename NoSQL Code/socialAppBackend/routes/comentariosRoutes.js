import express from 'express';
import { getAllComentarios, getComentarioById, createComentario, updateComentario, deleteComentario } from '../controllers/comentariosController.js';

const router = express.Router();

router.get('/', getAllComentarios);
router.get('/:id', getComentarioById);
router.post('/', createComentario);
router.put('/:id', updateComentario);
router.delete('/:id', deleteComentario);

export default router;