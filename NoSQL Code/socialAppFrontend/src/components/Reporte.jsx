import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import '../css/Reporte.css';

function Reporte() {
  const location = useLocation();
  const navigate = useNavigate();
  const [razon, setRazon] = useState('');

  // Datos pasados desde `PostCard`
  const { tipo, publicacionId, comentarioId, usuarioReportante } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const reporteId = `reporte_${Date.now()}`; // Generar un ID único para el reporte
      const newReporte = {
        reporte_id: reporteId,
        tipo,
        publicacion_id: publicacionId,
        comentario_id: comentarioId || null,
        usuario_reportante: usuarioReportante,
        razon,
        fecha_reporte: new Date(),
      };

      // Enviar el reporte al backend
      await axios.post('http://localhost:3006/Reportes', newReporte);
      alert('Reporte enviado con éxito');
      navigate('/'); // Redirigir al usuario a la página principal
    } catch (error) {
      console.error('Error al enviar reporte:', error.message);
      alert('Error al enviar el reporte. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="reporte-container">
      <h2>
        Reportar {tipo === 'publicacion' ? 'Publicación' : 'Comentario'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="razon">Razón del Reporte:</label>
          <textarea
            id="razon"
            value={razon}
            onChange={(e) => setRazon(e.target.value)}
            placeholder="Describe la razón del reporte"
            required
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">Enviar Reporte</button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Reporte;
