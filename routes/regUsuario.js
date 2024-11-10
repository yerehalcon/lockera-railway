const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const conexion = require("../config/conexion");
const link = require("../config/link");
//const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post('/regUsuario', async (req, res) => {
    let nom = req.body.nombre;
    let cor = req.body.correo;
    let sex = req.body.genero;
    let dir = req.body.direccion;
    let ciu = req.body.ciudad;
    let est = req.body.estado;
    let cod = req.body.Cp;
    let psw = req.body.psw;
    
    try {
        //const hashedPsw = await bcrypt.hash(psw, saltRounds);
        const insertar = "INSERT INTO user_data (nombre, correo, genero, direccion, ciudad, estado, cp, password) VALUES (?,?,?,?,?,?,?,?)";
        conexion.query(insertar, [nom, cor, sex, dir, ciu, est, cod, psw], function (error) {
            if (error) {
                console.log("Error al intentar registrar usuario");
                return res.status(500).send("Error al realizar el registro");
            } else {
                console.log("Registro exitoso");
                let mensaje = "Usuario registrado exitosamente";
                res.render("index", {mensaje,link});
            }
        });
    } catch (error) {
        console.log("Error al registrar", error);
        res.status(500).send("Error en el servidor");
    }
}
);

module.exports = router;
