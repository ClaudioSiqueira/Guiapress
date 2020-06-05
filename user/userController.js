const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcrypt')
const adminAuth = require('../middlewares/adminAuth')


router.get('/admin/users', adminAuth,(req, res) =>{
    User.findAll().then(users =>{
        res.render('admin/users/users', {users: users})
    })
})

router.get('/admin/user/create', adminAuth,(req, res) =>{
    res.render('admin/users/create')
})

router.post('/user/create', adminAuth,(req, res) =>{
    let email = req.body.email
    let password = req.body.password

    // Verificar email duplicado
    User.findOne({
        where:{email: email}
    }).then(user =>{
        if (user == undefined){
        
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)

            User.create({
                email: email,
                password: hash
            }).then(() =>{
                User.findAll().then(users =>{
                    res.render('admin/users/users', {users: users})
                })
            }).catch(() =>{
                res.redirect('/')
            })
        }else{
            res.redirect('/admin/user/create')
        }
    })


})



router.post('/admin/delete', (req, res) =>{
    let id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            User.destroy({
                where: {id: id}
            }).then(() =>{
                res.redirect('/admin/users')
            }).catch((err) =>{
                res.redirect('/admin/users')
            })
        }
    }else{
        res.redirect('/admin/users')
    }

})

router.get('/admin/editar/:id',adminAuth, (req, res) =>{
    let id = req.params.id
    if(id != undefined){
        if(!isNaN(id)){
            User.findByPk(id).then((user) =>{
                res.render('admin/users/edit', {user: user})
            })
        }else{
            res.redirect('/admin/users')
        }

    }else{
        res.redirect('/admin/users')
    }
})


router.post('/admin/user/update', (req, res) =>{
    let id = req.body.id
    let email = req.body.email
    let password = req.body.password

    User.update({email: email, password:password}, {
        where:{id:id}
    }).then(() =>{
        res.redirect('/admin/users')
    }).catch((err) =>{
        res.redirect('/')
    })
})




router.get('/login', (req, res) =>{   // fazer login
    res.render('admin/users/login')
})


router.post('/authenticate', (req, res) =>{  // autenticar o login
    let email = req.body.email
    let password = req.body.password

    User.findOne({
        where: {email: email}
    }).then((user) =>{
        if (user != undefined){  //  se existir um usuário com esse email
            // validar senha 
            let correct = bcrypt.compareSync(password, user.password) // compara a senha informada com a senha do banco

            if (correct){
                // Criar uma sessao para o usuario chamada user
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/categories')
            }else{
                res.redirect('/login')
            }

        }else{
            res.redirect('/login')
        }
    })
})


// logout 
router.get('/logout', (req, res) =>{
    req.session.user = undefined
    res.redirect('/')
})


module.exports = router