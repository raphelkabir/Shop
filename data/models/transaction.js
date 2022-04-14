import mongoose from 'mongoose'

/* ORIGIN/DESTINATION POSSIBLE COMBINATIONS:

CARD -> BUYER
BUYER -> SELLER

WHERE
CARD REFERS TO data/models/card.js
BUYER AND SELLER REFERS TO -> data/models/user.js */

export const schema = mongoose.Schema({

    //ORIGIN
    originId: {
        type: String, 
        required: true
    },

    //DESTINATION
    destinationId: {
        type: String,
        required: true
    },

    //PRODUCT
    productId: {
        type: String,
        required: true
    },
    productCount: {
        type: Number,
        required: true,
        min: 0
    },

    //EXTRA
    value: {
        type: Number,
        required: true,
        min: 1
    }
})

schema.pre('save', function() {
    Client.findById(this.originId).then(client => {
        if (client == undefined) {
            throw new Error('invalid originId')
        }
    })
    Client.findById(this.destinationId).then(client => {
        if (client == undefined) {
            throw new Error('invalid destinationId')
        }
    })
})

export const Transaction = mongoose.model('Transaction', schema)