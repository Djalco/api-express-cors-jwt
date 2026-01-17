module.exports = (sequelize, DataTypes) => {
    return sequelize.define('etudiants', {
        nom: { type: DataTypes.STRING },
        prenom: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        classeId: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'classes',
                key: 'id'
            }
        }
    })
}