import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import '../css/Notificaciones.css';

function Notificaciones({ usuarioActivo }) {
	const [notificaciones, setNotificaciones] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalMessage, setModalMessage] = useState('');

	useEffect(() => {
		if (usuarioActivo) {
			fetchNotificaciones(usuarioActivo.usuario_id);
		}
	}, [usuarioActivo]);

	const fetchNotificaciones = async (usuarioId) => {
		try {
			const response = await axios.get(`http://localhost:3000/notificaciones?usuario_id=${usuarioId}`);
			if (response.status === 200) {
				setNotificaciones(response.data);
				setLoading(false);
			}
		} catch (err) {
			setError('Error al obtener las notificaciones: ' + err.message);
			setLoading(false);
		}
	};

	const handleDeleteNotification = async (notificationId) => {
		try {
			await axios.delete(`http://localhost:3000/notificaciones/${notificationId}`);
			setModalMessage('Notificación eliminada exitosamente.');
			setShowModal(true);
		} catch (error) {
			console.error('Error al eliminar la notificación:', error.message);
		}
	};

	const handleCloseModal = () => setShowModal(false);

	if (!usuarioActivo) {
		return <div className="notificaciones-container">Por favor selecciona un usuario.</div>;
	}

	if (loading) {
		return <div className="notificaciones-container">Cargando notificaciones...</div>;
	}

	if (error) {
		return <div className="notificaciones-container">Error: {error}</div>;
	}

	return (
		<div className="notificaciones-container">
			<h2>Notificaciones</h2>
			{notificaciones.length === 0 ? (
				<p className="no-notificaciones">No tienes notificaciones.</p>
			) : (
				<ul className="notificaciones-list">
					{notificaciones.map((notificacion) => (
						<li key={notificacion.notificacion_id} className="notificacion-item">
							<p>
								<strong>Tipo:</strong> {notificacion.tipo}
							</p>
							<p>
								<strong>Referencia:</strong> {notificacion.referencia_id || 'N/A'}
							</p>
							<p>
								<strong>Leído:</strong> {notificacion.leido ? 'Sí' : 'No'}
							</p>
							<p>
								<strong>Fecha:</strong> {new Date(notificacion.fecha_notificacion).toLocaleDateString()}
							</p>
							<button className="delete-button" onClick={() => handleDeleteNotification(notificacion.notificacion_id)}>
								Eliminar
							</button>
						</li>
					))}
				</ul>
			)}
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Confirmación</Modal.Title>
				</Modal.Header>
				<Modal.Body>{modalMessage}</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleCloseModal}>
						Cerrar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default Notificaciones;
