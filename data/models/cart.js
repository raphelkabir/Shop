import mongoose from 'mongoose'

export const Cart = mongoose.model('Cart', {
    userId: {
        type: String,
        required: true
    },
    productIds: {
        type: [String]
    }
})