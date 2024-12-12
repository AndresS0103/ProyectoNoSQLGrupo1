import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Publicaciones from './components/Publicaciones';
import Usuarios from './components/Usuarios';
import Sidebar from './components/Sidebar';
import Reporte from './components/Reporte'; 
import Seguidores from './components/Seguidores';
import './css/App.css';

function App() {
  // Estado para el usuario activo
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  return (
    <Router>
      <div className="app-container">
        {/* <Navbar /> */}
        <div className="content">
          <Sidebar setUsuarioActivo={setUsuarioActivo} />
          <main className="main-feed">
            <Routes>
              <Route path="/" element={<Publicaciones usuarioActivo={usuarioActivo} />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/reportar" element={<Reporte usuarioActivo={usuarioActivo} />} /> {}
              <Route path="/seguidores" element={<Seguidores usuarioActivo={usuarioActivo} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
