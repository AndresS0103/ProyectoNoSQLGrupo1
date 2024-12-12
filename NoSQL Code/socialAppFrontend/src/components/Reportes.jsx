import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Reportes.css';

function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReportes();
  }, []);

  const fetchReportes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/reportes');
      if (response.status === 200) {
        setReportes(response.data);
        setLoading(false);
      }
    } catch (err) {
      setError('Error al obtener los reportes: ' + err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (reporteId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/reportes/${reporteId}`);
      if (response.status === 200) {
        alert('Reporte eliminado exitosamente.');
        // Actualizar la lista de reportes después de eliminar
        setReportes((prevReportes) =>
          prevReportes.filter((reporte) => reporte.reporte_id !== reporteId)
        );
      }
    } catch (err) {
      alert('Error al eliminar el reporte: ' + err.message);
    }
  };

  const filteredReportes = reportes.filter((reporte) =>
    reporte.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reporte.razon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reporte.usuario_reportante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="reportes-container">Cargando reportes...</div>;
  }

  if (error) {
    return <div className="reportes-container">Error: {error}</div>;
  }

  return (
    <div className="reportes-container">
      <h2>Lista de Reportes</h2>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por tipo, razón o usuario"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredReportes.length === 0 ? (
        <p className="no-reportes">
          {searchTerm ? 'No se encontraron reportes.' : 'No hay reportes disponibles.'}
        </p>
      ) : (
        <table className="reportes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>ID Publicación</th>
              <th>ID Comentario</th>
              <th>Usuario Reportante</th>
              <th>Razón</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReportes.map((reporte) => (
              <tr key={reporte.reporte_id}>
                <td>{reporte.reporte_id}</td>
                <td>{reporte.tipo}</td>
                <td>{reporte.publicacion_id || '-'}</td>
                <td>{reporte.comentario_id || '-'}</td>
                <td>{reporte.usuario_reportante}</td>
                <td>{reporte.razon}</td>
                <td>{new Date(reporte.fecha_reporte).toLocaleDateString()}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(reporte.reporte_id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Reportes;
