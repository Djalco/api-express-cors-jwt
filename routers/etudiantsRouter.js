const express = require('express');
const etudiantsController = require('../controllers/etudiantController');

function buildRoutes(){
    let router = express.Router();

    router.route('/etudiants').get(etudiantsController.getAll);
    router.route('/etudiants/:id').get(etudiantsController.getById);
    router.route('/etudiants').post(etudiantsController.add);
    router.route('/etudiants/:id').delete(etudiantsController.delete);
    router.route('/etudiants/:id').put(etudiantsController.update);
   // router.route('/auth').post(etudiantsController.login);
    return router;
}

exports.router = buildRoutes(); 

