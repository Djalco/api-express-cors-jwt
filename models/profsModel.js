module.exports = (sequelize , DataTypes)=>{
    return sequelize.define('profs',{
        nom: {type : DataTypes.STRING},
        prenom: { type: DataTypes.STRING },
        bureau: { type: DataTypes.INTEGER },
        mdp : {type : DataTypes.STRING}
    })
}