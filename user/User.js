const Sequelize = require('sequelize')
const connection = require('../database/database')

const User = connection.define('User',{
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: { // Endereço da categoria
        type: Sequelize.STRING,
        allowNull: false
    }
})


User.sync({force: false})

module.exports = User