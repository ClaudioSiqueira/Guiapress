const Sequelize = require('sequelize')
const connection = require('../database/database')
const Category = require('../categories/Category')

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull:false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }  
})

Category.hasMany(Article)   // Cada categoria tem varios artigos (1 pra N, relacionamento entre tabelas)
Article.belongsTo(Category) // Cada artigo pertence a uma categoria (1 pra 1, relacionamento entre tabelas)

// Poderia ter apenas um tipo de relacionamento

Article.sync({force: false})

module.exports = Article
