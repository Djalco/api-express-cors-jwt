const express = require('express');
const usersController = require('../controllers/usersController');

function buildRoutes(){
    let router = express.Router();

    router.route('/users').get(usersController.getAll);
    router.route('/users/:id').get(usersController.getById);
    router.route('/users').post(usersController.add);
    router.route('/users/:id').delete(usersController.delete);
    router.route('/users/:id').put(usersController.update);

    router.route('/auth').post(usersController.login);
    return router;
}

exports.router = buildRoutes(); 

