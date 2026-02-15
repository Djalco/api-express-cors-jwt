module.exports = (sequelize, DataTypes) => {
    return sequelize.define('notes', {
        valeur: { type: DataTypes.FLOAT },
        appreciation: { type: DataTypes.STRING },
        matiereId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'matieres',
                key: 'id'
            }
        },
        etudiantId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'etudiants',
                key: 'id'
            }
        },
        profId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'profs',
                key: 'id'
            }
        }
    })
}