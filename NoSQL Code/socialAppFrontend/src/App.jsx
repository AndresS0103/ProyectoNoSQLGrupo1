import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Publicaciones from './components/Publicaciones';
import Usuarios from './components/Usuarios';
import Sidebar from './components/Sidebar';
import './css/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Sidebar />
          <main className="main-feed">
            <Routes>
              <Route path="/" element={<Publicaciones />} />
              <Route path="/usuarios" element={<Usuarios />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;