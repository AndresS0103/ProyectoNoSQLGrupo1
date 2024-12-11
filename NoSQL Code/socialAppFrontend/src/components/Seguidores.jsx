import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Seguidores.css';

function Seguidores({ usuarioActivo }) {
  const [seguidores, setSeguidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usuarioActivo) {
      fetchSeguidores(usuarioActivo.usuario_id);
    }
  }, [usuarioActivo]);

  const fetchSeguidores = async (usuarioId) => {
    try {
      // Ajustar la URL para incluir usuarioId como parte de la ruta
      const response = await axios.get(`http://localhost:3000/Seguidores/${usuarioId}`);
      if (response.status === 200) {
        setSeguidores(response.data);
        setLoading(false);
      }
    } catch (err) {
      setError('Error al obtener los seguidores: ' + err.message);
      setLoading(false);
    }
  };

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
      <h2>Seguidores de {usuarioActivo.nombre}</h2>
      {seguidores.length === 0 ? (
        <p className="no-followers">Este usuario no tiene seguidores.</p>
      ) : (
        <ul className="seguidores-list">
          {seguidores.map((seguidor) => (
            <li key={seguidor.seguidor_id}>
              <strong>Usuario ID:</strong> {seguidor.seguido_id}
              <p><strong>Fecha:</strong> {new Date(seguidor.fecha_seguimiento).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Seguidores;
