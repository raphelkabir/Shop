/*HANDLES WEB PAGES RELATED QUERIES AND 
ANYTHING THAT DOESN'T FIT OTHER FILES IN ROUTER*/

//THIRD PARTY LIBRARIES

//INTERNAL
import { Product } from '../data/models/product.js'
import { search } from '../router/product.js'
import { Transaction } from '../data/models/transaction.js'
import { Wallet } from '../data/models/wallet.js'
import { isLoggedIn } from './auth.js'

export default function(app) {
    app.get('', async (req, res) => {
        try {
            const products = await search()

            if (req.isAuthenticated()) {
                res.render('index', {
                    userOptions: true, 
                    email: req.session.passport.user.email,
                    id: req.session.passport.user.id,
                    products: products
                })
            }
            else {
                res.render('index', { userOptions: false, products: products})
            }

        } catch(e) {
            res.status(400).send()
            console.error('GET HOMEPAGE---------------------------------------------')
            console.error(e)
        }
    })

    app.get('/search/:keywords', async (req, res) => {
        try {
            const keywords = req.params.keywords
            const products = await search(keywords)
            
            if (req.isAuthenticated()) {
                res.render('index', {
                    userOptions: true, 
                    email: req.session.passport.user.email,
                    id: req.session.passport.user.id,
                    products: products
                })
            }
            else {
                res.render('index', { userOptions: false, products: products })
            }

        } catch(e) {
            res.status(400).send()
            console.error('GET SEARCHPAGE---------------------------------------------')
            console.error(e)
        }
    })
    
    app.get('/login', (req, res) => {
        res.render('login')
    })
    
    app.get('/signup', (req, res) => {
        res.render('signup')
    })
    
    app.get('/profile', isLoggedIn, async function (req, res) {
        try {
            const wallet = await Wallet.findOne({userId: req.session.passport.user.id})
            const transactions = await Transaction.find({buyerId: req.session.passport.user.id})
            transactions.reverse()

            res.render('profile', {
                userOptions: true,
                email: req.session.passport.user.email,
                id: req.session.passport.user.id,
                balance: wallet.balance,
                transactions: transactions
            })
        } catch(e) {
            res.status(400).send()
            console.error('GET LOGINPAGE---------------------------------------------')
            console.error(e)
        }
    })

    app.get('/sell', isLoggedIn, (req, res) => {
        try {
            res.render('sell', {
                userOptions: true,
                email: req.session.passport.user.email,
                id: req.session.passport.user.id
            })
        } catch(e) {
            res.status(400).send()
            console.error('GET SELLPAGE---------------------------------------------')
            console.error(e)
        }
    })

    app.get('/product/:id', async (req, res) => {
        try {
            const productId = req.params.id
            const foundProduct = await Product.findById(productId)

            let data = {
                name: foundProduct.name,
                description: foundProduct.description,
                userOptions: false
            }
        
            if (!req.isAuthenticated()) {
                res.render('product', data)
                return
            }
        
            //IF USER IS AUTHENTICATED
            data.userOptions = true
            data = Object.assign(data, {
                email: req.session.passport.user.email,
                id: req.session.passport.user.id
            });

            res.render('product', data)
        } catch(e) {
            res.status(400).send()
            console.error('GET PRODUCTPAGE---------------------------------------------')
            console.error(e)
        }
    })
}