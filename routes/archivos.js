const express = require('express');
const archivosController = require('../controllers/archivosController');
const router = express.Router();
const auth = require('../middlewares/auth');

router.post('/',
    auth,
    archivosController.subirArchivo
);

router.get('/:archivo',
    archivosController.descargar,
    archivosController.eliminarArchivo
)

module.exports = router;