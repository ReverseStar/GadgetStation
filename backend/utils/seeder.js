const Product = require('../models/product')
const dotenv = require('dotenv')
const connetDatabase = require('../config/database')
const products = require('../data/products')

//Setting the .env file
dotenv.config({path:'backend/config/config.env'})

connetDatabase()

const seedProducts = async() => {
    try{
        await Product.deleteMany()
        console.log('Products are deleted.')

        await Product.insertMany(products)
        console.log('All products are added.');
        process.exit()

    }catch(error){
        console.log(error.message);
        process.exit()
    }
}

seedProducts()