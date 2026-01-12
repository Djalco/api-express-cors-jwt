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
        let { nom, prenom } = req.body;
        if (nom == null || prenom == null) {
            res.status(409).json({
                'status': 'error',
                'message': 'Donnees incompletes'
            });
            return;
        }   
        etudiantsModel.create(
            { nom: nom, prenom: prenom }
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

        let { nom, prenom} = req.body;
        if (nom == null || prenom == null ) {
            res.status(409).json({
                'status': 'error',
                'message': 'Donnees incompletes'
            });
            return;
        }
        /* bcrypt.hash(mdp, 5, (err, encrypted) => {
            etudiantsModel.update(
                { nom: nom, prenom: prenom, bureau: bureau, mdp: encrypted }, { where: { id: id } }
            ).then((data) => {
                if (!data) {
                    res.status(404).json({
                        'status': 'error',
                        'message': 'prof id invalide'
                    });
                    return;
                }

                res.status(204).json({
                    'status': 'success',
                    'message': 'prof modifie'
                });
            }).catch(err => {
                console.log('Erreur:', err.message)
            })
        }) */
        etudiantsModel.update(
            { nom: nom, prenom: prenom }, { where: { id: id } }
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
    /* login: function (req, res) {
        let { nom, mdp } = req.body;
        if (nom == null || mdp == null) {
            res.status(400).json({
                'status': 'error',
                'message': 'Donnees incompletes pour authentification'
            });
            return;
        }
        etudiantsModel.findOne({ where: { nom: nom } })
            .then((profFound) => {
                if (profFound) {
                    bcrypt.compare(mdp, profFound.mdp, (err, resBcrypt) => {
                        if (resBcrypt) {
                            res.status(200).json({
                                'status': 'succes',
                                'profId': profFound.id,
                                'token': jwtUtils.generateTokenForUser(profFound)
                            })
                            return;
                        } else {
                            res.status(403).json({
                                status: 'error',
                                message: 'Donnees de connexion invalides'
                            })
                        }
                    })
                } else {
                    res.status(403).json({
                        status: 'error',
                        message: 'Donnees de connexion invalides'
                    })
                }
            })
    } */

}