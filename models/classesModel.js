module.exports = (sequelize, DataTypes) => {
    return sequelize.define('classes', {
        nom: { type: DataTypes.STRING },
        niveau: { type: DataTypes.INTEGER },
    })
}

