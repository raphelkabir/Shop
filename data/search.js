//INTERNAL LIBRARIES
import { Product } from '../data/models/product.js'
import { Category } from '../data/models/category.js'
import { Feature } from '../data/models/feature.js'

/*
keywords=123123213

&category=categoryId

&feature=id

&feature=id

&feature=id

&feature=id

*/

export async function search(keywords) {
    const values = keywords.split('&')
    let text, category
    let features = []

    try {
        for(let i = 0; i < values.legnth; i++) {
            const data = await getData(element)

            switch(data.name) {
                case 'content':
                if (text != undefined) {
                    new Error('invalid request')
                }
                text = data.value
                break

                case 'category':
                if (category != undefined) {
                    new Error('invalid request')
                }
                category = data.value
                break

                case 'feature':
                features.push(data.value)
                break
            }
        }

        return await findProducts(text, category, features)

    } catch(e) {
        return new Error('invalid request')
    }
}

async function getData(data) {
    const pair = data.split('=')
    const name = pair[0]
    const content = pair[1]

    switch(name) {
        case 'keywords':
            return {
                name: 'content',
                value: content
            }

        case 'category':
            return {
                name: 'category',
                value: await Category.findById(content)
            }

        case 'feature':
            return {
                name: 'feature',
                value: await Feature.findById(content)
            }
            
        default:
            return
    }
}

async function findProducts(text, category, features) {
    let filter = {}

    if (text) {
        filter = Object.assign({ name: { $regex: keywords, $options: "i" }}, filter)
    }
    if (category) {
        filter = Object.assign({ category: category.name.toLowerCase() }, filter)
    }
    if (features) {
        Product.find(filter).where('features')
        filter = Object.assign({ feature: { '$in': [features] }}, filter)
    }
    
    return await Product.find(filter)
}