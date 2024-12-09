import { useState } from 'react';
import axios from 'axios';
import '../css/PostCard.css';

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.me_gusta.length);
  const [liked, setLiked] = useState(post.me_gusta.includes('currentUserId')); // Reemplaza 'currentUserId' con el ID del usuario actual.
  const [comments, setComments] = useState([]); // Lista de comentarios
  const [showComments, setShowComments] = useState(false); // Mostrar u ocultar comentarios
  const [newComment, setNewComment] = useState(''); // Nuevo comentario

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.put(`http://localhost:3004/Reacciones/${post.publicacion_id}/remove-like`, {
          usuario_id: 'currentUserId', // Reemplaza con el ID del usuario actual
        });
        setLikes(likes - 1);
      } else {
        await axios.put(`http://localhost:3004/Reacciones/${post.publicacion_id}/add-like`, {
          usuario_id: 'currentUserId', // Reemplaza con el ID del usuario actual
        });
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error al actualizar el "Me gusta":', error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3005/Comentarios?publicacion_id=${post.publicacion_id}`);
      if (response.status === 200) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error al obtener comentarios:', error.message);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments(); // Cargar comentarios al abrir
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    try {
      const comentarioId = `comentario_${Date.now()}`; // Generar un ID único
      const newCommentData = {
        comentario_id: comentarioId,
        publicacion_id: post.publicacion_id,
        usuario_id: 'currentUserId', // Reemplaza con el ID del usuario actual
        contenido: newComment,
        fecha_comentario: new Date(),
      };
      await axios.post('http://localhost:3005/Comentarios', newCommentData);
      setComments([...comments, newCommentData]); // Actualizar la lista localmente
      setNewComment(''); // Limpiar el campo de texto
    } catch (error) {
      console.error('Error al agregar comentario:', error.message);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={`https://via.placeholder.com/50?text=U`}
          alt="User"
          className="user-avatar"
        />
        <span className="user-id">{post.usuario_id}</span>
      </div>
      {post.imagen && (
        <div className="post-image">
          <img src={post.imagen} alt="Publicación" />
        </div>
      )}
      <div className="post-content">
        <p>{post.contenido}</p>
        <p className="post-date">
          {new Date(post.fecha_publicacion).toLocaleString()}
        </p>
      </div>
      <div className="post-actions">
        <button className="like-button" onClick={handleLike}>
          ❤️ {likes}
        </button>
        <button className="comment-button" onClick={handleToggleComments}>
          💬 {comments.length}
        </button>
      </div>
      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.comentario_id} className="comment-item">
                <strong>{comment.usuario_id}:</strong> {comment.contenido}
                <span className="comment-date">
                  {new Date(comment.fecha_comentario).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
            ></textarea>
            <button onClick={handleAddComment}>Agregar Comentario</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
