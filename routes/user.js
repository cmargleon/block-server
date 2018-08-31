var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var bcrypt = require('bcrypt')

router.get('/', function (req, res, next) {
    res.send("ok")
    /*
    User.findOne({}, function(err, doc) {
        if (err) {
            return res.send('Error!');
        }
        res.render('node', {email: doc.email});
    });
    */
});

router.post('/signup', async (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.lenght >= 1) {
                return res.status(422).json({
                    message: "Este e-mail ya se encuentra registrado"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash)=> {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
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
});

router.delete('/userid', (req, res, next) => {
    User.remove({ _id : req.params.id})
    .exec()
    .then(res => {
        return res.status(200).json({
            message: "Usuario eliminado"
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
})

module.exports = router;
