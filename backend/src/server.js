import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userRouter } from './routes/User.routes.js';
import productRouter from './routes/Product.routes.js';
import { paymentRouter } from './routes/Payment.routes.js';
import { adminRouter } from './routes/Admin.routes.js';
dotenv.config();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.post('/api/v1/payment/webhook', express.raw({ type: 'application/json' }));

app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/admin', adminRouter);

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

mongoose.connect(process.env.MONGODB_CONNECTION_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    
    const migrateCartItems = async () => {
      try {
        const { UserModel } = await import('./models/User.models.js');
        const users = await UserModel.find({});
        
        for (const user of users) {
          if (Array.isArray(user.userCart) && user.userCart.length > 0) {
            if (typeof user.userCart[0] !== 'object' || !user.userCart[0].productId) {
              console.log(`Migrating cart for user ${user._id}`);
              
              const newCart = user.userCart.map(productId => ({
                productId,
                quantity: 1
              }));
              
              user.userCart = newCart;
              await user.save();
              
              console.log(`Migrated ${newCart.length} cart items for user ${user._id}`);
            }
          }
        }
        
        console.log('Cart migration completed');
      } catch (error) {
        console.error('Error migrating cart items:', error);
      }
    };
    
    migrateCartItems();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} - http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.log('Starting server without MongoDB connection...');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without DB) - http://localhost:${PORT}`);
    });
  });

export default app;
