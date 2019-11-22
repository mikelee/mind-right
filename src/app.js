const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    Motivation = require('./models/motivation'),
    Image = require('./models/image'),
    User = require('./models/user'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    middleware = require('./middleware');
    

const url = 'mongodb+srv://mike:mindrightpass@cluster0-trcek.mongodb.net/test?retryWrites=true&w=majority';
mongoose.set('useUnifiedTopology', true);
mongoose.connect(url, { useNewUrlParser: true })
.then(data => data);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/assets'));
app.use(methodOverride('_method'));

const MongoClient = require('mongodb').MongoClient;

// Connect to server
MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });



//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I love beaches",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






// ROUTES //////////

// API to generate random motivation on Shuffle Button click
app.get('/result', function(req, res) {
    const user = req.user;
    
    if (user != undefined) {
        let onlyUser = {"owner.username": user.username};
        Motivation.findOneRandom(onlyUser, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send({ randomItem: result });
            }
        });
    } else {
        res.redirect('/login');
    }
    
});

// Home page
app.get('/', function(req, res){
    const user = req.user;

    if (user) {
        let onlyUser = {"owner.username": user.username};
        Motivation.findOneRandom(onlyUser, function(err, result) {
            if (result) {
                res.render('home', { randomItem: result, currentUser: req.user });
            } else if (!result){
                const noMotivationSeed = {
                    quote: 'Add some motivational quotes!',
                    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
                }
                res.render('home', { randomItem: noMotivationSeed, currentUser: req.user });
            } else if (err) {
                console.log(err);
            }
        });
    } else {
        const noUserSeed = {
            quote: 'Login and get it!',
            image: 'https://images.unsplash.com/photo-1497561813398-8fcc7a37b567?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
        }
        res.render('home', { randomItem: noUserSeed, currentUser: req.user });
    }
});

// Login and Sign Up Routes //////////

// Sign up page
app.get('/signup', function(req, res) {
    res.render('signUp', {currentUser: req.user});
});

// Handle sign up logic
app.post('/signup', function(req, res) {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('signup', {message: err.message});
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/');
        });
    });
});

// Login page
app.get('/login', function(req, res) {
    res.render('login', {currentUser: req.user});
});

// Handle login logic
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}), function(req, res) {
});

// Logout
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// Motivation Routes //////////

// Display all motivations
app.get('/list', function(req, res) {
    const user = req.user;
    if (user) {
        Motivation.find({"owner.username": user.username}, function(err, motivs) {
            if (!err) {
                res.render('list', {motivations: motivs, currentUser: req.user});
            }
        });
    } else {
        res.redirect('/login');
    }
});

// Add new motivation
app.post('/list', function(req, res){
    let newQuote = req.body.quote;
    let user = req.user;
    let newImage;
    let response = res;
    if (req.body.image !== '') {
        newImage = req.body.image;

        let newMotivation = {quote: newQuote, image: newImage, owner: user};

        Motivation.create(newMotivation, function(err, newMotiv){
            if (err){
                console.log(err);
            } else {
                response.redirect('/list');
                return newMotiv;
            }
        });
    } else {
        const onlyUser = {"owner.username": user.username};

        Image.findOneRandom(onlyUser, function(err, result) {
            if (result) {
                newImage = result.imageURL;
            } else if (!result) {
                newImage = '';
            } else if (err) {
                console.log(err);
            }

            const newMotivation = {quote: newQuote, image: newImage, owner: user};

            Motivation.create(newMotivation, function(err, newMotiv){
                if (err){
                    console.log(err);
                } else {
                    response.redirect('/list');
                    return newMotiv;
                }
            })
        });
    }
});

// Update motivation
app.put('/list/:id', function(req, res) {
    console.log(req.body.motivation);
    Motivation.findByIdAndUpdate(req.params.id, req.body.motivation, function(err, updatedMotivation) {
        if (!err) {
            res.redirect('/list');
        }
    });
});

// Delete motivation
app.delete('/list/:id', function(req, res) {
    Motivation.findByIdAndDelete(req.params.id, function(err) {
        if (!err) {
            res.redirect('/list');
        }
    });
});


// Default Image Routes /////////

// Default image page
app.get('/default-images', function(req, res) {
    let user = req.user;

    if (user) {
        Image.find({"owner.username": user.username}, function(err, img) {
            if (!err) {
                res.render('defaultImages', {images: img, currentUser: req.user});
            }
        });
    } else {
        res.redirect('/login');
    }
    
});

// Add new default image
app.post('/default-images', function(req, res) {
    let image = req.body.image;
    let user = req.user;

    let newImage = {imageURL: image, owner: user};

    Image.create(newImage, function(err, newImage) {
        if (!err) {
            res.redirect('/default-images');
        }
    });
});

// Update default image
app.put('/default-images/:id', function(req, res) {
    console.log(req.body.imageURL);
    Image.findByIdAndUpdate(req.params.id, req.body.imageUrl, function(err, updatedImage) {
        if (!err) {
            res.redirect('/default-images');
        }
    });
});

// Delete default image
app.delete('/default-images/:id', function(req, res) {
    Image.findByIdAndDelete(req.params.id, function(err) {
        if (!err) {
            res.redirect('/default-images');
        }
    });
});


app.listen(process.env.PORT || 7777, function(){
    console.log('MindRight server started');
});