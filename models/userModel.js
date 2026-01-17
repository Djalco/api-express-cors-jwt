module.exports =(sequelize,DataTypes){
 return sequelize.define('user', {
        nom: {type : DataTypes.STRING},
        prenom: { type: DataTypes.STRING },
        role: { type: DataTypes.STRING },
        mdp : {type : DataTypes.STRING}
}