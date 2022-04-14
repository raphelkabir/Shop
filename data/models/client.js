//THIRD-PARTY LIBRARIES
import mongoose from 'mongoose'

const schema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 1
    },
    lastName: {
        type: String,
        required: true,
        minLength: 1
    },
    balance: {
        type: Number,
        min: 0,
        default: 0
    }
})

export const Client = mongoose.model('Client', schema)