const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const secret=process.env.SECRET;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/public', express.static('public'));
////////////////////////////////////ROUTES///////////////////////////////
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

///////////////////////CONNECTING TO DATABASE/////////////////////////////

mongoose.connect("mongodb://localhost:27017/authentication", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("CONNECTED TO MONGODB!");
});



///////////////////////USERS/////////////////////

const usersch = mongoose.Schema({
    username: String,
    password: String
});

//////////////////////SECRET////////////////////


usersch.plugin(encrypt, {
    secret: secret,
    encryptedFields:["password"]
});


///////////////////////MODEL/////////////////////
const User = mongoose.model('user', usersch);

app.post('/signup', (req, res) => {
    const newuser = User({
        username: req.body.username,
        password: req.body.password
    });

    newuser.save((error) => {
        if (!error) {
            res.render('welcome.ejs');
        } else {
            console.log(error);
        }
    });

});

///////////////////////////////AUTHENTICATING USERS////////////////////////////////////////

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', (req, res) => {
    const user = req.body.username;
    const pass = req.body.password;

    User.findOne({
        username: user
    }, (e, matchedUser) => {
        if (matchedUser.password == pass) {
            res.render('welcome.ejs');
        } else {
            res.render('wrong.ejs');
        }
    });

});

app.listen(port, () => {
    console.log("Server up at " + port);
})