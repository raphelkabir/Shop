/*HANDLES AUTHENTICATION RELATED QUERIES*/

//LIBRARIES THIRD PARTY
import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'

//INTERNAL
import { Credential, ORGANISATION, CLIENT } from '../data/models/credential.js';
import { Client } from '../data/models/client.js';
import { Organisation } from '../data/models/organisation.js';


export default function(app, passport) {
    
    passport.serializeUser(function (user, done) {
        if (user.userType == ORGANISATION) {
            Organisation.findById(user.userId).then(organisation =>{
                done(null, { userType: user.userType, userId: organisation.id })
            })
        } else if (user.userType == CLIENT) {
            Client.findById(user.userId).then(client =>{
                done(null, { userType: user.userType, userId: client.id })
            })
        } else {
            throw new Error('Cant resolve userType')
        }
    });

    passport.deserializeUser(async function (user, done) {
        if (user.userType == ORGANISATION) {
            Organisation.findById(user.userId).then(organisation => {
                done(null, { userType: user.userType, value: organisation })
            })
        } else if (user.userType == CLIENT) {
            Client.findById(user.userId).then(client => {
                done(null, { userType: user.userType, value: client })
            })
        }
        else {
            throw new Error('Cant resolve userType')
        }
    });

    passport.use('local-login', new LocalStrategy(async function(username, password, done) {
        const credential = await Credential.findOne({email: username})
        if (credential == undefined) {
            return done(null, false, {message: 'email and/or password invalid'})
        }
        if(bcrypt.compare(credential.password, password)) {
            return done(null, { userType: credential.userType, userId: credential.userId })
        }

        return done(null, false, {"message": "email and/or password invalid"})
    }));

    app.post('/api/auth/client/login', 
        passport.authenticate('local-login', {failureRedirect: '/credential/organisation', successRedirect: '/' }), async function(req, res) {
        res.status(200).send()
    })

    app.post('/api/auth/client/signup', async (req, res) => {
        let client, credential
        try {
            client = new Client({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
            })
            await client.save()

            credential = new Credential({
                email: req.body.email,
                password: await hash(req.body.password),
                userType: CLIENT,
                userId: client.id
            })
            await credential.save()
    
            res.status(200).send()

        } catch(e) {
            if (client) organisation.delete({ _id: client.id })
            if (credential) credential.delete({ _id: credential.id })
            res.status(400).send(e)
            console.error(e)
        }
    })

    app.post('/api/auth/organisation/login', 
        passport.authenticate('local-login', {failureRedirect: '/credential/organisation', successRedirect: '/'}), async function(req, res) {
    })

    app.post('/api/auth/organisation/signup', async (req, res) => {
        let organisation, credential
        try {
            organisation = new Organisation({
                name: req.body.name,
            })
            await organisation.save()

            credential = new Credential({
                email: req.body.email,
                password: await hash(req.body.password),
                userType: ORGANISATION,
                userId: organisation.id
            })
            await credential.save()
    
            res.redirect('/')
        } catch(e) {
            if (organisation) organisation.delete({ _id: organisation.id })
            if (credential) credential.delete({ _id: credential.id })
            res.redirect('/credential/organisation/')
            console.error(e)
        }
    })

    app.get('/api/auth/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}

export function isClientLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/credential/client')
    } else if (req.user.userType != CLIENT) {
        req.logout()
        res.redirect('/credential/client')
    } else {
        next()
    }
}

export function isOrganisationLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/credential/organisation')
    } else if (req.user.userType != ORGANISATION) {
        req.logout()
        res.redirect('/credential/organisation')
    } else {
        next()
    }
}

async function hash(password) {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)  
}