import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';
import '../css/Publicaciones.css';

function Publicaciones() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3003/Publicaciones');
      if (response.status === 200) {
        setPosts(response.data);
      }
    } catch (err) {
      console.error('Error al obtener las publicaciones:', err.message);
    }
  };

  return (
    <div className="publicaciones-container">
      {posts.map((post) => (
        <PostCard key={post.publicacion_id} post={post} />
      ))}
    </div>
  );
}

export default Publicaciones;