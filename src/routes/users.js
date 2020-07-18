const express = require("express")
const router = express.Router();

const User = require('../models/users')
const passport = require('passport')

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect:'/notes', 
    failureRedirect: '/users/signin', 
    failureFlash: true
}))

router.post('/users/signup', async (req, res) => {
    const {name, email, password, confirm_password} = req.body;
    const errors = [];

    if(name.length <=0){
        errors.push({text: 'Please Insert your Name'})
    }

    if(password != confirm_password){
        errors.push({text: 'Password do not Match'})
    }
    if(password.length < 4){
        errors.push({text: 'Password must be more than 4 characteres'})
    }
    if(errors.length > 0 ){
        res.render('users/signup', {errors, name, email, password, confirm_password})
    }
    else{
    const emailUser = await User.findOne({email: email})

        if(emailUser){
            req.flash('errors_msg', 'The email is already in use');
            res.redirect('/users/signup');
        }

        else{
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered')
            res.redirect('/users/signin')
        }

    }
    
});

/* router.post('/users/signin', async (req,res) => {
    const {email, password} = req.body;
    const errors = [];

    console.log(req.body)

    if(email.length <=0){
        errors.push({text: 'Please Insert your Email'})
    }
    if(password.length <=0){
        errors.push({text: 'Please Insert your Password'})
    }
    if(errors.length > 0 ){
        res.render('users/signin', {errors,email, password})
    }
    else{

    const currentUser2 = User({email, password}) 
    currentUser2.password = await currentUser2.encryptPassword(password);
    const currentUser = await User.findOne({email: email})

    console.log(currentUser2)

    if(currentUser){


        if(match){
            console.log('Pass OK')
        }
        else{
            console.log('Pass wrong')
            req.flash('errors_msg', 'Password is incorrect');
        res.redirect('/users/signin');
        }

        console.log('ha encontrado el mail')
        res.send('ok')
    }
    else{
        req.flash('errors_msg', 'User not Found');
        res.redirect('/users/signin');
    }

}

}) */

module.exports = router