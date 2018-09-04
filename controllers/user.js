const User = require('../models/user');
const uuidv1 = require('uuid/v1');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const log4js = require('log4js');

log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});

exports.user_signup = (req, res, next) => {
    logger.info('Cheese is Comté.');
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            console.log(user.length)
            if(user.length >= 1) {
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
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            cardId: uuidv1(),
                            graduateRut: req.body.graduateRut
                            });
                            user
                            .save()
                            .then(result => {
                                res.status(201).json({
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
        })
        .catch(err => {
            return res.status(200).json({
                error: err
            })
        })
}

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: "La autentificación falló"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'La autentificación falló'
                });
            }
            if (result) {
                let token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
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

exports.user_delete = (req, res, body) => {
    User.remove({ _id : req.params.userId})
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