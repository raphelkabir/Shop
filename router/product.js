/*HANDLES PRODUCT RELATED QUERIES*/

//THIRD PARTY LIBRARIES
import multer from 'multer'

//INTERNAL
import { Product } from '../data/models/product.js'
import { Transaction } from '../data/models/transaction.js'
import { isClientLoggedIn, isOrganisationLoggedIn } from './auth.js'
import { Client } from '../data/models/client.js'

export default function(app) {

    app.post('/api/product/sell', isOrganisationLoggedIn, upload.single('image'), async (req, res) => {
        let product
        try {
            const productName =  req.body.name
            const productPrice = req.body.price 
            const productDescription = req.body.description
            const productStock = req.body.stock
            const sellerId = req.session.passport.user.userId

            product = new Product({
                name: productName,
                description: productDescription,
                price: productPrice,
                stock: productStock,
                sellerId: sellerId,
                thumbnail: req.file.buffer.toString('base64')
            })
            await product.save()
            res.redirect('/')
        } catch(e) {
            res.status(400).send(e)
            console.error(e)
        }
    })

    app.get('/api/product/getall', async (req, res) => {
        const result = await Product.find()
        res.status(200).send(result)
    })

    app.get('/api/product/find/:id', async (req, res) => {
        const productId = req.params.id
        const foundProduct = await Product.findById(productId)
            
        if (foundProduct == undefined) {
            res.status(404).send('Can\'t find product')
            return
        } else {
            res.status(200).send(foundProduct)
            console.error(e)
        }
    })

    app.post('/api/product/buy', isClientLoggedIn, async (req, res) => {
        try {
            const clientId = req.session.passport.user.id
            const client = await Client.findById(clientId)
    
            const productId = req.body.productId
            const foundProduct = await Product.findById(productId)
            if (foundProduct == undefined) {
                res.status(400).send('invalid productId')
                return
            }
            const count = req.body.count
            if (count == 0 || foundProduct.stock < count) {
                res.status(400).send('Invalid count')
                return
            }
    
            const totalPrice = foundProduct.price * count
            client.balance -= totalPrice
            foundProduct.stock -= count
    
            const transaction = new Transaction({
                originId: client._id,
                destinationId: foundProduct.sellerId,
                productName: foundProduct.name,
                productPrice: foundProduct.price,
                productCount: count,
                productId: foundProduct._id
            })
            
            await foundProduct.save()
            await transaction.save()
                
            res.redirect('/')
        } catch(e) {
            res.status(400).send(e)
        }
    })
}

const upload = multer({  })