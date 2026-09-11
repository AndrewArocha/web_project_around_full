import express from 'express';
import cors from 'cors';
import Router from './routes/index.js'
import mongoose from 'mongoose';
import { errorHandler } from './middleware/error-handler.js';

const app = express();
const PORT = process.env.PORT || 3001;

//Mongoose connection setup
mongoose.connect('mongodb://127.0.0.1:27017/aroundb')
  .then(() => {
    console.info('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(cors({ origin: "http://localhost:3000" }));

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Temp auth with POSTMAN user
app.use((req, res, next) => {
  req.user = {
    _id: "6a882243b5291096ba30acee",
  };
  next();
});

// Routers
app.use(Router)

//404 Routes
app.use((req, res, next) => {
  next(Object.assign(new Error("Ruta no encontrada"), { statusCode: 404 }));
});

// Error handler middleware
app.use(errorHandler)

// Mount
app.listen(PORT, () => {
  console.info(`App listening on port ${PORT}`);
});