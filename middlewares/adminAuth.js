// Um middleware é uma funçao que é chamada entre uma req e uma res

function adminAuth(req, res, next){
    console.log('teste')
    if (req.session.user != undefined){
        next()
    }else{
        res.redirect('/login')
    }
}

module.exports = adminAuth