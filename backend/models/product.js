const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please enter a product name.']
    },

    price: {
        type: Number,
        required: [true, 'Please Enter a product price.'],
        maxLength: [5, 'Product price cannot exceed 5 digits.'],
        default: 0.0
    },

    description: {
        type: String,
        required: [true, 'Please Enter a product description.'],
    },

    ratings: {
        type: Number,
        default: 0
    },
    images:
        [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],

    category: {
        type: String,
        required: [true, 'Please select a category for this product'],
        enum: {
            values: [
                'Electronics',
                'Camera',
                'Laptop',
                'Accessories',
                'Headphones',
                'Foods',
                'Books',
                'Cloths and Shoes',
                'Beauty and Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: 'Please select a valid category for this product'
        }
    },

    seller: {
        type: String,
        required: [true, 'Please select product seller'],
    },
    stock: {
        type: String,
        required: [true, 'Please enter product availability'],
        maxLength: [5, 'Product name cannot exceed 5 characters.'],
        default: 0
    },
    numofReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref:'User',
                required: true 
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Product', productSchema)
