
const express = require('express');
const classeController = require('../controllers/classeController');

function buildRouter() {
    const router = express.Router();

    router.route('/classes').get(classeController.getAll);
    router.route('/classes/:id').get(classeController.getById);
    router.route('/classes').post(classeController.add);
    router.route('/classes/:id').put(classeController.update);
    router.route('/classes/:id').delete(classeController.delete);
    
    // Routes pour gérer la relation N:N avec profs
    router.route('/classes/:id/profs').post(classeController.assignProfs);
    router.route('/classes/:id/profs').get(classeController.getProfs);
    
    // Route pour obtenir les étudiants d'une classe
    router.route('/classes/:id/etudiants').get(classeController.getEtudiants);
    
    return router;

}

exports.router = buildRouter();
