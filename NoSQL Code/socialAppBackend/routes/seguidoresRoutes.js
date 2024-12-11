import express from 'express';
import { getAllSeguidores, getSeguidoresByUsuarioId, createSeguidor, updateSeguidor, deleteSeguidor } from '../controllers/seguidoresController.js';

const router = express.Router();

router.get('/', getAllSeguidores);
router.get('/:usuario_id', getSeguidoresByUsuarioId);
router.post('/', createSeguidor);
router.put('/:id', updateSeguidor);
router.delete('/:id', deleteSeguidor);

export default router;