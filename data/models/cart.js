import mongoose from 'mongoose'

/*ONLY CLIENT OF TYPE BUYER CAN HAVE A CART OBJECT*/

const schema = mongoose.Schema({
    clientId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    }
})

schema.post('save', function() {
    Client.findById(this.clientId).then(client => {
        if (client == undefined || client.type != 'buyer') {
            throw new Error('invalid clientId')
        }
    })
    Product.findById(this.productId).then(product => {
        if (product == undefined) {
            throw new Error('invalid productId')
        }
    })
})

export const Cart = mongoose.model('Cart', schema)