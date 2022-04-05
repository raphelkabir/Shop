//LIBRARIES THIRD-PARTY
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import bodyParser from 'body-parser'

//LIBRARIES PROPRIETARY
import registerAuthHandles from './router/auth.js'
import registerUserHandles from './router/user.js'
import registerProductHandles from './router/product.js'
import registerCartHandles from './router/cart.js'
import registerWebPagesHandles from './router/pages.js'

const app = express();
app.use(express.json())
app.use('/static', express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.json());

//WEB API
registerAuthHandles(app, passport)
registerUserHandles(app)
registerProductHandles(app)
registerCartHandles(app)

//WEB PAGES
registerWebPagesHandles(app)

async function main() {
    mongoose.connect(process.env.DATABASE_URL)
    app.listen(3000, () => {
        console.log('server started');
    })
}

app.post('/test', (req, res) => {
    console.log('HEHWAEHAWE')
    res.send()
})

main().then()