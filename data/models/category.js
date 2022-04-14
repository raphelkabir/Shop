import mongoose from 'mongoose'

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    }
})

export const Category = mongoose.model('Category', schema)