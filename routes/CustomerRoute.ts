import express, { Request, Response, NextFunction} from 'express';
import { Authenticate } from '../middleware';
import { CustomerSignUp, CustomerVerify, CustomerLogin, RequestOtp, GetCustomerProfile, EditCustomerProfile } from '../controllers';	

const router = express.Router();

router.post('/signup', CustomerSignUp);

router.use(Authenticate)

router.post('/login', CustomerLogin);

router.patch('/verify', CustomerVerify);

router.get('/otp', RequestOtp);

router.get('/profile', GetCustomerProfile);

router.patch('/profile', EditCustomerProfile);

export { router as CustomerRoute};