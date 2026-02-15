const dbConfig =  require('../config');

const {Sequelize ,Op,DataTypes, QueryTypes, where} = require('sequelize');
const sequelize = new Sequelize(
    dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host : dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool:{
            max: dbConfig.pool.max,
            min : dbConfig.pool.min,
            acquire : dbConfig.pool.acquire,
            idle :dbConfig.pool.idle
        },
        query: {
            raw : true
        }
    }
)

const profsModel = require('./profsModel')(sequelize,DataTypes)
const messagesModel = require('./messagesModel')(sequelize,DataTypes)
const etudiantsModel = require('./etudiantsModel')(sequelize,DataTypes)
const classesModel = require('./classesModel')(sequelize,DataTypes)
const profClasseModel = require('./profClasseModel')(sequelize,DataTypes)
const userModel = require('./userModel')(sequelize,DataTypes)
const matiereModel = require('./matiereModel')(sequelize,DataTypes)
const noteModel = require('./noteModel')(sequelize,DataTypes)

// Définir les associations N:N entre profs et classes
profsModel.belongsToMany(classesModel, {
    through: profClasseModel,
    foreignKey: 'profId',
    otherKey: 'classeId',
    as: 'classes'
});

classesModel.belongsToMany(profsModel, {
    through: profClasseModel,
    foreignKey: 'classeId',
    otherKey: 'profId',
    as: 'profs'
});



// Définir la relation 1:N entre classes et étudiants
classesModel.hasMany(etudiantsModel, {
    foreignKey: 'classeId',
    as: 'etudiants'
});

etudiantsModel.belongsTo(classesModel, {
    foreignKey: 'classeId',
    as: 'classe'
});

matiereModel.hasMany(profsModel,{
    foreignKey : 'matiereId',
    as: 'profs'
});

profsModel.belongsTo(matiereModel,{
    foreignKey : 'matiereId',
    as: 'matieres'
});


noteModel.belongsTo(etudiantsModel,{
    foreignKey : 'etudiantId',
    as:'etudiants'
});
noteModel.belongsTo(matiereModel,{
    foreignKey : 'matiereId',
    as : 'matieres'
});
noteModel.belongsTo(profsModel, {
    foreignKey: 'profId',
    as: 'profs'
});
sequelize.sync()

module.exports = {
    db : sequelize,
    profsModel : profsModel,
    messagesModel : messagesModel,
    etudiantsModel : etudiantsModel,
    classesModel : classesModel,
    profClasseModel : profClasseModel,
    userModel : userModel,
    matiereModel : matiereModel,
    noteModel : noteModel
}