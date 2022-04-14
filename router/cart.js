/*HANDLES CART RELATED QUERIES*/

//THIRD PARTY LIBRARIES

//INTERNAL
import { isClientLoggedIn } from './auth.js'
import { Product } from '../data/models/product.js'
import { Cart } from '../data/models/cart.js'

export default function(app) {

    app.post('/api/cart/add', isClientLoggedIn, async (req, res) => {
        let cart
        try {
            const clientId =  req.session.passport.user.id
            const productId = req.body.productId

            cart = new Cart({
                clientId: clientId,
                productId: productId
            })
            await cart.save()

            res.status(200).send()
        } catch(e) {
            console.error(e)
        }
    })

    app.post('/api/cart/remove', isClientLoggedIn, async (req, res) => {
        const productId =  req.body.productId
        const clientId =  req.session.passport.user.id

        await Cart.deleteOne({
            userId: clientId,
            productId: productId
        })
    })
}

export async function getItemsOnCart(clientId) {
    const foundProducts = []
    const items = await Cart.find({clientId: clientId})

    for(let i = 0; i < items.length; i++) {
        const product = await Product.findById(items[i].productId)
        foundProducts.push(product)
    }
    
    return foundProducts
}