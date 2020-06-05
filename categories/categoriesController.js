const express = require('express')
const router = express.Router() // Isso aqui substitui o app, serve para todos os arquivos
const Category = require('./Category')
const slugify = require('slugify') // Biblioteca que formata a string em um slug
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/categories/new', adminAuth,(req, res) =>{
    res.render('./admin/categories/new')
})

router.post('/categories/save', adminAuth,(req, res) => { // O formulario é enviado pra ca
    let title = req.body.title
    if (title != undefined && title != null){
        Category.create({
            title: title,
            slug: slugify(title) // Versao do titulo otimizado para URL
        }).then(() =>{
            res.redirect('/admin/categories')
        })
    }else{
        res.redirect('/admin/categories/new') // Se o usuario cadastrar um titulo invalido ele é redirecionado
    }
})

router.get('/admin/categories', adminAuth,(req, res) =>{
    Category.findAll().then(categories => {

        res.render('admin/categories/index',{
            categories: categories
        })
    })

})

router.post('/categories/delete', adminAuth,(req, res) =>{
    let id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)){   
            Category.destroy({
                where:{
                    id:id
                }
            }).then(() =>{
                res.redirect('/admin/categories')
            })
        }else{ // Se o id nao for um número
            res.redirect('/admin/categories')
        }
    }else{ // Se o id for indefinido
        res.redirect('/admin/categories')
    }
})


router.get('/admin/categories/edit/:id', adminAuth,(req, res) =>{
    let id = req.params.id
    if (isNaN(id)){  // Se o id n for um numero ex: 12abc
        res.redirect('/admin/categories')
    }

    Category.findByPk(id).then(category =>{  // Essa funcao pesquisa pelo id de forma mais rapida e direta
        if (category != undefined){
            res.render('admin/categories/edit', {category: category})
        }else{
            res.redirect('/admin/categories')
        }
    }).catch(erro =>{
        res.redirect('/admin/categories')
    })
 
})

router.post('/categories/update', adminAuth,(req, res) =>{
    let id = req.body.id
    let title = req.body.title
    let slug = slugify(title)
    Category.update({title: title, slug: slug}, { // Atualiza o titulo pelo Id
        where:{
            id:id
        }
    }).then(() =>{
        res.redirect('/admin/categories')
    })
})


module.exports = router
