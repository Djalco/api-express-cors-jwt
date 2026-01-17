const express = require('express');
const profsController = require('../controllers/profsController');

function buildRoutes(){
    let router = express.Router();

    router.route('/profs').get(profsController.getAll);
    router.route('/profs/:id').get(profsController.getById);
    router.route('/profs').post(profsController.add);
    router.route('/profs/:id').delete(profsController.delete);
    router.route('/profs/:id').put(profsController.update);

    // Routes pour gérer la relation N:N avec classes
    router.route('/profs/:id/classes').post(profsController.assignClasses);
    router.route('/profs/:id/classes').get(profsController.getClasses);

    router.route('/profs/auth').post(profsController.login);
    return router;
}

exports.router = buildRoutes(); 

