import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Sidebar.css';

const Sidebar = ({ setUsuarioActivo }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conteoSeguidores, setConteoSeguidores] = useState(0);
  const [conteoSeguidos, setConteoSeguidos] = useState(0);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Usuarios');
      if (response.status === 200) {
        setUsuarios(response.data);
        const usuarioPorDefecto = response.data[0]; // Seleccionar el primer usuario por defecto
        setUsuarioSeleccionado(usuarioPorDefecto);
        setUsuarioActivo(usuarioPorDefecto);
        actualizarConteos(usuarioPorDefecto);
        setLoading(false);
      }
    } catch (err) {
      setError('Error al obtener los usuarios: ' + err.message);
      setLoading(false);
    }
  };

  const actualizarConteos = (usuario) => {
    if (usuario) {
      setConteoSeguidores(usuario.seguidores?.length || 0); // Conteo de seguidores
      setConteoSeguidos(usuario.seguidos?.length || 0); // Conteo de seguidos
    } else {
      setConteoSeguidores(0);
      setConteoSeguidos(0);
    }
  };

  const handleChangeUser = (event) => {
    const usuario = usuarios.find(user => user.usuario_id === event.target.value);
    setUsuarioSeleccionado(usuario);
    setUsuarioActivo(usuario);
    actualizarConteos(usuario);
  };

  if (loading) {
    return <div className="sidebar">Cargando...</div>;
  }

  if (error) {
    return <div className="sidebar">Error: {error}</div>;
  }

  return (
    <aside className="sidebar">
      {/* Selector de usuarios */}
      <div className="user-selector">
        <select
          value={usuarioSeleccionado?.usuario_id || ''}
          onChange={handleChangeUser}
          className="user-dropdown"
        >
          {usuarios.map(user => (
            <option key={user.usuario_id} value={user.usuario_id}>
              {user.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Perfil del usuario */}
      <div className="profile-section">
        <img
          src={usuarioSeleccionado?.foto_perfil || '/placeholder.jpg'}
          alt="Perfil"
          className="profile-picture"
        />
        <h2>{usuarioSeleccionado?.nombre}</h2>
        <p>@{usuarioSeleccionado?.usuario_id}</p>
        {usuarioSeleccionado?.biografia && (
          <p className="user-biography">
            <strong>Bio: </strong> {usuarioSeleccionado.biografia}
          </p>
        )}
        <div className="followers-following">
          <p><strong>Seguidores:</strong> {conteoSeguidores}</p>
          <p><strong>Siguiendo:</strong> {conteoSeguidos}</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="navigation-menu">
        <ul>
          <li>
            <Link to="/">🏠 Inicio</Link>
          </li>
          <li>
            <Link to="/usuarios">👥 Usuarios</Link>
          </li>
          <li>
            <Link to="/seguidores">👤 Seguidores</Link>
          </li>
          <li>
            <Link to="/configuracion">⚙️ Reportes</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
