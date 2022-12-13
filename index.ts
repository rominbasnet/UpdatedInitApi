import express from 'express';
import  bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import {AdminRoute, VendorRoute, ShoppingRoute, CustomerRoute } from './routes';
import { MONGO_URI } from './config';

const app = express();
app.use(cors({
  origin: "http://127.0.0.1:5173"
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/admin', AdminRoute);
app.use('/vendor',VendorRoute);
app.use('/customer', CustomerRoute);
app.use(ShoppingRoute);

mongoose.connect(MONGO_URI)
.then(result=>{
	console.log("Database is working!!!")
}).catch(err=> console.log('error'+ err));

app.listen(8000,()=>{
	console.clear();
	console.log("App is listening on port 8000");
});
