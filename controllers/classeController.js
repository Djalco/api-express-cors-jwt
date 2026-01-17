const { classesModel, profsModel } = require('../models')

module.exports= {
    getAll : function(req,res){
        classesModel.findAll()
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
        classesModel.findByPk(id)
              .then((data)=>{       
                    if (!data) {
                        res.status(404).json({
                            'status': 'error',
                            'message': 'classe '+ data +'nvalide'
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
        let {nom, niveau, description}= req.body;    
        if(nom==null || niveau==null){
            res.status(409).json({
                'status': 'error',
                'message': 'Donnees incompletes'
            });
            return;
        }   
        classesModel.create({
            nom: nom,
            niveau: niveau,
            description: description || null
        }).then((data) => {
            res.status(201).json({
                'status': 'success',
                'message': 'classe ajoute' + data.nom,
                'data': data
            });
        }).catch(err => {
            console.log('Erreur :', err.message)
        })
    },
    delete:function(req,res){
        let id = req.params.id; 
        classesModel.destroy({
            where: { id: id }
        }).then(deleted => {    
            if (deleted) {
                res.status(200).json({
                    'status': 'success',
                    'message': 'classe supprime'
                });
            } else {
                res.status(404).json({
                    'status': 'error',
                    'message': 'classe n\'existe pas'
                });
            }   
        }).catch(err=>{
            console.log('Erreur : ', err.message)
        })
    },
    update:function(req,res){
        let id = req.params.id; 
        let {nom, niveau, description}= req.body;    
        classesModel.update({
            nom: nom,
            niveau: niveau,
            description: description || null
        },{
            where: { id: id }
        }).then(updated => {    
            if (updated[0]) {
                res.status(200).json({
                    'status': 'success',
                    'message': 'classe modifie'
                });
            } else {
                res.status(404).json({
                    'status': 'error',
                    'message': 'classe n\'existe pas'
                });
            }   
        }).catch(err=>{
            console.log('Erreur : ', err.message)
        })
    },
    // Assigner des profs à une classe
    assignProfs: async function(req, res) {
        let classeId = req.params.id;
        let { profIds } = req.body;

        console.log('Assignation des profs:', { classeId, profIds });

        if (!profIds || !Array.isArray(profIds)) {
            res.status(400).json({
                'status': 'error',
                'message': 'profIds doit être un tableau'
            });
            return;
        }

        try {
            const classe = await classesModel.findByPk(classeId);
            if (!classe) {
                res.status(404).json({
                    'status': 'error',
                    'message': 'Classe non trouvée'
                });
                return;
            }

            // Supprimer toutes les associations existantes
            const { profClasseModel } = require('../models');
            await profClasseModel.destroy({
                where: { classeId: classeId }
            });

            // Créer les nouvelles associations
            if (profIds.length > 0) {
                const associations = profIds.map(profId => ({
                    profId: profId,
                    classeId: classeId
                }));
                await profClasseModel.bulkCreate(associations);
            }

            res.status(200).json({
                'status': 'success',
                'message': 'Profs assignés à la classe'
            });
        } catch(err) {
            console.log('Erreur complète:', err);
            res.status(500).json({
                'status': 'error',
                'message': 'Erreur lors de l\'assignation: ' + err.message
            });
        }
    },
    // Obtenir les profs d'une classe
    getProfs: async function(req, res) {
        let classeId = req.params.id;

        try {
            const classe = await classesModel.findByPk(classeId);
            if (!classe) {
                res.status(404).json({
                    'status': 'error',
                    'message': 'Classe non trouvée'
                });
                return;
            }

            // Récupérer les profs via la table de jointure
            const { profClasseModel, db } = require('../models');
            const query = `
                SELECT p.* 
                FROM profs p
                INNER JOIN prof_classes pc ON p.id = pc.profId
                WHERE pc.classeId = :classeId
            `;
            
            const profs = await db.query(query, {
                replacements: { classeId },
                type: db.QueryTypes.SELECT
            });

            res.status(200).json({
                'status': 'success',
                'data': profs
            });
        } catch(err) {
            console.log('Erreur:', err.message);
            res.status(500).json({
                'status': 'error',
                'message': 'Erreur lors de la récupération'
            });
        }
    },
    // Obtenir les étudiants d'une classe
    getEtudiants: async function(req, res) {
        let classeId = req.params.id;

        try {
            const classe = await classesModel.findByPk(classeId);
            if (!classe) {
                res.status(404).json({
                    'status': 'error',
                    'message': 'Classe non trouvée'
                });
                return;
            }

            // Récupérer les étudiants via classeId
            const { etudiantsModel } = require('../models');
            const etudiants = await etudiantsModel.findAll({
                where: { classeId: classeId }
            });

            res.status(200).json({
                'status': 'success',
                'data': etudiants
            });
        } catch(err) {
            console.log('Erreur:', err.message);
            res.status(500).json({
                'status': 'error',
                'message': 'Erreur lors de la récupération des étudiants'
            });
        }
    }   

}