module.exports = (sequelize, DataTypes) => {
    return sequelize.define('etudiants', {
        nom: { type: DataTypes.STRING },
        prenom: { type: DataTypes.STRING },
        //classe: { type: DataTypes.INTEGER },
    })
}