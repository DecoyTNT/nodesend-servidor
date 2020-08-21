const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const nuevoUsuario = async (req, res) => {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    }

    try {
        const { email, password } = req.body;
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                msg: "El usuario ya existe"
            });
        }
        usuario = new Usuario(req.body);

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        await usuario.save();
        res.json({
            msg: "Usuario creado correctamente"
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            msg: "Hubo un error, usuario no creado"
        });
    }

}

module.exports = {
    nuevoUsuario
}