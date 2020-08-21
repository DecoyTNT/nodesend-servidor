const Enlace = require("../models/Enlace");
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const nuevoEnlace = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    }

    // Crear un objeto de enlace
    const { nombre, nombre_original } = req.body;

    const enlace = new Enlace();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;

    // Si esta autenticado el usuario
    if (req.usuario) {
        const { password, descargas } = req.body;

        if (descargas) {
            enlace.descargas = descargas;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        enlace.autor = req.usuario.id;
    }

    try {
        // Guardar en la base de datos
        await enlace.save();
        res.json({
            msg: `${enlace.url}`
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Hubo un error'
        })
    }
}

const todosEnlaces = async (req, res) => {

    try {
        const enlaces = await Enlace.find().select('url -_id');
        res.json({ enlaces });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un error'
        })
    }

}

const tienePassword = async (req, res, next) => {

    // console.log(req.params.url);
    const { url } = req.params;

    // console.log(url);

    // Verificar si existe el enlace
    const enlace = await Enlace.findOne({ url });

    if (!enlace) {
        res.status(404).json({ msg: 'Ese Enlace no existe' });
        return next();
    }

    if (enlace.password) {
        return res.json({ password: true, enlace: enlace.url, archivo: enlace.nombre });
    }

    next();
}

const verificarPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;

    // Consultar por el enlace
    const enlace = await Enlace.findOne({ url });

    // Verificar el password
    if (bcrypt.compareSync(password, enlace.password)) {
        // Permitirle al usuario descargar el archivo
        next();
    } else {
        return res.status(401).json({ msg: 'Password Incorrecto' })
    }


}

const obtenerEnlace = async (req, res, next) => {

    const { url } = req.params

    try {
        const enlace = await Enlace.findOne({ url });
        if (!enlace) {
            res.status(404).json({
                msg: 'No se encontro'
            });
            return next();
        }

        res.json({
            archivo: enlace.nombre,
            password: false
        });

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hubo un error'
        })
    }

}

module.exports = {
    nuevoEnlace,
    todosEnlaces,
    obtenerEnlace,
    tienePassword,
    verificarPassword
}