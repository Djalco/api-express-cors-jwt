const express = require('express');
const messagesController = require("../controllers/messagesController");

function buildRoutes(){
    let router = express.Router();

    router.route('/messages/').get(messagesController.getAll);
    router.route('/messages/').post(messagesController.add);

    return router;
}

exports.router=buildRoutes();