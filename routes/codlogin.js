const express = require("express");
const conexion = require("../config/conexion");
const link = require("../config/link");
const { compare } = require("bcrypt");
const router = express.Router();

router.post("/codlogin", function(req, res) {
    const cor = req.body.correo;
    const psw = req.body.psw;

    const validar = 'SELECT * FROM user_data WHERE correo = ?';
    conexion.query(validar, [cor], async function (error, rows) {
        let mensaje;
        if (error) {
            console.log("Error en la consulta del correo: ", error);
            return res.status(500).send("Error en el servidor");
        }
        if (rows.length < 1) {
            mensaje = 'El correo no existe, por favor regístrate';
            console.log('el correo no existe');
            res.render('registrar', { mensaje, link });
        } else {
            const user = rows[0];
            const match = await compare(psw, user.password);
            if (!match) {
                mensaje = 'Contraseña incorrecta';
                console.log('contraseña incorrecta');
                res.render('index', { mensaje, link });
            } else {
                if (!req.session) {
                    console.log("La sesión no está configurada correctamente");
                    return res.status(500).send("Error en el servidor: sesión no configurada");
                }

                req.session.login = true;
                req.session.correolog = user.correo;
                req.session.idelog = user.id;
                req.session.nom = user.nombre;
                req.session.gen = user.genero;
                req.session.dir = user.direccion;
                req.session.ciud = user.ciudad;
                req.session.est = user.estado;
                req.session.c = user.cp;

                console.log(req.session);
                res.render('index', { datos: req.session, link });
            }
        }
    });
});

module.exports = router;
