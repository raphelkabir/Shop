import mongoose from 'mongoose'

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    value: {
        type: String,
        required: true,
        lowercase: true,
    }
})

export const Feature = mongoose.model('Feature', schema)