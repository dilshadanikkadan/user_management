const router = require('express').Router()
const { signUp, login } = require("../controller/userRouteControllers")
const validateSignup = require('../middlewire/loginVlidate')
const sessionCheck = require('../middlewire/sessionUser')




// post Methods
router.post("/signUp", validateSignup, signUp)
router.post("/login", login)
router.post("/logoutnew", (req, res) => {
    req.session.destroy();
    res.redirect('/login')
})

router.get("/getCurrentuser", (req, res) => {
    // console.log(req.session.user);
    return res.send(req.session.user)
})


// get methods

router.get('/', (req, res) => {

    const userData = req.session.user
    req.session.user ?
        res.render('user/pages/home', { userData: userData }) :
        res.redirect('/login')


})

router.get("/signUp", (req, res) => {
    req.session.user ?

        res.redirect('/')
        :
        res.render('user/pages/signUp', { message: "" })
})

router.get("/login", sessionCheck, (req, res) => {
    console.log(req.session.user)


    res.render('user/pages/login', { message: "" })
    return;
})




module.exports = router