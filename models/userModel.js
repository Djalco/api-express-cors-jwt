module.exports = (sequelize , DataTypes)=>{
    return sequelize.define('users',{
        nom: {type : DataTypes.STRING},
        email: { type: DataTypes.STRING },
        role: { type: DataTypes.STRING },
        mdp : {type : DataTypes.STRING}
    })
}