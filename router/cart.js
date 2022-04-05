/*HANDLES CART RELATED QUERIES*/

//THIRD PARTY LIBRARIES

//INTERNAL
import { isLoggedIn } from './auth.js'

export default function(app) { 
    app.post('/api/cart/add', isLoggedIn, async (req, res) => {
        try {

        } catch(e) {
            
        }
    })
}