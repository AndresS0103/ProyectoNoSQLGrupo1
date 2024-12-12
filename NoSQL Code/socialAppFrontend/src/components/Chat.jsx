import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Chat.css';

function Chat({ usuarioActivo }) {
  const [chats, setChats] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usuarioActivo) {
      fetchChats();
    }
  }, [usuarioActivo]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/mensajes`);
      if (response.status === 200) {
        const mensajes = response.data;
        const mensajesRelevantes = mensajes.filter(
          (mensaje) =>
            mensaje.emisor_id === usuarioActivo.usuario_id || 
            mensaje.receptor_id === usuarioActivo.usuario_id
        );

        const chatsAgrupados = {};
        mensajesRelevantes.forEach((mensaje) => {
          const otroUsuario =
            mensaje.emisor_id === usuarioActivo.usuario_id
              ? mensaje.receptor_id
              : mensaje.emisor_id;

          if (!chatsAgrupados[otroUsuario]) {
            chatsAgrupados[otroUsuario] = [];
          }
          chatsAgrupados[otroUsuario].push(mensaje);
        });

        const chatsArray = Object.entries(chatsAgrupados).map(([usuarioId, mensajes]) => ({
          usuarioId,
          mensajes,
        }));

        setChats(chatsArray);
      }
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los chats: ' + err.message);
      setLoading(false);
    }
  };

  const handleSeleccionarChat = (usuarioId) => {
    const chatSeleccionado = chats.find((chat) => chat.usuarioId === usuarioId);
    setMensajes(chatSeleccionado?.mensajes || []);
    setUsuarioSeleccionado(usuarioId);
  };

  if (!usuarioActivo) {
    return <div className="chat-container">Por favor selecciona un usuario activo.</div>;
  }

  if (loading) {
    return <div className="chat-container">Cargando chats...</div>;
  }

  if (error) {
    return <div className="chat-container">Error: {error}</div>;
  }

  return (
    <div className="chat-container">
      <h2>Chats</h2>
      <div className="chat-content">
        <div className="chat-list">
          {chats.length === 0 ? (
            <p className="no-chats">No tienes chats.</p>
          ) : (
            chats.map((chat) => {
              const ultimoMensaje = chat.mensajes[chat.mensajes.length - 1];
              return (
                <div
                  key={chat.usuarioId}
                  className={`chat-item ${
                    usuarioSeleccionado === chat.usuarioId ? 'active' : ''
                  }`}
                  onClick={() => handleSeleccionarChat(chat.usuarioId)}
                >
                  <div className="chat-item-content">
                    <div className="chat-item-header">
                      <strong>{chat.usuarioId}</strong>
                      <small>
                        {new Date(ultimoMensaje.fecha_envio).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="ultimo-mensaje">{ultimoMensaje.contenido}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mensajes-container">
          <h3>Chat con {usuarioSeleccionado || 'Selecciona un chat'}</h3>
          <div className="mensajes-lista">
            {!usuarioSeleccionado ? (
              <div className="no-chat-selected">
                Selecciona un chat para ver los mensajes
              </div>
            ) : mensajes.length === 0 ? (
              <div className="no-messages">No hay mensajes en este chat.</div>
            ) : (
              mensajes.map((mensaje) => (
                <div
                  key={mensaje.mensaje_id}
                  className={`mensaje-item ${
                    mensaje.emisor_id === usuarioActivo.usuario_id ? 'emisor' : 'receptor'
                  }`}
                >
                  <p>{mensaje.contenido}</p>
                  <span>{new Date(mensaje.fecha_envio).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;