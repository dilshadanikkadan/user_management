// Import required modules
const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const mongooseConnect = require('./confg/mongoConnection');
const bodyParser = require('body-parser');
const userRoutes = require("./routes/userRoutes");
const adminRouter = require('./routes/adminRouter');
const session = require("express-session");
const cookies = require('cookie-parser');

dotenv.config();

// setting middlwire
app.use(cookies());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'this is secret',
    cookie: {
        maxAge: 20000000, 
        httpOnly: true,
    }
}));


// setting req.body
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Routes 
app.use(userRoutes);
app.use(adminRouter);

// connectiong to mongoDb
mongooseConnect();


// Sserver
const Port = process.env.PORT || 3000;
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
 