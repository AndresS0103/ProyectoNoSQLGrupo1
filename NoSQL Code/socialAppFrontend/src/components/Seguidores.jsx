import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Seguidores.css';

function Seguidores({ usuarioActivo }) {
  const [seguidores, setSeguidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (usuarioActivo) {
      fetchSeguidores(usuarioActivo.usuario_id);
    }
  }, [usuarioActivo]);

  const fetchSeguidores = async (usuarioId) => {
    try {
      const response = await axios.get(`http://localhost:3000/usuarios/${usuarioId}/seguidores`);
      if (response.status === 200) {
        setSeguidores(response.data);
        setLoading(false);
      }
    } catch (err) {
      setError('Error al obtener los seguidores: ' + err.message);
      setLoading(false);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // La notificación desaparece después de 3 segundos
  };

  const handleRemove = async (seguidorId) => {
    try {
      const response = await axios.post('http://localhost:3000/usuarios/unfollow', {
        usuarioId: seguidorId,
        seguidoId: usuarioActivo.usuario_id
      });

      if (response.status === 200) {
        showNotification('Seguidor removido exitosamente');
        setSeguidores(prevSeguidores => 
          prevSeguidores.filter(seguidor => seguidor.usuario_id !== seguidorId)
        );
      }
    } catch (err) {
      showNotification('Error al remover seguidor');
    }
  };

  const filteredSeguidores = seguidores.filter(seguidor =>
    seguidor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!usuarioActivo) {
    return <div className="seguidores-container">Por favor selecciona un usuario.</div>;
  }

  if (loading) {
    return <div className="seguidores-container">Cargando seguidores...</div>;
  }

  if (error) {
    return <div className="seguidores-container">Error: {error}</div>;
  }

  return (
    <div className="seguidores-container">
      <div className="seguidores-header">
        <h2>Followers</h2>
        <button className="close-button">&times;</button>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredSeguidores.length === 0 ? (
        <p className="no-followers">
          {searchTerm ? "No results found." : "Este usuario no tiene seguidores."}
        </p>
      ) : (
        <ul className="seguidores-list">
          {filteredSeguidores.map((seguidor) => (
            <li key={seguidor.usuario_id} className="seguidores-item">
              <img
                src={seguidor.foto_perfil || 'https://via.placeholder.com/50'}
                alt="Foto de perfil"
                className="profile-pic"
              />
              <div className="seguidor-info">
                <strong>{seguidor.nombre}</strong>
                <p>{seguidor.email}</p>
              </div>
              <button
                className="remove-button"
                onClick={() => handleRemove(seguidor.usuario_id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
}

export default Seguidores;