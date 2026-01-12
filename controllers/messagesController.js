const {messagesModel} = require('../models');
const jwtUtils = require('../utils/jwt.utils');

module.exports = {
    getAll: function (req, res) {
        messagesModel.findAll()
            .then((data) => {
                res.status(200).json(
                    {
                        "status": "success",
                        "data": data
                    }
                )
            })
    },
    add : function(req,res){
        let {text} = req.body;
        if(text==null){
            res.status(409).json({
                'status': 'error',
                'message': 'Donnees incompletes pour le messages'
            })
            return;
        }
        messagesModel.create({text}).then((data)=>{
            res.status(201).json({
                'status': 'success',
                'message': 'message ajoute' 
            });
        }).catch((err)=>{
            res.status(404).json({
                'status': 'error',
                'message': err.message
            });
        })
    }
}