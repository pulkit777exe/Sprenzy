import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    imageUrl: {
        type: String,
        required: true
    },
    additionalImages: {
        type: [String],
        default: []
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 10
    },
    featured: {
        type: Boolean,
        default: false
    },
    amazonUrl: {
        type: String
    },
    specifications: {
        type: [
            {
                name: String,
                value: String
            }
        ],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Add index for better search performance
productSchema.index({ title: 'text', description: 'text', category: 'text', brand: 'text' });

export const ProductModel = mongoose.model('Product', productSchema);