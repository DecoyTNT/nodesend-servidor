const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {

    // try {
    const authHeader = req.get('Authorization');

    if (authHeader) {
        // Obtener el Token 
        const token = authHeader.split(' ')[1];

        if (token) {
            // comprobar el JWT
            try {

                const usuario = jwt.verify(token, process.env.SECRETA);
                req.usuario = usuario;

            } catch (error) {
                console.log(error);
                console.log('JWT no valido');
            }
        }


    }


    return next();

}

module.exports = auth;