const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const universityController = require('../controllers/university');
const userComposer = require('../composer-functions/university');
const universityComposer = require('./university2')

router.get('/', function (req, res, next) {
    res.send("ok")
});

router.post('/', function (req, res, next) {
    universityComposer(req.body.cardId, req.body.universityRut, req.body.shortName, req.body.fullName, req.body.email)
    .then(result => {
        return res.status(200).json({
            message: "Usuario creado en la Blockchain"
        });
    })
    .catch(err => {
        return res.status(500).json({
            message: "Algo fue mal",
            error: err
        })
    })
});

router.post('/signup', universityController.university_signup);

router.post('/login', universityController.university_login);

router.delete('/:universityId', universityController.university_delete);

module.exports = router;
