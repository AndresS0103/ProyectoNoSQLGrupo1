import Usuarios from '../models/usuarios.js';

// Ruta GET para obtener el listado de todos los usuarios
export const getAllUsuarios = async (req, res) => {
	try {
		const usuarios = await Usuarios.find();
		res.json(usuarios);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener los usuarios: ' + error.message });
	}
};

// Ruta GET para obtener un usuario por su usuario_id
export const getUsuarioById = async (req, res) => {
	try {
		const usuario = await Usuarios.findOne({ usuario_id: req.params.id });
		if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
		res.json(usuario);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener el usuario: ' + error.message });
	}
};

// Ruta POST para crear un nuevo usuario
export const createUsuario = async (req, res) => {
	const { usuario_id, nombre, email, fecha_registro, biografia, foto_perfil, seguidores, seguidos } = req.body;
	const nuevoUsuario = new Usuarios({
		usuario_id,
		nombre,
		email,
		fecha_registro,
		biografia,
		foto_perfil,
		seguidores,
		seguidos,
	});
	try {
		const usuarioGuardado = await nuevoUsuario.save();
		res.status(201).json(usuarioGuardado);
	} catch (error) {
		res.status(500).json({ message: 'Error al crear el usuario: ' + error.message });
	}
};

// Ruta PUT para actualizar un usuario por su usuario_id
export const updateUsuario = async (req, res) => {
	const { nombre, email, biografia, foto_perfil, seguidores, seguidos } = req.body;
	try {
		const usuarioActualizado = await Usuarios.findOneAndUpdate(
			{ usuario_id: req.params.id },
			{ nombre, email, biografia, foto_perfil, seguidores, seguidos },
			{ new: true }
		);

		if (!usuarioActualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
		res.json(usuarioActualizado);
	} catch (error) {
		res.status(500).json({ message: 'Error al actualizar el usuario: ' + error.message });
	}
};

// Ruta DELETE para eliminar un usuario por su usuario_id
export const deleteUsuario = async (req, res) => {
	try {
		const usuarioEliminado = await Usuarios.findOneAndDelete({ usuario_id: req.params.id });
		if (!usuarioEliminado) return res.status(404).json({ message: 'Usuario no encontrado' });
		res.json({ message: 'Usuario eliminado correctamente' });
	} catch (error) {
		res.status(500).json({ message: 'Error al eliminar el usuario: ' + error.message });
	}
};
