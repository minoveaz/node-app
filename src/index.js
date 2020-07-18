const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport')

// Initiliazations------------------//
const app = express();
require('./database');
require('./config/passport')

//settings -------------------------//
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main' ,
    layoutsDir: path.join(app.get('views'), 'layouts') ,
    partialsDir: path.join(app.get('views'), 'partials') ,
    extname: '.hbs'
}));

app.set('view engine', '.hbs');
// Middlewares --------------------// 
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

app.use(flash())

// Global Variables --------------// 

app.use((req, res, next) =>{

    res.locals.success_msg = req.flash('success_msg')
    res.locals.errors_msg = req.flash('errors_msg')
    res.locals.error = req.flash('error')
    next();
})

// Routes -----------------------//

app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// static files ----------------//

app.use(express.static(path.join(__dirname, 'public')))

// Server is listening ---------// 
app.listen(app.get('port'), () => {
    console.log("server on port ", app.get('port') )
});