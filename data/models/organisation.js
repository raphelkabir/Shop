//THIRD-PARTY LIBRARIES
import mongoose from 'mongoose'

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        min: 0,
        default: 0
    }
})

export const Organisation = mongoose.model('Organisation', schema)