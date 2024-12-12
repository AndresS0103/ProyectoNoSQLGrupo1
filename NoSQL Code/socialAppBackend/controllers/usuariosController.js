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

//Ruta GET para obtener los seguidores por usuario
export const getSeguidoresByUsuarioId = async (req, res) => {
	try {
		// Buscar el usuario activo por su usuario_id
		const usuario = await Usuarios.findOne({ usuario_id: req.params.id });

		if (!usuario) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}

		// Buscar los datos completos de los seguidores utilizando los IDs en el campo seguidores
		const seguidores = await Usuarios.find({ usuario_id: { $in: usuario.seguidores } });

		res.json(seguidores);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener los seguidores: ' + error.message });
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

export const followUsuario = async (req, res) => {
	try {
		const { usuarioId, seguidoId } = req.body;

		// Validar que ambos usuarios existan
		const usuario = await Usuarios.findOne({ usuario_id: usuarioId });
		const seguido = await Usuarios.findOne({ usuario_id: seguidoId });

		if (!usuario || !seguido) {
			return res.status(404).json({ message: 'Usuario no encontrado.' });
		}

		// Evitar que se sigan a sí mismos o que ya sean seguidores
		if (usuarioId === seguidoId) {
			return res.status(400).json({ message: 'No puedes seguirte a ti mismo.' });
		}
		if (usuario.seguidos.includes(seguidoId)) {
			return res.status(400).json({ message: 'Ya sigues a este usuario.' });
		}

		// Actualizar los arrays de seguidores y seguidos
		usuario.seguidos.push(seguidoId);
		seguido.seguidores.push(usuarioId);

	
		await usuario.save();
		await seguido.save();

		res.status(200).json({ message: 'Has comenzado a seguir a este usuario.' });
	} catch (error) {
		res.status(500).json({ message: 'Error al seguir al usuario: ' + error.message });
	}
};

export const unfollowUsuario = async (req, res) => {
	try {
		const { usuarioId, seguidoId } = req.body;

		// Validar que ambos usuarios existan
		const usuario = await Usuarios.findOne({ usuario_id: usuarioId });
		const seguido = await Usuarios.findOne({ usuario_id: seguidoId });

		if (!usuario || !seguido) {
			return res.status(404).json({ message: 'Usuario no encontrado.' });
		}

		if (!usuario.seguidos.includes(seguidoId)) {
			return res.status(400).json({ message: 'No sigues a este usuario.' });
		}

		// Eliminar los IDs de los arrays correspondientes
		usuario.seguidos = usuario.seguidos.filter((id) => id !== seguidoId);
		seguido.seguidores = seguido.seguidores.filter((id) => id !== usuarioId);

		
		await usuario.save();
		await seguido.save();

		res.status(200).json({ message: 'Has dejado de seguir a este usuario.' });
	} catch (error) {
		res.status(500).json({ message: 'Error al dejar de seguir al usuario: ' + error.message });
	}
};

export const removeSeguidor = async (req, res) => {
	try {
	  const { usuarioId, seguidorId } = req.body;
  
	  // Validar que ambos usuarios existan
	  const usuario = await Usuarios.findOne({ usuario_id: usuarioId });
	  const seguidor = await Usuarios.findOne({ usuario_id: seguidorId });
  
	  if (!usuario || !seguidor) {
		return res.status(404).json({ message: 'Usuario no encontrado.' });
	  }
  
	  // Verificar que el seguidor realmente esté siguiendo al usuario
	  if (!usuario.seguidores.includes(seguidorId)) {
		return res.status(400).json({ message: 'Este usuario no es un seguidor.' });
	  }
  
	  // Eliminar los IDs de los arrays correspondientes
	  usuario.seguidores = usuario.seguidores.filter((id) => id !== seguidorId);
	  seguidor.seguidos = seguidor.seguidos.filter((id) => id !== usuarioId);
  
	 
	  await usuario.save();
	  await seguidor.save();
  
	  res.status(200).json({ message: 'Seguidor removido exitosamente.' });
	} catch (error) {
	  res.status(500).json({ message: 'Error al remover al seguidor: ' + error.message });
	}
  };
  
