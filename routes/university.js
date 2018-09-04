const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const universityController = require('../controllers/university');
const userComposer = require('../composer-functions/university');
const universityComposer = require('./university2');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const AdminConnection = require('composer-admin').AdminConnection;
const log4js = require('log4js');

router.get('/', function (req, res, next) {
    res.send("ok")
});

router.post('/', async function (req, res, next) {
    logger.info('Empezando función');
    try {
        logger.info('Dentro try');
        //connect as admin
        businessNetworkConnection = new BusinessNetworkConnection();
        await businessNetworkConnection.connect('admin@degree');
        logger.info('Dp de business connection');
        //get the factory for the business network
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        logger.info('dp de factory');
        //create university participant
        const university = factory.newResource(namespace, 'University', universityRut);
        university.shortName = shortName;
        university.fullName = fullName;
        university.email = email;
        logger.info('dp de new resource');
        //add university participant
        const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.University');
        await participantRegistry.add(university);
        logger.info('dp de add participant');
        //issue identity
        const identity = await businessNetworkConnection.issueIdentity(namespace + '.University#' + universityRut, cardId);
        logger.info('dp de issue identity');
        //import card for identity
        await importCardForIdentity(cardId, identity);
        logger.info('dp de import card');
        //disconnect
        await businessNetworkConnection.disconnect('admin@degree');
     
        return res.send(200).json({
            message: "success"
        });
     
       } catch (err) {
        res.status(500).json({
            message: "something went wrong",
            error: err
        })
       }
});

router.post('/signup', universityController.university_signup);

router.post('/login', universityController.university_login);

router.delete('/:universityId', universityController.university_delete);

module.exports = router;
