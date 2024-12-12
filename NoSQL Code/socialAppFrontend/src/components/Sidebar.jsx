import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import userPlaceholder from '../img/user-placeholder.png';
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
    const usuario = usuarios.find((user) => user.usuario_id === event.target.value);
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
    <aside className="sidebar p-3">
      {/* Selector de usuarios */}
      <div className="user-selector mb-3">
        <select
          value={usuarioSeleccionado?.usuario_id || ''}
          onChange={handleChangeUser}
          className="form-select"
        >
          {usuarios.map((user) => (
            <option key={user.usuario_id} value={user.usuario_id}>
              {user.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Perfil del usuario */}
      <div className="profile-section text-center mb-3">
        <img
          src={usuarioSeleccionado?.foto_perfil ? usuarioSeleccionado.foto_perfil : userPlaceholder}
          alt="Perfil"
          className="profile-picture rounded-circle mb-2"
          style={{ width: '100px', height: '100px' }}
        />
        <h2 className="h5">{usuarioSeleccionado?.nombre}</h2>
        <p className="text-muted">@{usuarioSeleccionado?.usuario_id}</p>
        {usuarioSeleccionado?.biografia && (
          <p className="user-biography">
            <strong>Bio: </strong> {usuarioSeleccionado.biografia}
          </p>
        )}
        <div className="followers-following d-flex justify-content-around mt-3">
          <p>
            <strong>Seguidores:</strong> {conteoSeguidores}
          </p>
          <p>
            <strong>Siguiendo:</strong> {conteoSeguidos}
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="navigation-menu">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              🏠 Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/usuarios" className="nav-link">
              👥 Usuarios
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/seguidores" className="nav-link">
              👤 Seguidores
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/reportes" className="nav-link"> {/* Cambiado de "/configuracion" a "/reportes" */}
              ⚙️ Reportes
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/seguir" className="nav-link">
              ➕ Seguir
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
