
const express = require('express');
const matiereController = require('../controllers/matiereController');

function buildRouter() {
    const router = express.Router();

    router.route('/matieres').get(matiereController.getAll);
    router.route('/matieres').post(matiereController.add);
    router.route('/matieres/:id').put(matiereController.update);
    router.route('/matieres/:id').delete(matiereController.delete);


    return router;

}

exports.router = buildRouter();
