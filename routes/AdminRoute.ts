import express, { Request, Response, NextFunction } from 'express';
import { CreateVendor, GetVendor, GetVendorID } from '../controllers';


const router= express.Router();

router.post('/vendor', CreateVendor); //creating vendor

router.get('/vendors', GetVendor); //getting all vendor list

router.post('/vendor/:id', GetVendorID); //getting vendor detail based on ID

router.get('/',(req: Request,res: Response, next: NextFunction) =>{
	res.json({message:"Hello from Admin"})
});

export { router as AdminRoute}; 

