import mongoose from 'mongoose'

export const Transaction = mongoose.model('Transaction', {
    sellerId: {
        type: String, 
        required: true
    },
    buyerId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productCount: {
        type: Number,
        required: true
    },
    productId: {
        type: String,
        required: true
    }
})