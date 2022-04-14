import mongoose from 'mongoose'

/*ONLY CLIENT OF TYPE SELLER CAN CREATE PRODUCT*/

import { Organisation } from './organisation.js'

const schema = mongoose.Schema({
    sellerId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    featuresId: {
        type: [String],
        required: true
    },
    thumbnail: {
        type: Buffer,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    } 
})

schema.pre('save', function() {
    Organisation.findById(this.sellerId).then(client => {
        if (client == undefined) {
            throw new Error('invalid sellerId')
        }
    })
})

export const Product = mongoose.model('Product', schema)