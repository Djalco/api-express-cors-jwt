module.exports = (sequelize, DataTypes) => {
    return sequelize.define('prof_classe', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    }, {
        timestamps: true
    });
}
