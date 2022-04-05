/*HANDLES PRODUCT RELATED QUERIES*/

//THIRD PARTY LIBRARIES

//INTERNAL
import { Product } from '../data/models/product.js'
import { Transaction } from '../data/models/transaction.js'
import { User } from '../data/models/user.js'
import { Wallet } from '../data/models/wallet.js'
import { isLoggedIn } from './auth.js'
import multer from 'multer'

export default function(app) {

    app.post('/api/product/sell', isLoggedIn, upload.single('image'), async (req, res) => {
        try {
            if (req.body.name == undefined) {
                res.status(400).send('missing name')
                return
            }
            if (req.body.price == undefined || typeof(req.body.price) != 'number') {
                res.status(400).send('missing or invalid price')
                return
            }
            if (req.body.stock == undefined || typeof(req.body.stock) != 'number') {
                res.status(400).send('missing or invalid stock')
                return
            }
            
            const product = new Product({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                stock: req.body.stock,
                sellerId: req.session.passport.user.id
            })
            await product.save()
            res.status(200).send()

        } catch(e) {
            res.status(400).send()
            console.error('POST SELL PRODUCT---------------------------------------------')
            console.error(e)
        }
    })

    app.get('/api/product/getall', async (req, res) => {
        try {
            const result = await Product.find()
            res.status(200).send(result)

        } catch(e) {
            res.status(400).send()
            console.error('POST GET ALL PRODUCTS---------------------------------------------')
            console.error(e)
        }
    })

    app.get('/api/product/find/:id', async (req, res) => {
        try {
            const productId = req.params.id
            const foundProduct = await Product.findById(productId)
            
            if (foundProduct == undefined) {
                res.status(404).send('Can\'t find product')
                return
            }

            res.status(200).send(foundProduct)

        } catch(e) {
            res.status(400).send()
            console.error('GET PRODUCT BY ID---------------------------------------------')
            console.error(e)
        }
    })

    app.post('/api/product/buy', isLoggedIn, async (req, res) => {
        try {
            const userId = req.session.passport.user.id
            const productId = req.body.productId
            const count = req.body.count

            const foundUser = await User.findById(userId)
            const foundProduct = await Product.findById(productId)
            const foundWallet = await Wallet.findOne({userId: userId})

            if (foundUser == undefined || foundProduct == undefined) {
                res.status(404).send('Invalid userId or productId')
                return
            }
            if (count == 0 || foundProduct.stock < count) {
                res.status(400).send('Invalid count')
                return
            }

            const totalPrice = foundProduct.price * count
            foundWallet.balance -= totalPrice
            foundProduct.stock -= count

            const transaction = new Transaction({
                buyerId: foundUser._id,
                sellerId: foundProduct.sellerId,
                productName: foundProduct.name,
                productPrice: foundProduct.price,
                productCount: count,
                productId: foundProduct._id
            })

            await foundWallet.save()
            await foundProduct.save()
            await transaction.save()
            
            res.redirect('/')
        } catch(e) {
            res.status(400).send()
            console.error('POST BUY PRODUCT---------------------------------------------')
            console.error(e)
        }
    })
}

export async function search(keywords) {
    try {
        if (keywords == undefined) {
            return await Product.find()
        }

        const foundProducts = await Product.find(
            { name: { $regex: keywords, $options: "i" }}
        );

        return foundProducts
    } catch(e) {
        console.error(e)
    }
}

const upload = multer({
    limits: {
        fileSize: 1024 * 10
    },
    fileFilter: function(req, file, cb) {
        if (file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error('Upload either jpeg, jpeg or png'))
        }

        cb(undefined, true)
    }
})