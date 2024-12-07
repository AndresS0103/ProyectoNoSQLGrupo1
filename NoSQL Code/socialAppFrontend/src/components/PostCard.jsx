import '../css/PostCard.css';

function PostCard({ post }) {
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
        <button className="like-button">❤️ {post.me_gusta.length}</button>
        <button className="comment-button">💬 {post.comentarios.length}</button>
      </div>
    </div>
  );
}

export default PostCard;
