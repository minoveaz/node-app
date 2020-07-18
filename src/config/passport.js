const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../models/users')

passport.use(new LocalStrategy({usernameField:'email'}, async (email, password, done) => {
    const user = await User.findOne({email: email});
    if(!User){
        return done(null, false, {message: 'not user found'})
    }
    else{
      const match = await user.matchPassword(password)
      if(match){
        return done(null, false)
        }
            else{
            return done(null, false, {message: 'Incorrect Password'})
        }
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
        done(err, user)
    })
})