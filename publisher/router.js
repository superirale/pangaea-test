const express = require('express');
const router = express.Router();
const { createTopic, publishMessage, validatorMiddleware } = require('./controllers/IndexController');


router.post('/publish/:topic', publishMessage );
router.post('/subscribe/:topic', validatorMiddleware('createTopic'), createTopic );

module.exports = router;