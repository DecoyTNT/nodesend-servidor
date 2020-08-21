const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlace = require('../models/Enlace');

const subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits: { fileSize: req.usuario ? 1024 * 1024 * 5 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, __dirname + '/../uploads')
            },
            filename: (req, file, callback) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                callback(null, `${shortid.generate()}${extension}`);
            }
            // fileFilter: (req, file, callback) => {
            //     if (file.mimetype === "aplication/pdf") {
            //         return callback(null, true);
            //     }
            // }
        })
    }

    const upload = multer(configuracionMulter).single('archivo');

    upload(req, res, async error => {

        if (!error) {
            res.json({
                archivo: req.file.filename
            });
        } else {
            console.log(error);
            return next();
        }
    });

}

const eliminarArchivo = async (req, res) => {

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
    } catch (error) {
        console.log(error);
    }
}

const descargar = async (req, res, next) => {

    const { archivo } = req.params;
    const enlace = await Enlace.findOne({ nombre: archivo });
    console.log(archivo);
    console.log(enlace);

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);

    const { descargas, nombre } = enlace;

    if (descargas === 1) {

        req.archivo = nombre;

        await Enlace.findOneAndRemove(enlace.id)

        // Pasar al otro controlador
        next();

    } else {
        enlace.descargas--;
        enlace.save();
    }
}

module.exports = {
    subirArchivo,
    eliminarArchivo,
    descargar
}