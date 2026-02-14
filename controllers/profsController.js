const {profsModel, classesModel} = require('../models')
const bcrypt = require('bcrypt')
const jwtUtils = require('../utils/jwt.utils')
const { where } = require('sequelize')


module.exports = {
    getAll : function(req,res){
        profsModel.findAll()
        .then((data) =>{
            res.status(200).json(
                {
                    "status": "success",
                    "data": data
                }
            )
        })
        
    },
    getById:function(req,res) {                                                                                                         
        let id = req.params.id;
        profsModel.findByPk(id)
           .then((data)=>{
               if (!data) {
                   res.status(404).json({
                       'status': 'error',
                       'message': 'prof '+ data +'nvalide'
                   });
               }
                res.status(200).json({
                    'status': 'succes',
                    'data': data
                });
        }).catch(err=>{
            console.log('Erreur : ', err.message)
        })
            
        
    },
    add: function (req, res) { 
        let {nom, prenom, bureau,matiereId,mdp}= req.body;

        if(nom==null || prenom==null || bureau==null|| matiereId == null|| mdp==null){
            res.status(409).json({
                'status': 'error',
                'message': 'Donnees incompletes'
            });
            return;
        }
        bcrypt.hash(mdp,5,(err,encrypted)=>{
            profsModel.create({
                nom: nom,
                prenom: prenom,
                bureau: bureau,
                matiereId : matiereId,
                mdp: encrypted
            }).then((data) => {
                res.status(201).json({
                    'status': 'success',
                    'message': 'prof ajoute' + data.nom + data.prenom,
                    'data': data
                });
            }).catch(err => {
                console.log('Erreur :', err.message)
            })
        })
        
        
        
    },
    update: function (req, res) { 
        let id = req.params.id;

        let { nom, prenom, bureau, mdp , matiereId} = req.body;
        
        // Si le mot de passe est fourni et non vide, on le met à jour
        if (mdp && mdp.trim() !== '') {
            bcrypt.hash(mdp, 5, (err, encrypted) => {
                profsModel.update(
                    {   
                        nom: nom || null, 
                        prenom: prenom || null, 
                        bureau: bureau || null, 
                        mdp: encrypted ,
                        matiereId : matiereId || null
                    }, 
                    { where: { id: id } }
                ).then((data) => {
                    if (!data[0]) {
                        res.status(404).json({
                            'status': 'error',
                            'message': 'prof id invalide'
                        });
                        return;
                    }

                    res.status(200).json({
                        'status': 'success',
                        'message': 'prof modifie'
                    });
                }).catch(err => {
                    console.log('Erreur:', err.message);
                    res.status(500).json({
                        'status': 'error',
                        'message': 'Erreur lors de la mise à jour'
                    });
                });
            });
        } else {
            // Mettre à jour sans changer le mot de passe
            profsModel.update(
                { 
                    nom: nom || null, 
                    prenom: prenom || null, 
                    bureau: bureau || null,
                    matiereId : matiereId || null
                
                }, 
                { where: { id: id } }
            ).then((data) => {
                if (!data[0]) {
                    res.status(404).json({
                        'status': 'error',
                        'message': 'prof id invalide'
                    });
                    return;
                }

                res.status(200).json({
                    'status': 'success',
                    'message': 'prof modifie'
                });
            }).catch(err => {
                console.log('Erreur:', err.message);
                res.status(500).json({
                    'status': 'error',
                    'message': 'Erreur lors de la mise à jour'
                });
            });
        }
    },
    delete: function (req, res) { 
        let id = req.params.id;
        profsModel.destroy(
            {where :{id:id}}
        ).then((data)=>{
            if (!data) {
                res.status(404).json({
                    'status': 'error',
                    'message': 'prof id invalide'
                });
                return;
            }
            res.status(204).json({
                'status': 'success',
                'message': 'prof supprime'
            });
        }).catch(err=>{
            console.log('Erreur :', err.message)
        })
       
    },
    login : function(req,res) {
        let {nom,mdp} = req.body;
        if(nom==null || mdp==null){
            res.status(400).json({
                'status' : 'error',
                'message': 'Donnees incompletes pour authentification'
            });
            return;
        }
        profsModel.findOne({where : {nom:nom}})
        .then((profFound) =>{
            if(profFound){
                bcrypt.compare(mdp,profFound.mdp,(err,resBcrypt)=>{
                    if(resBcrypt){
                        res.status(200).json({
                            'status' : 'succes',
                            'profId' : profFound.id,
                            'nom': profFound.nom,
                            'prenom': profFound.prenom,
                            'role': 'prof',
                            'token' : jwtUtils.generateTokenForUser(profFound)
                        })
                        return;
                    } else {
                        res.status(403).json({
                            status: 'error',
                            message: 'Donnees de connexion invalides'
                        })
                    }
                })
            }else{
                res.status(403).json({
                    status: 'error',
                    message: 'Donnees de connexion invalides'
                })
            }
        })
    },
    // Assigner des classes à un prof
    assignClasses: async function(req, res) {
        let profId = req.params.id;
        let { classeIds } = req.body;

        console.log('Assignation des classes:', { profId, classeIds });

        if (!classeIds || !Array.isArray(classeIds)) {
            res.status(400).json({
                'status': 'error',
                'message': 'classeIds doit être un tableau'
            });
            return;
        }

        try {
            const prof = await profsModel.findByPk(profId);
            if (!prof) {
                res.status(404).json({
                    'status': 'error',
                    'message': 'Prof non trouvé'
                });
                return;
            }

            // Supprimer toutes les associations existantes
            const { profClasseModel } = require('../models');
            await profClasseModel.destroy({
                where: { profId: profId }
            });

            // Créer les nouvelles associations
            if (classeIds.length > 0) {
                const associations = classeIds.map(classeId => ({
                    profId: profId,
                    classeId: classeId
                }));
                await profClasseModel.bulkCreate(associations);
            }

            res.status(200).json({
                'status': 'success',
                'message': 'Classes assignées au prof'
            });
        } catch(err) {
            console.log('Erreur complète:', err);
            res.status(500).json({
                'status': 'error',
                'message': 'Erreur lors de l\'assignation: ' + err.message
            });
        }
    },
    // Obtenir les classes d'un prof
    getClasses: async function(req, res) {
        let profId = req.params.id;

        try {
            const prof = await profsModel.findByPk(profId);
            if (!prof) {
                res.status(404).json({
                    'status': 'error',
                    'message': 'Prof non trouvé'
                });
                return;
            }

            // Récupérer les classes via la table de jointure
            const { profClasseModel, db } = require('../models');
            const query = `
                SELECT c.* 
                FROM classes c
                INNER JOIN prof_classes pc ON c.id = pc.classeId
                WHERE pc.profId = :profId
            `;
            
            const classes = await db.query(query, {
                replacements: { profId },
                type: db.QueryTypes.SELECT
            });

            res.status(200).json({
                'status': 'success',
                'data': classes
            });
        } catch(err) {
            console.log('Erreur:', err.message);
            res.status(500).json({
                'status': 'error',
                'message': 'Erreur lors de la récupération'
            });
        }
    }

}