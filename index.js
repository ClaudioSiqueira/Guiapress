const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const session = require('express-session')

const categoriesController = require('./categories/categoriesController')
const articlesController = require('./articles/articlesController')
const userController = require('./user/userController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./user/User')

// View engine (EJS)
app.set('view engine', 'ejs')

// Body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Statics files
app.use(express.static('public'))

// Session
app.use(session({
    secret: 'qualquercoisa', // pra deixar mais seguro, quanto mais aleatorio melhor
    cookie: {maxAge: 3000000}  // milisegundos pra expirar o cookie

}))


// Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados !')
    }).catch((error) =>{
        console.log(error)
    })

app.use('/', categoriesController) // faz o express usar as rotas do router
app.use('/', articlesController)
app.use('/', userController)

app.get('/', (req, res) =>{
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles =>{

        Category.findAll().then(categories =>{
            res.render('index', {articles: articles, categories: categories})
        })
    })
})


app.get('/:slug', (req, res) =>{
    let slug = req.params.slug
    Article.findOne({
        where:{
            slug: slug
        }
    }).then((article) =>{
        if (article != undefined){
            Category.findAll().then(categories =>{
                res.render('article', {article: article, categories: categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch(erro =>{
        res.redirect('/')
    })
})


app.get('/category/:slug', (req, res) =>{
    let slug = req.params.slug
    Category.findOne({
        where:{
            slug:slug
        },
        include: [{model: Article}] // Quando buscar a categoria, inclua todos os artigos relacionados a ela
    }).then(category =>{
        if (category != undefined){
            Category.findAll().then(categories =>{
                res.render('index', {articles: category.articles, categories: categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch(erro =>{
        res.redirect('/')
    })
})

app.listen(8080, () =>{
    console.log('Servidor Rodando !')
})
