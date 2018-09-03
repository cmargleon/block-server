const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const universityController = require('../controllers/university');


router.get('/', function (req, res, next) {
    res.send("ok")
});

router.post('/signup', universityController.university_signup);

router.post('/login', universityController.university_login);

router.delete('/:universityId', universityController.university_delete);

module.exports = router;
