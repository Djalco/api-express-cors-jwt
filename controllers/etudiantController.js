const { etudiantsModel } = require('../models')
const bcrypt = require('bcrypt')
const jwtUtils = require('../utils/jwt.utils')
const { where } = require('sequelize')


module.exports = {
    getAll: function (req, res) {
        etudiantsModel.findAll()
            .then((data) => {
                res.status(200).json(
                    {
                        "status": "success",
                        "data": data
                    }
                )
            })

    },
    getById: function (req, res) {
        let id = req.params.id;
        etudiantsModel.findByPk(id)
            .then((data) => {
                if (!data) {
                    res.status(404).json({
                        'status': 'error',
                        'message': 'prof ' + data + 'nvalide'
                    });
                }
                res.status(200).json({
                    'status': 'succes',
                    'data': data
                });
            }).catch(err => {
                console.log('Erreur : ', err.message)
            })


    },
    add: function (req, res) {
        let { nom, prenom, email, classeId } = req.body;
        if (nom == null || prenom == null) {
            res.status(409).json({
                'status': 'error',
                'message': 'Donnees incompletes'
            });
            return;
        }   
        etudiantsModel.create(
            { 
                nom: nom, 
                prenom: prenom,
                email: email || null,
                classeId: classeId || null
            }
        ).then((data) => {
            res.status(201).json({
                'status': 'success',
                'data': data
            });
        }).catch(err => {
            console.log('Erreur :', err.message)
        })



    },
    update: function (req, res) {
        let id = req.params.id;

        let { nom, prenom, email, classeId } = req.body;
        if (nom == null || prenom == null ) {
            res.status(409).json({
                'status': 'error',
                'message': 'Donnees incompletes'
            });
            return;
        }
       
        etudiantsModel.update(
            { 
                nom: nom, 
                prenom: prenom,
                email: email || null,
                classeId: classeId || null
            }, 
            { where: { id: id } }
        ).then((data) => {
            if (!data) {
                res.status(404).json({
                    'status': 'error',
                    'message': 'etudiant id invalide'
                });
                return;
            }

            res.status(204).json({
                'status': 'success',
                'message': 'etudiant modifie'
            });
        }).catch(err => {
            console.log('Erreur:', err.message)
        })


    },
    delete: function (req, res) {
        let id = req.params.id;
        etudiantsModel.destroy(
            { where: { id: id } }
        ).then((data) => {
            if (!data) {
                res.status(404).json({
                    'status': 'error',
                    'message': 'etudiant id invalide'
                });
                return;
            }
            res.status(204).json({
                'status': 'success',
                'message': 'etudiant supprime'
            });
        }).catch(err => {
            console.log('Erreur :', err.message)
        })

    },
    // Authentification des étudiants avec email et nom
    login: function(req, res) {
        let { email, nom } = req.body;
        
        if (email == null || nom == null) {
            res.status(400).json({
                'status': 'error',
                'message': 'Email et nom requis'
            });
            return;
        }
        
        etudiantsModel.findOne({ where: { email: email, nom: nom } })
            .then((etudiantFound) => {
                if (etudiantFound) {
                    res.status(200).json({
                        'status': 'success',
                        'userId': etudiantFound.id,
                        'nom': etudiantFound.nom,
                        'prenom': etudiantFound.prenom,
                        'email': etudiantFound.email,
                        'role': 'etudiant',
                        'token': jwtUtils.generateTokenForUser(etudiantFound)
                    });
                } else {
                    res.status(403).json({
                        'status': 'error',
                        'message': 'Email ou nom incorrect'
                    });
                }
            })
            .catch(err => {
                console.log('Erreur:', err.message);
                res.status(500).json({
                    'status': 'error',
                    'message': 'Erreur serveur'
                });
            });
    }

}