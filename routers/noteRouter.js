const express = require('express');
const noteController = require('../controllers/noteController');

function buildRoutes(){
    let router = express.Router();
  
    //ajoute un seul note
    router.route('/notes').post(noteController.add);

    //ajouter plusieur notes a la fois (tableau)
    router.route('/notes/bulk').post(noteController.addAll)
    return router;
}

exports.router = buildRoutes(); 

