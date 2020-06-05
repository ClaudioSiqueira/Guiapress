const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles', adminAuth, (req, res) =>{
    Article.findAll({
        include: [{model: Category}]
    }).then((articles) =>{
        res.render('admin/articles/index', {articles: articles})
    })
})

router.get('/admin/articles/new', adminAuth,(req, res) =>{
    Category.findAll().then(categories =>{
        res.render('admin/articles/new', {categories: categories})
    })
    
})

router.post('/articles/save', adminAuth,(req, res) =>{
    let title = req.body.title
    let slug = slugify(title)
    let body = req.body.body
    let category = req.body.category

    Article.create({
        title: title,
        slug: slug,
        body: body,
        CategoryId: category
    }).then(() =>{
        res.redirect('/admin/articles')
    })
})

router.post('/articles/delete', adminAuth,(req, res) =>{
    let id = req.body.id
    if (id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where:{
                    id:id
                }
            }).then(() =>{
                res.redirect('/admin/articles')
            })
        }else{
            res.redirect('/admin/articles')
        }
    }else{
        res.redirect('/admin/articles')
    }

})


router.get('/admin/articles/edit/:id', adminAuth,(req, res) =>{
    let id = req.params.id
    Article.findByPk(id).then(article =>{
        if (article != undefined){

            Category.findAll().then(categories =>{
                res.render('admin/articles/edit', {article:article, categories:categories})
            })

            
        }else{
            res.redirect('/')
        }

    }).catch(erro =>{
        res.redirect('/')
    })

})


router.post('/articles/update', adminAuth,(req, res) =>{
    let id = req.body.id
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Article.update({title: title, body: body, CategoryId: category, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(() =>{
        res.redirect('/admin/articles')
    }).catch(() =>{
        res.redirect('/')
    })
})


router.get('/articles/page/:num', (req, res) =>{  // paginacao
    let page = req.params.num
    let offset = 0

    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page) - 1) * 4
    }
     Article.findAndCountAll({
         limit: 4, // limite de dados de uma pagina   
         offset: offset,
         order: [
            ['id', 'DESC']
        ]
     }).then(articles =>{

        let next
        if(offset + 4 >= articles.count){
            next = false
        }else{
            next = true
        }
        let result = {
            page:parseInt(page),
            next: next,
            articles: articles
        }
        Category.findAll().then(categories =>{
            res.render('admin/articles/page', {result: result, categories: categories})
        })

         
     })
})


module.exports = router