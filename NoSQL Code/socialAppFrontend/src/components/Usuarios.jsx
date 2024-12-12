import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Accordion, Card } from 'react-bootstrap';
import userPlaceholder from '../img/user-placeholder.png';
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
  const [editForm, setEditForm] = useState({
    usuario_id: '',
    nombre: '',
    email: '',
    biografia: '',
    foto_perfil: '',
    seguidores: [],
    seguidos: [],
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Usuarios');
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:3000/Usuarios', form);
      fetchUsers();
      resetForm();
    } catch (err) {
      console.error('Error al crear usuario:', err.message);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/Usuarios/${editForm.usuario_id}`, editForm);
      fetchUsers();
      setShowEditModal(false);
    } catch (err) {
      console.error('Error al editar usuario:', err.message);
    }
  };

  const prepareEdit = (user) => {
    setEditForm(user);
    setShowEditModal(true);
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/Usuarios/${userToDelete.usuario_id}`);
      fetchUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
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
      <h2>Crear Usuario</h2>
      <div className="form-container">
        <input
          type="text"
          placeholder="ID Usuario"
          name="usuario_id"
          value={form.usuario_id}
          onChange={handleChange}
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
        <Button variant="success" onClick={handleCreate}>
          Crear Usuario
        </Button>
      </div>
      <hr className="divider" />
      <div className="users-container">
        {data.map((user) => (
          <div key={user.usuario_id} className="user-card">
            <img src={user?.foto_perfil ? user.foto_perfil : userPlaceholder } alt="Perfil" className="user-image" />
            <p>
              <strong>Nombre:</strong> {user.nombre}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Biografía:</strong> {user.biografia}
            </p>
            <div className="d-flex justify-content-center actions">
              <Button variant="info" className='btn-sm text-white' onClick={() => prepareEdit(user)}>
                Editar
              </Button>
              <Button variant="danger"className='btn-sm' onClick={() => confirmDelete(user)}>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsuarioId">
              <Form.Label>ID Usuario</Form.Label>
              <Form.Control
                type="text"
                className="mb-2"
                name="usuario_id"
                value={editForm.usuario_id}
                onChange={handleEditChange}
                disabled
              />
            </Form.Group>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                className="mb-2"
                name="nombre"
                value={editForm.nombre}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                className="mb-2"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formBiografia">
              <Form.Label>Biografía</Form.Label>
              <Form.Control
                as="textarea"
                className="mb-2"
                name="biografia"
                value={editForm.biografia}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formFotoPerfil">
              <Form.Label>Foto de Perfil URL</Form.Label>
              <Form.Control
                type="text"
                className="mb-2"
                name="foto_perfil"
                value={editForm.foto_perfil}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleEdit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.nombre}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Usuarios;