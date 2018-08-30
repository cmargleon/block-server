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

router.post('/signup', async function(req, res, next) {
    console.log(req.body)
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
                        message: "User Created"
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        }
    });
});

module.exports = router;
