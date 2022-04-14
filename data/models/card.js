import mongoose from 'mongoose'

/*EACH CLIENT OF TYPE BUYER MUST HAS A CARD*/

const schema = mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    number: {
        type: Number,
        required: true,
        minLength: 16,
        maxLength: 16
    },
    cardholderName: {
        type: String,
        required: true,
        minLength: 1
    }
})

schema.pre('save', function() {
    Client.findById(this.clientId).then(client => {
        if (client == undefined || client.type != 'buyer') {
            throw new Error('invalid clientId')
        }
    })
})

export const Card = mongoose.model('Card', schema)