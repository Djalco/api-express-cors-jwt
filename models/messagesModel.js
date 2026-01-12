module.exports = (sequelize,DataTypes )=>{
    return sequelize.define('messages',{
        text : { type : DataTypes.STRING }
    })
}