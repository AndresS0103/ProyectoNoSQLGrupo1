import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import '../css/PostCard.css';
import userPlaceholder from '../img/user-placeholder.png';

function PostCard({ post, usuarioActivo }) {
	const [likes, setLikes] = useState(post.me_gusta.length);
	const [liked, setLiked] = useState(post.me_gusta.includes(usuarioActivo?.usuario_id));
	const [comments, setComments] = useState([]);
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState('');
	const [editingComment, setEditingComment] = useState(null);
	const [editingContent, setEditingContent] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [showReactions, setShowReactions] = useState(false);
	const navigate = useNavigate();
	const [hoverTimeout, setHoverTimeout] = useState(null);
	const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState(null);

	const handleMouseEnter = () => {
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
			setHoverTimeout(null);
		}
		setShowReactions(true);
	};

	const handleMouseLeave = () => {
		const timeout = setTimeout(() => {
			setShowReactions(false);
		}, 500); 
		setHoverTimeout(timeout);
	};

	useEffect(() => {
		fetchComments();
	}, []);

	const handleLike = async (reactionType) => {
		if (!usuarioActivo) {
			alert('Selecciona un usuario para reaccionar.');
			return;
		}
	
		try {
			if (liked) {
				const response = await axios.put(
					`http://localhost:3000/Publicaciones/${post.publicacion_id}/remove-like`,
					{ usuario_id: usuarioActivo.usuario_id }
				);
				setLikes(response.data.me_gusta.length); // Actualiza el estado local con la respuesta del backend
			} else {
				const response = await axios.put(
					`http://localhost:3000/Publicaciones/${post.publicacion_id}/add-like`,
					{ usuario_id: usuarioActivo.usuario_id, tipo_reaccion: reactionType }
				);
				setLikes(response.data.me_gusta.length); // Actualiza el estado local con la respuesta del backend
			}
			setLiked(!liked); // Alterna el estado de "me gusta"
		} catch (error) {
			console.error('Error al actualizar "Me gusta":', error.message);
		}
	};

	const fetchComments = async () => {
		try {
			const response = await axios.get(`http://localhost:3000/Comentarios?publicacion_id=${post.publicacion_id}`);
			if (response.status === 200) {
				setComments(response.data);
			}
		} catch (error) {
			console.error('Error al obtener comentarios:', error.message);
		}
	};

	const handleToggleComments = () => {
		setShowComments(!showComments);
		setShowModal(true);
	};

	const handleAddComment = async () => {
		if (!usuarioActivo) {
			alert('Selecciona un usuario para comentar.');
			return;
		}

		try {
			const comentarioId = `comentario_${Date.now()}`;
			const newCommentData = {
				comentario_id: comentarioId,
				publicacion_id: post.publicacion_id,
				usuario_id: usuarioActivo.usuario_id,
				contenido: newComment,
				fecha_comentario: new Date(),
			};
			await axios.post('http://localhost:3000/Comentarios', newCommentData);
			setComments([...comments, newCommentData]);
			setNewComment('');
		} catch (error) {
			console.error('Error al agregar comentario:', error.message);
		}
	};

	const handleEditComment = async () => {
		if (!editingComment) return;

		try {
			const updatedComment = {
				...editingComment,
				contenido: editingContent,
			};
			await axios.put(`http://localhost:3000/Comentarios/${editingComment.comentario_id}`, updatedComment);
			setComments(comments.map((comment) => (comment.comentario_id === editingComment.comentario_id ? updatedComment : comment)));
			setEditingComment(null);
			setEditingContent('');
		} catch (error) {
			console.error('Error al editar comentario:', error.message);
		}
	};

	const handleDeleteComment = async (comentarioId) => {
		try {
			await axios.delete(`http://localhost:3000/Comentarios/${comentarioId}`);
			setComments(comments.filter((comment) => comment.comentario_id !== comentarioId));
		} catch (error) {
			console.error('Error al eliminar comentario:', error.message);
		}
	};

	const startEditing = (comment) => {
		setEditingComment(comment);
		setEditingContent(comment.contenido);
	};

	const cancelEditing = () => {
		setEditingComment(null);
		setEditingContent('');
	};

	const handleReport = (tipo, comentarioId = null) => {
		if (!usuarioActivo) {
			alert('Selecciona un usuario para reportar.');
			return;
		}

		navigate('/reportar', {
			state: {
				tipo,
				publicacionId: post.publicacion_id,
				comentarioId,
				usuarioReportante: usuarioActivo.usuario_id,
			},
		});
	};

	const handleCloseModal = () => setShowModal(false);
    const handleCloseProfileModal = () => setShowProfileModal(false);

	const handleShowProfile = async (usuarioId) => {
        try {
            const response = await axios.get(`http://localhost:3000/Usuarios/${usuarioId}`);
            if (response.status === 200) {
                setProfileData(response.data);
                setShowProfileModal(true);
            }
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error.message);
        }
    };

	return (
		<div className="post-card">
			<div className="post-header">
				<img src={userPlaceholder} alt="User" className="user-avatar" />
				<span className="user-id">{post.usuario_id}</span>
				<DropdownButton id="dropdown-basic-button" title="⋮" variant="outline-secondary" className="ms-auto">
					<Dropdown.Item onClick={() => handleReport('publicacion')}>🚩 Reportar Publicación</Dropdown.Item>
					<Dropdown.Item onClick={() => handleShowProfile(post.usuario_id)}>👤 Ver Información del Perfil</Dropdown.Item>
					<Dropdown.Item onClick={() => window.open(`https://wa.me/?text=${window.location.href}`, '_blank')}>
						📲 Compartir en WhatsApp
					</Dropdown.Item>
					<Dropdown.Item onClick={() => navigator.clipboard.writeText(window.location.href)}>🔗 Copiar Enlace</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item onClick={() => {}}>❌ Cancelar</Dropdown.Item>
				</DropdownButton>
			</div>
			{post.imagen && (
				<div className="post-image">
					<img src={post.imagen} alt="Publicación" />
				</div>
			)}
			<div className="post-content">
				<p>
					<span className="user-id">{post.usuario_id}:</span> {post.contenido}
				</p>
				<p className="post-date">{new Date(post.fecha_publicacion).toLocaleString()}</p>
			</div>
			<div className="post-actions">
				<div className="like-button-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
					<Button variant={liked ? 'primary' : 'outline-primary'} onClick={() => handleLike('like')}>
						{liked ? '❤️ Liked' : '❤️ Like'} {likes}
					</Button>
					<div className={`reactions-bar ${showReactions ? 'show' : ''}`}>
						<Button onClick={() => handleLike('me encanta')}>😍</Button>
						<Button onClick={() => handleLike('me divierte')}>😂</Button>
						<Button onClick={() => handleLike('me asombra')}>😮</Button>
						<Button onClick={() => handleLike('me entristece')}>😢</Button>
						<Button onClick={() => handleLike('me enoja')}>😡</Button>
					</div>
				</div>
				<Button variant="outline-primary" className="comment-button" onClick={handleToggleComments}>
					💬 {comments.length} Comentarios
				</Button>
			</div>

			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Comentarios</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						{comments.map((comment) => (
							<div key={comment.comentario_id} className="comment-item">
								{editingComment?.comentario_id === comment.comentario_id ? (
									<div>
										<textarea
											value={editingContent}
											onChange={(e) => setEditingContent(e.target.value)}
											className="form-control mb-2"
										></textarea>
										<Button variant="primary" className='me-2' onClick={handleEditComment}>
											Actualizar
										</Button>
										<Button variant="danger" onClick={cancelEditing}>
											Cancelar
										</Button>
									</div>
								) : (
									<>
										<strong>{comment.usuario_id}:</strong> {comment.contenido}
										<span className="comment-date">{new Date(comment.fecha_comentario).toLocaleString()}</span>
										{usuarioActivo?.usuario_id === comment.usuario_id ? (
											<div>
												<Button variant="outline-primary" className="me-2" onClick={() => startEditing(comment)}>
													✏️
												</Button>
												<Button variant="outline-danger" onClick={() => handleDeleteComment(comment.comentario_id)}>
													🗑️
												</Button>
											</div>
										) : (
											<Button
												variant="outline-danger"
												className="btn-sm report-button"
												onClick={() => handleReport('comentario', comment.comentario_id)}
											>
												🚩 Reportar Comentario
											</Button>
										)}
									</>
								)}
							</div>
						))}
					</div>
					<div className="mt-3">
						<textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Escribe un comentario..."
							className="form-control"
						></textarea>
						<Button className="btn-sm btn-success mt-2" onClick={handleAddComment}>
							Agregar Comentario
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			<Modal show={showProfileModal} onHide={handleCloseProfileModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Información del Perfil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {profileData ? (
                        <div>
                            <img src={profileData.foto_perfil || userPlaceholder} alt="Perfil" className="user-avatar mb-3" />
                            <p><strong>Nombre:</strong> {profileData.nombre}</p>
                            <p><strong>Email:</strong> {profileData.email}</p>
                            <p><strong>Biografía:</strong> {profileData.biografia}</p>
                            <p><strong>Seguidores:</strong> {profileData.seguidores.length}</p>
                            <p><strong>Siguiendo:</strong> {profileData.seguidos.length}</p>
                        </div>
                    ) : (
                        <p>Cargando información del perfil...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseProfileModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
		</div>
	);
}

export default PostCard;
