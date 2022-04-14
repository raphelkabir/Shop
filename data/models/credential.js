import mongoose from 'mongoose'

/*MONGOOSE SHOULDN'T BE ALLOWED TO POPULATE() CREDENTIAL*/

export const ORGANISATION = 'organisation', CLIENT = 'client'

const schema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: [ORGANISATION, CLIENT],
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

export const Credential = mongoose.model('Credential', schema)