import express from 'express';
import { getAllPublicaciones, getPublicacionById, createPublicacion, updatePublicacion, deletePublicacion, addLike, removeLike } from '../controllers/publicacionesController.js';

const router = express.Router();

router.get('/', getAllPublicaciones);
router.get('/:id', getPublicacionById);
router.post('/', createPublicacion);
router.put('/:id', updatePublicacion);
router.delete('/:id', deletePublicacion);
router.put('/:publicacionId/add-like', addLike);
router.put('/:publicacionId/remove-like', removeLike);

export default router;