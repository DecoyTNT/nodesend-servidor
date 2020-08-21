const express = require('express');
const enlaceController = require('../controllers/enlaceController');
// const archivosController = require('../controllers/archivosController');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth');

router.post('/',
    [
        check('nombre', 'Sube un archivo').not().isEmpty(),
        check('nombre_original', 'Sube un archivo').not().isEmpty()
    ],
    auth,
    enlaceController.nuevoEnlace
)

router.post('/:url',
    enlaceController.verificarPassword,
    enlaceController.obtenerEnlace
)

router.get('/',
    enlaceController.todosEnlaces
)

router.get('/:url',
    enlaceController.tienePassword,
    enlaceController.obtenerEnlace
)

module.exports = router;