import express from 'express';
import { getAllUsuarios, getUsuarioById, getSeguidoresByUsuarioId, createUsuario, updateUsuario, deleteUsuario, followUsuario, unfollowUsuario, removeSeguidor } from '../controllers/usuariosController.js';

const router = express.Router();

router.get('/', getAllUsuarios);
router.get('/:id', getUsuarioById);
router.get('/:id/seguidores', getSeguidoresByUsuarioId);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);
router.post('/follow', followUsuario);
router.post('/unfollow', unfollowUsuario);
router.post('/remove-seguidor', removeSeguidor);

export default router;