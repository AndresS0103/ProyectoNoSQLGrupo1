import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Sidebar.css';

const Sidebar = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3002/Usuarios');
      if (response.status === 200) {
        setUsuarios(response.data);
        setUsuarioActivo(response.data[0]); // Establecer el primer usuario como activo por defecto
        setLoading(false);
      }
    } catch (err) {
      setError('Error al obtener los usuarios: ' + err.message);
      setLoading(false);
      console.error('Error al obtener los usuarios:', err.message);
    }
  };

  const handleChangeUser = (event) => {
    const selectedUser = usuarios.find(user => user.usuario_id === event.target.value);
    setUsuarioActivo(selectedUser);
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
      <div className="user-selector mb-4">
        <select 
          value={usuarioActivo?.usuario_id || ''} 
          onChange={handleChangeUser}
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="profile-header">
          <img
            src={usuarioActivo?.foto_perfil || "/api/placeholder/64/64"}
            alt="Foto de perfil"
            className="rounded-full w-16 h-16 mb-3"
          />
          <h2 className="font-semibold text-lg">{usuarioActivo?.nombre || 'Usuario'}</h2>
          <p className="text-gray-500 text-sm">@{usuarioActivo?.usuario_id || 'username'}</p>
          {usuarioActivo?.biografia && (
            <p className="text-gray-600 text-sm mt-2">{usuarioActivo.biografia}</p>
          )}
        </div>
        
        <div className="stats flex justify-between my-4 text-center">
          <div>
            <div className="font-bold">{usuarioActivo?.seguidores?.length || 0}</div>
            <div className="text-gray-500 text-sm">Seguidores</div>
          </div>
          <div>
            <div className="font-bold">{usuarioActivo?.seguidos?.length || 0}</div>
            <div className="text-gray-500 text-sm">Siguiendo</div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="navigation-menu mt-6">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              🏠
              <span>Inicio</span>
            </Link>
          </li>
          <li>
            <Link to="/usuarios" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              👥
              <span>Usuarios</span>
            </Link>
          </li>
          <li>
            <Link to="/guardados" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              🔖
              <span>Mensajes</span>
            </Link>
          </li>
          <li>
            <Link to="/perfil" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              👤
              <span>Seguidores</span>
            </Link>
          </li>
          <li>
            <Link to="/configuracion" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              ⚙️
              <span>Reportes</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;