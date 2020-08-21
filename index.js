const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

const app = express();

conectarDB();

const opcionesCors = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(opcionesCors));

const port = process.env.PORT || 4000;

app.use(express.json());

// habilitar carpeta pública
app.use(express.static('uploads'));

// Rutas de la app
app.use('/api', require('./routes/index.js'));

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`)
});