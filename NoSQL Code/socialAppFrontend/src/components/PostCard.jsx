import { useState } from 'react';
import axios from 'axios';
import '../css/PostCard.css';

function PostCard({ post, usuarioActivo }) {
  const [likes, setLikes] = useState(post.me_gusta.length);
  const [liked, setLiked] = useState(post.me_gusta.includes(usuarioActivo?.usuario_id));
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  //comentario que se va a editar
  const [editingComment, setEditingComment] = useState(null); 
  //contenido del comentario que se está editando
  const [editingContent, setEditingContent] = useState(''); 

  const handleLike = async () => {
    if (!usuarioActivo) {
      alert('Selecciona un usuario para reaccionar.');
      return;
    }

    try {
      if (liked) {
        await axios.put(`http://localhost:3004/Reacciones/${post.publicacion_id}/remove-like`, {
          usuario_id: usuarioActivo.usuario_id,
        });
        setLikes(likes - 1);
      } else {
        await axios.put(`http://localhost:3004/Reacciones/${post.publicacion_id}/add-like`, {
          usuario_id: usuarioActivo.usuario_id,
        });
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error al actualizar "Me gusta":', error.message);
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
      fetchComments();
    }
    setShowComments(!showComments);
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
      await axios.post('http://localhost:3005/Comentarios', newCommentData);
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
      await axios.put(`http://localhost:3005/Comentarios/${editingComment.comentario_id}`, updatedComment);
      setComments(
        comments.map((comment) =>
          comment.comentario_id === editingComment.comentario_id ? updatedComment : comment
        )
      );
      setEditingComment(null);
      setEditingContent('');
    } catch (error) {
      console.error('Error al editar comentario:', error.message);
    }
  };

  const handleDeleteComment = async (comentarioId) => {
    try {
      await axios.delete(`http://localhost:3005/Comentarios/${comentarioId}`);
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
                {editingComment?.comentario_id === comment.comentario_id ? (
                  <div>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    ></textarea>
                    <button onClick={handleEditComment}>Guardar</button>
                    <button onClick={cancelEditing}>Cancelar</button>
                  </div>
                ) : (
                  <>
                    <strong>{comment.usuario_id}:</strong> {comment.contenido}
                    <span className="comment-date">
                      {new Date(comment.fecha_comentario).toLocaleString()}
                    </span>
                    {usuarioActivo?.usuario_id === comment.usuario_id && (
                      <div className="comment-actions">
                        <button onClick={() => startEditing(comment)}>Editar</button>
                        <button onClick={() => handleDeleteComment(comment.comentario_id)}>Eliminar</button>
                      </div>
                    )}
                  </>
                )}
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
