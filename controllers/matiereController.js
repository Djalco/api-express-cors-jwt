const { matiereModel } = require('../models');
const jwtUtils = require('../utils/jwt.utils');

module.exports = {
    getAll: function (req, res) {
        matiereModel.findAll()
            .then((data) => {
                res.status(200).json(
                    {
                        "status": "success",
                        "data": data
                    }
                )
            })
    },
    add: function (req, res) {
        let { nom,coef } = req.body;
        if (nom == null || coef == null) {
            res.status(409).json({
                'status': 'error',
                'message': 'Donnees incompletes'
            });
            return;
        }
        matiereModel.create({
            nom: nom,
            coef: coef || null
        }).then((data) => {
            res.status(201).json({
                'status': 'success',
                'message': 'matiere ajoute' + data.nom,
                'data': data
            });
        }).catch(err => {
            console.log('Erreur :', err.message)
        })
    },
    delete: function (req, res) {
        let id = req.params.id;
        matiereModel.destroy({
            where: { id: id }
        }).then(deleted => {
            if (deleted) {
                res.status(200).json({
                    'status': 'success',
                    'message': 'matiere supprime'
                });
            } else {
                res.status(404).json({
                    'status': 'error',
                    'message': 'matiere n\'existe pas'
                });
            }
        }).catch(err => {
            console.log('Erreur : ', err.message)
        })
    },
    update: function (req, res) {
        let id = req.params.id;
        let { nom, coef } = req.body;
        matiereModel.update({
            nom: nom,
            coef:coef || null
        }, {
            where: { id: id }
        }).then(updated => {
            if (updated[0]) {
                res.status(200).json({
                    'status': 'success',
                    'message': 'matiere modifie'
                });
            } else {
                res.status(404).json({
                    'status': 'error',
                    'message': 'matiere n\'existe pas'
                });
            }
        }).catch(err => {
            console.log('Erreur : ', err.message)
        })
    },
    

}