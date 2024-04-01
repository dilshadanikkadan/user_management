const sessionCheck = (req, res, next) => {

    if (req.session.user) {
        res.redirect('/')
        
    } else {
        next()
        res.render('user/pages/login', { message: "" })

    }

}
module.exports = sessionCheck 