const University = require('../models/university');
const uuidv1 = require('uuid/v1');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.university_signup = (req, res, next) => {
    University.find({ email: req.body.email })
        .exec()
        .then(university => {
            console.log(university.length)
            if(university.length >= 1) {
                console.log("registrado")
                return res.status(422).json({
                    message: "Este e-mail ya se encuentra registrado"
                });
            } else {
                console.log("registrando")
                bcrypt.hash(req.body.password, 10, (err, hash)=> {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const university = new University({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            shortName: req.body.shortName,
                            fullName: req.body.fullName,
                            cardId: uuidv1(),
                            universityRut: req.body.universityRut
                            });
                            university
                            .save()
                            .then(result => {
                                return res.status(201).json({
                                    message: "Usuario creado"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}

exports.university_login = (req, res, next) => {
    University.find({email: req.body.email})
    .exec()
    .then(university => {
        if (university.length < 1) {
            return res.status(401).json({
                message: "La autentificación falló"
            });
        }
        bcrypt.compare(req.body.password, university[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'La autentificación falló'
                });
            }
            if (result) {
                let token = jwt.sign({
                    email: university[0].email,
                    universityId: university[0]._id
                }, process.env.JWT_KEY,
                {
                    expiresIn: "12h"
                })
                return res.status(200).header('x-auth', token).json({
                    message: 'Autentificación exitosa'
                });
            }
            res.status(401).json({
                message: 'La autentifación falló'
            });
        });
    })
    .catch()
}

exports.university_delete = (req, res, next) => {
    University.remove({ _id : req.params.universityId})
    .exec()
    .then(result=> {
        return res.status(200).json({
            message: "Usuario eliminado"
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}