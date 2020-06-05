const Sequelize = require('sequelize')
const connection = require('../database/database')

const Category = connection.define('Categories',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: { // Endereço da categoria
        type: Sequelize.STRING,
        allowNull: false
    }// Ex: categoria 'Desenvolvimento Web' tem o slug 'desenvolvimento-web'
})

Category.sync({force: false})

module.exports = Category