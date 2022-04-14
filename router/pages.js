/*HANDLES WEB PAGES RELATED QUERIES AND 
ANYTHING THAT DOESN'T FIT OTHER FILES IN ROUTER*/

//THIRD PARTY LIBRARIES

//INTERNAL
import { ORGANISATION, CLIENT } from '../data/models/credential.js'
import { Product } from '../data/models/product.js'
import { Organisation } from '../data/models/organisation.js'
import { Client } from '../data/models/client.js'
import { getItemsOnCart } from '../router/cart.js'
import { Transaction } from '../data/models/transaction.js'
import { isClientLoggedIn, isOrganisationLoggedIn } from './auth.js'
import { search } from '../data/search.js'

export default function(app) {

    app.get('', async (req, res) => {
        const products = await Product.find(
            { name: { $regex: '', $options: "i" }}
        );

        if (req.isAuthenticated()) {
            const userId = req.session.passport.user.userId
            let name, userType
            if (req.session.passport.user.userType == ORGANISATION) {
                const organisation = await Organisation.findById(userId)
                name = organisation.name
                userType = 'ORGANISATION'
            } else if(req.session.passport.user.userType == CLIENT) {
                const client = await Client.findById(userId)
                name = client.name,
                userType = 'CLIENT'
            }
            res.render('index', {
                auth: true,
                name: name,
                products: products,
                userType: userType
            })
        }
        else {
            res.render('index', { auth: false, products: products})
        }
    })

    app.get('/search/:keywords', async (req, res) => {
        const keywords = req.params.keywords
        const products = await search(keywords)
            
        if (req.isAuthenticated()) {
            res.render('index', {
                auth: true, 
                email: req.session.passport.user.email,
                id: req.session.passport.user.id,
                products: products
            })
        }
        else {
            res.render('index', { auth: false, products: products })
        } 
    })
    
    app.get('/credential/organisation', (req, res) => {
        res.render('form-organisation')
    })
    
    app.get('/credential/client', (req, res) => {
        res.render('form-client')
    })
    
    app.get('/clientprofile', isClientLoggedIn, async function (req, res) {
        const transactions = await Transaction.find({originId: req.session.passport.user.id})
        transactions.reverse()

        res.render('profile', {
            auth: true,
            email: req.session.passport.user.email,
            id: req.session.passport.user.id,
            balance: wallet.balance,
            transactions: transactions
        })
    })

    app.get('/organisationprofile', isOrganisationLoggedIn, async function (req, res) {
        const transactions = await Transaction.find({originId: req.session.passport.user.id})
        transactions.reverse()

        res.render('profile', {
            auth: true,
            email: req.session.passport.user.email,
            id: req.session.passport.user.id,
            balance: wallet.balance,
            transactions: transactions
        })
    })

    app.get('/sell', isOrganisationLoggedIn, (req, res) => {
        res.render('sell', {
            auth: true,
            name: req.user.value.name
        })
    })

    app.get('/product/:id', async (req, res) => {
        const productId = req.params.id
        const foundProduct = await Product.findById(productId)
        
        let data = {
            name: foundProduct.name,
            description: foundProduct.description,
            auth: false
        }
    
        if (!req.isAuthenticated()) {
            res.render('product', data)
            return
        }

        data.auth = true
        data = Object.assign(data, {
            email: req.session.passport.user.email,
            id: req.session.passport.user.id
        });

        res.render('product', data)
    })

    app.get('/cart', isClientLoggedIn,async (req, res) => {
        const userId = req.session.passport.user.id
        const products = await getItemsOnCart(userId)
        res.render('cart', {
            auth: true,
            email: req.session.passport.user.email,
            id: userId,
            products: products
        })
    })
}