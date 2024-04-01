const userModel = require('../model/userModel')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { route } = require('./userRoutes')
const validateSignup = require('../middlewire/loginVlidate')
const { validationResult, body } = require('express-validator');


const router = require('express').Router()


router.get("/admin/dashboard", async (req, res) => {


    if (req.session.admin) {

        const allUser = await userModel.find()
        res.render('admin/pages/dashboard', { users: allUser })
    } else {
        res.redirect("/login")
    }

})
router.get("/admin/singleUser", async (req, res) => {
    if (req.session.admin) {

        res.render('admin/pages/singleUser')
    } else {
        res.redirect("/login")
    }
})

router.get("/getUser", async (req, res) => {

    try {
        const userId = req.query.user_id.trim();
        console.log(userId);

        const singleUser = await userModel.findById(userId);
        res.render('admin/pages/singleUser', { user: singleUser, message: "" })
    } catch (error) {
        console.error('error occured:', error);

    }
})


router.get("/search", async (req, res) => {

    console.log(req.query.search);
    const searchItem = req.query.search
    const result = await userModel.find({ email: { $regex: new RegExp('^' + searchItem, 'i') } });

    res.render('admin/pages/dashboard', { users: result })

})
router.post("/clear", async (req, res) => {

    const allUser = await userModel.find()
    res.render('admin/pages/dashboard', { users: allUser })

})


router.post("/deleteuser", async (req, res) => {

    const userId = req.body.user_id.trim();
    const allUser = await userModel.findByIdAndDelete(userId)

    const newList = await userModel.find()
    res.render('admin/pages/dashboard', { users: newList })

})



router.post("/updateUser", async (req, res) => {
    let message = "sccessfullt updated"
    const { user_id, ...others } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const check = await userModel.findByIdAndUpdate(user_id, {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        }, { new: true }).then((response) => {
            res.render('admin/pages/singleUser', { user: response, message: message })
        })

    } catch (error) {
        console.log(error);
    }

})

router.get("/createuser", (req, res) => {
    if (req.session.admin) {

        res.render('admin/pages/createUser', { message: "", succesMsg: "" })
    } else {
        res.redirect("/login")
    }


})

router.post("/createNewUser", validateSignup, async (req, res) => {
    const { username, email, password } = req.body;
    let message = "";
    let succesMsg = ""


    const errors = validationResult(req);


    //check email already exist
    const isEmail = await userModel.countDocuments({ email: req.body.email })
    if (isEmail > 0) {
        message = "email already exist"
        return res.render('admin/pages/createUser', { message, succesMsg });
    }

    if (!errors.isEmpty()) {
        message = errors.array()[0].msg
        return res.render('admin/pages/createUser', { message, succesMsg });
    }
    try {
        const userSchema = new userModel({
            username: username,
            email: email,
            password: req.body.password,
        })


        const savedUser = await userSchema.save()

        succesMsg = "suucess fully added"
        return res.render('admin/pages/createUser', { succesMsg, message });


    } catch (error) {
        res.send("error occured")
    }


})


module.exports = router