import mongoose from 'mongoose'

export const Product = mongoose.model('Product', {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    }
})