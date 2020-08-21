const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth');


router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password es requerido').not().isEmpty()
    ],
    authController.autenticarUsuario
);

router.get('/',
    auth,
    authController.usuarioAutenticado
)

module.exports = router;