import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import comentariosRoutes from './routes/comentariosRoutes.js';
import mensajesRoutes from './routes/mensajesRoutes.js';
import notificacionesRoutes from './routes/notificacionesRoutes.js';
import publicacionesRoutes from './routes/publicacionesRoutes.js';
import reaccionesRoutes from './routes/reaccionesRoutes.js';
import reportesRoutes from './routes/reportesRoutes.js';
import seguidoresRoutes from './routes/seguidoresRoutes.js';
import usuariosRoutes from './routes/usuariosRoutes.js';

const app = express();
const port = process.env.PORT || 3000;
const hostname = 'http://localhost';

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
	res.send('Hello World!');
});
app.use('/Comentarios', comentariosRoutes);
app.use('/Mensajes', mensajesRoutes);
app.use('/Notificaciones', notificacionesRoutes);
app.use('/Publicaciones', publicacionesRoutes);
app.use('/Reacciones', reaccionesRoutes);
app.use('/Reportes', reportesRoutes);
app.use('/Seguidores', seguidoresRoutes);
app.use('/Usuarios', usuariosRoutes);

// Database connection
connectDB();

// Start server
app.listen(port, () => {
	console.log(`Server running on ${hostname}:${port}`);
});
