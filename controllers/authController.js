const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const autenticarUsuario = async (req, res) => {

    try {
        const { email, password } = req.body;
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({
                msg: "email o password incorrectos"
            });
        }

        if (!bcrypt.compareSync(password, usuario.password)) {
            return res.status(401).json({
                msg: "email o password incorrectos"
            });
        }

        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        }, process.env.SECRETA, {
            expiresIn: '1h'
        });

        res.json({
            token,
            msg: 'Autenticado correctamente'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Hubo un error, usuario no autenticado"
        });
    }
}

const usuarioAutenticado = (req, res) => {
    if (req.usuario) {
        res.json({
            usuario: req.usuario
        });
    } else {
        return res.status(401).json({
            msg: 'No tienes acceso'
        })
    }
}

module.exports = {
    autenticarUsuario,
    usuarioAutenticado
}