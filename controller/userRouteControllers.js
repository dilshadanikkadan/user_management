const { validationResult, body } = require('express-validator');
const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const { use, all } = require('../routes/userRoutes');

const session = require('express-session')
exports.signUp = async (req, res) => {

    const { username, email, password } = req.body;
    let message = "";


    const errors = validationResult(req);


    //check email already exist
    const isEmail = await userModel.countDocuments({ email: req.body.email })
    if (isEmail > 0) {
        message = "email already exist"
        return res.render('user/pages/signUp', { message });
    }

    if (!errors.isEmpty()) {
        message = errors.array()[0].msg
        return res.render('user/pages/signUp', { message });
    }
    try {
        const userSchema = new userModel({
            username: username,
            email: email,
            password: req.body.password,
        })


        const savedUser = await userSchema.save()

        const { password, ...user } = savedUser._doc
        req.session.user = user;
        console.log(user);
        req.session.save()
        res.redirect('/')
        return res.render('user/pages/home', { userData: user });


    } catch (error) {
        res.send("error occured")
    }

}

exports.login = async (req, res) => {
    let message = "";

    try {
        const user = await userModel.find({ email: req.body.email })
        if (user.length == 0) {
            message = "user not exist!"
            return res.render('user/pages/login', { message });
        }



        const isMatch = await bcr-ypt.compare(req.body.password, user[0].password)
        console.log(isMatch);

        if (!isMatch) {
            message = "invalid password"
            return res.render('user/pages/login', { message });

        }


        const { password, ...others } = user

        if (user[0].isAdmin == true) {
            const allUser = await userModel.find()
            req.session.admin = others;
            req.session.save()

            res.render('admin/pages/dashboard', { users: allUser });
        }

        req.session.user = others;
        req.session.save()
        res.redirect('/')



    } catch (error) {
        console.log(error);

    }

} 