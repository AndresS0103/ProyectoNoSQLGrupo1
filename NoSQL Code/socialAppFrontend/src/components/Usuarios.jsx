import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Usuarios.css';

function Usuarios() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    usuario_id: '',
    nombre: '',
    email: '',
    biografia: '',
    foto_perfil: '',
    seguidores: [],
    seguidos: [],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3002/Usuarios');
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (err) {
      console.error('Error al obtener los usuarios:', err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:3002/Usuarios', form);
      fetchUsers();
      resetForm();
    } catch (err) {
      console.error('Error al crear usuario:', err.message);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:3002/Usuarios/${form.usuario_id}`, form);
      fetchUsers();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error('Error al editar usuario:', err.message);
    }
  };

  const prepareEdit = (user) => {
    setForm(user);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/Usuarios/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Error al eliminar usuario:', err.message);
    }
  };

  const resetForm = () => {
    setForm({
      usuario_id: '',
      nombre: '',
      email: '',
      biografia: '',
      foto_perfil: '',
      seguidores: [],
      seguidos: [],
    });
  };

  return (
    <div className="usuarios-container">
      <h2>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h2>
      <div className="form-container">
        <input
          type="text"
          placeholder="ID Usuario"
          name="usuario_id"
          value={form.usuario_id}
          onChange={handleChange}
          disabled={isEditing}
          className="input"
        />
        <input
          type="text"
          placeholder="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="input"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="input"
        />
        <textarea
          placeholder="Biografía"
          name="biografia"
          value={form.biografia}
          onChange={handleChange}
          className="textarea"
        ></textarea>
        <input
          type="text"
          placeholder="Foto de Perfil URL"
          name="foto_perfil"
          value={form.foto_perfil}
          onChange={handleChange}
          className="input"
        />
        {isEditing ? (
          <button onClick={handleEdit} className="button edit">
            Actualizar Usuario
          </button>
        ) : (
          <button onClick={handleCreate} className="button create">
            Crear Usuario
          </button>
        )}
      </div>
      <hr className="divider" />
      <div className="users-container">
        {data.map((user) => (
          <div key={user.usuario_id} className="user-card">
            <img src={user.foto_perfil} alt="Perfil" className="user-image" />
            <p>
              <strong>Nombre:</strong> {user.nombre}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Biografía:</strong> {user.biografia}
            </p>
            <div className="actions">
              <button onClick={() => prepareEdit(user)} className="button edit">
                Editar
              </button>
              <button
                onClick={() => handleDelete(user.usuario_id)}
                className="button delete"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Usuarios;
