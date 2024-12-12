import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Seguir.css';

function Seguir({ usuarioActivo }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/usuarios');
      if (response.status === 200) {
        setUsuarios(response.data);
        setLoading(false);
      }
    } catch (err) {
      setError('Error al obtener la lista de usuarios: ' + err.message);
      setLoading(false);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleFollow = async (seguidoId) => {
    try {
      const response = await axios.post('http://localhost:3000/usuarios/follow', {
        usuarioId: usuarioActivo.usuario_id,
        seguidoId,
      });

      if (response.status === 200) {
        showNotification('¡Has comenzado a seguir a este usuario!');
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((user) =>
            user.usuario_id === seguidoId
              ? { ...user, seguidores: [...user.seguidores, usuarioActivo.usuario_id] }
              : user
          )
        );
      }
    } catch (err) {
      showNotification('Error al seguir al usuario');
    }
  };

  const handleUnfollow = async (seguidoId) => {
    try {
      const response = await axios.post('http://localhost:3000/usuarios/unfollow', {
        usuarioId: usuarioActivo.usuario_id,
        seguidoId,
      });

      if (response.status === 200) {
        showNotification('Has dejado de seguir a este usuario');
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((user) =>
            user.usuario_id === seguidoId
              ? { ...user, seguidores: user.seguidores.filter((id) => id !== usuarioActivo.usuario_id) }
              : user
          )
        );
      }
    } catch (err) {
      showNotification('Error al dejar de seguir al usuario');
    }
  };

  if (loading) {
    return <div className="seguir-container loading-state">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="seguir-container error-message">{error}</div>;
  }

  return (
    <div className="seguir-container">
      <h2>Usuarios Sugeridos</h2>
      <ul className="usuarios-list">
        {usuarios.map((usuario) =>
          usuario.usuario_id !== usuarioActivo.usuario_id ? (
            <li key={usuario.usuario_id} className="usuario-item">
              <img
                src={usuario.foto_perfil || 'https://via.placeholder.com/50'}
                alt="Foto de perfil"
                className="profile-pic"
              />
              <div className="usuario-info">
                <div>
                  <strong>{usuario.nombre}</strong>
                  <p>{usuario.email}</p>
                </div>
                {usuario.seguidores.includes(usuarioActivo.usuario_id) ? (
                  <button
                    className="unfollow-button"
                    onClick={() => handleUnfollow(usuario.usuario_id)}
                  >
                    Siguiendo
                  </button>
                ) : (
                  <button
                    className="follow-button"
                    onClick={() => handleFollow(usuario.usuario_id)}
                  >
                    Seguir
                  </button>
                )}
              </div>
            </li>
          ) : null
        )}
      </ul>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
}

export default Seguir;