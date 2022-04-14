/*HANDLES USER RELATED QUERIES*/

//THIRD PARTY LIBRARIES

//INTERNAL
import { Transaction } from '../data/models/transaction.js'
import { isClientLoggedIn, isOrganisationLoggedIn } from './auth.js'

export default function(app) {

    app.get('api/client/transaction/:id', isClientLoggedIn, async (req, res) => {
        const clientId = req.params.id
        const foundTransactions = await Transaction.find({originId: clientId})

        res.status(200).send(foundTransactions)
    })

    app.get('api/organisation/transaction/:id', isOrganisationLoggedIn, async (req, res) => {
        const organisationId = req.params.id
        const foundTransactions = await Transaction.find({originId: organisationId})

        res.status(200).send(foundTransactions)
    })
}