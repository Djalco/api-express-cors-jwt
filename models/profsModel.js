module.exports = (sequelize , DataTypes)=>{
    return sequelize.define('profs',{
        nom: {type : DataTypes.STRING},
        prenom: { type: DataTypes.STRING },
        bureau: { type: DataTypes.INTEGER },
        email : {type : DataTypes.STRING},
        matiereId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'matieres',
                key: 'id'
            }
        },
        mdp : {type : DataTypes.STRING}
    })
}