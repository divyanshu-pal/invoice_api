import express from 'express';
import connectDB from './config/db';
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')
// // import productRoutes from './src/routes/product';
const  pdfGenerate =require( './routes/pdf');
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); 

const app = express();

// // Connect Database
 connectDB();

// // Init Middleware
const allowedOrigins = [
  'https://invoice-psi-seven.vercel.app',
  'https://invoice-api-31x7.onrender.com'
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// // Define Routes
 app.use('/api/auth',userRoutes);
 app.use('/api/products', productRoutes);
 app.use('/api/auth', pdfGenerate);

const PORT = process.env.PORT || 5000;

app.get('/',(_,res)=>{
    res.send("<h1>hello your server is ready</h1>");
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
