import express, { Request, Response, NextFunction } from 'express';
import { AddFood, VendorLogin, GetVendorProfile, UpdateVendorProfile, UpdateVendorService, GetFoods, UpdateVendorCoverImage } from '../controllers';	
import { Authenticate } from '../middleware';
import fileUpload from 'express-fileupload';

const router= express.Router();
router.post('/login',VendorLogin);
router.use(Authenticate);
router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/coverImage', fileUpload({createParentPath:true}), UpdateVendorCoverImage);
router.patch('/service', UpdateVendorService);
router.post('/food', fileUpload({createParentPath:true}), AddFood);
router.get('/foods', GetFoods);

router.get('/',(req: Request,res: Response, next: NextFunction) =>{
	res.json({message:"Hello from Vendor"})
});

export { router as VendorRoute};
