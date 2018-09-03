const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const universityController = require('../controllers/university');
const userComposer = require('../composer-functions/university');

router.get('/', function (req, res, next) {
    res.send("ok")
});

router.post('/', function (req, res, next) {
    userComposer(req.body.cardId, req.body.universityRut, req.body.shortName, req.body.fullName, req.body.email)
    .then(result => {
        res.status(200).json({
            message: "Usuario creado en la Blockchain"
        });
    })
    .catch()
});

router.post('/signup', universityController.university_signup);

router.post('/login', universityController.university_login);

router.delete('/:universityId', universityController.university_delete);

module.exports = router;
