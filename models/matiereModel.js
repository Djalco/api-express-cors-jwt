module.exports = (sequelize, DataTypes) => {
    return sequelize.define('matieres', {
        nom: { type: DataTypes.STRING },
        coef :{type: DataTypes.INTEGER}
    })
}