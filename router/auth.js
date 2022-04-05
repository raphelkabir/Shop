/*HANDLES AUTHENTICATION RELATED QUERIES*/

//LIBRARIES THIRD PARTY
import LocalStrategy from 'passport-local'
import session from 'express-session'
import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'

//INTERNAL
import { User } from '../data/models/user.js';
import { Wallet } from '../data/models/wallet.js';

export default function(app, passport) {

    app.use(bodyParser.json()); 
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        secret: 'crackalackin',
        resave: true,
        saveUninitialized: true,
        cookie : { secure : false, maxAge : (86400000) }, // 24 hours
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        const userData = {
            id: user.id,
            email: user.email
        }
        done(null, userData);
    });
    passport.deserializeUser(async function (user, done) {
        const foundUser = await User.findById(user.id)
        done(null, foundUser);
    });

    passport.use('local-login', new LocalStrategy(async function(username, password, done) {
        const foundUser = await User.findOne({email: username})
        if (foundUser == undefined) {
            return done(null, false, {message: 'email and/or password invalid'})
        }
        if(bcrypt.compare(foundUser.password, password)) {
            return done(null, foundUser)
        }

        return done(null, false, {"message": "User not found."})
    }));

    app.post('/api/auth/signup', async (req, res) => {
        try {
            if (req.body.email == undefined || req.body.email =='') {
                res.status(400).send('missing or invalid email')
                return
            }
            if (req.body.password == undefined || req.body.password =='') {
                res.status(400).send('missing or invalid password')
                return
            }

            const user = new User({
                displayname: req.body.email,
                email: req.body.email.toLowerCase(),
                password: await hash(req.body.password)
            })
            await user.save()

            const wallet = new Wallet({
                userId: user.id
            })
            await wallet.save()
            
            res.status(200).send()
        } catch(e) {
            res.status(400).send()
            console.error('POST SIGNUP---------------------------------------------')
            console.error(e)
        }
    })

    app.post('/api/auth/login', passport.authenticate('local-login', { failureRedirect: '/login' }), async function(req, res) {
        res.status(200).send()
    })

    app.get('/api/auth/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}

export function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

async function hash(password) {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)  
}