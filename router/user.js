/*HANDLES USER RELATED QUERIES*/

//THIRD PARTY LIBRARIES

//INTERNAL
import { User } from '../data/models/user.js'
import { Wallet } from '../data/models/wallet.js'
import { Transaction } from '../data/models/transaction.js'
import { Cart } from '../data/models/cart.js'
import { isLoggedIn } from './auth.js'

export default function(app) {

    app.get('/api/user/find/:id', async (req, res) => {
        try {
            const userId = req.params.id
            const foundUser = await User.findById(userId)

            const foundWallet = await Wallet.findOne({userId: userId})
            
            const result = {
                displayname: foundUser.email,
                email: foundUser.email.toLowerCase(),
                balance: foundWallet.balance
            }

            if (foundUser == undefined) {
                res.status(404).send('Can\'t find user')
            }
            else {
                res.status(200).send(result)
            }

        } catch(e) {
            res.status(400).send()
            console.error('GET FIND USER---------------------------------------------')
            console.error(e)
        }
    })

    app.get('api/user/paymenthistory/:id', isLoggedIn, async (req, res) => {
        try {
            const userId = req.params.id
            const foundTransactions = await Transaction.find({userId: userId})

            res.status(200).send(foundTransactions)
            
        } catch(e) {
            res.status(400).send()
            console.error('GET PAYMENT HISTORY---------------------------------------------')
            console.errot(e)
        }
    })
}