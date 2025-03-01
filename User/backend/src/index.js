const express = require('express');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');

const app = express();

app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 