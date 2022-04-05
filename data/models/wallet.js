import mongoose from 'mongoose'

export const Wallet = mongoose.model('Wallet', {
    balance: {
        type: Number,
        default: 0
    },
    userId: {
        type: String,
        required: true
    }
})