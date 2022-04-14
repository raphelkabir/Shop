//LIBRARIES THIRD-PARTY
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import bodyParser from 'body-parser'
import session from 'express-session'

//LIBRARIES PROPRIETARY
import authentication from './router/auth.js'
import transaction from './router/transaction.js'
import product from './router/product.js'
import cart from './router/cart.js'
import pages from './router/pages.js'

const app = express()
app.use(express.json())
app.use('/static', express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'crackalackin',
    resave: true,
    saveUninitialized: true,
    cookie : { secure : false, maxAge : (86400000) }, // 24 hours
}))
app.use(passport.initialize())
app.use(passport.session())

//INTIZIALISATION ENDPOINTS
authentication(app, passport)
transaction(app)
product(app)
cart(app)
pages(app)

import multer from 'multer'
const upload = multer({  })
app.post('/stats', upload.single('image'), function (req, res) {
   // req.file is the name of your file in the form above, here 'uploaded_file'
   // req.body will hold the text fields, if there were any 
   console.log(req.file, req.body)
});

async function main() {
    try {
        mongoose.connect(process.env.DATABASE_URL)
        app.listen(3000, () => {
        console.log('server started');
        })
    } catch(e) {
        console.error(e)
    }
}

main().then()