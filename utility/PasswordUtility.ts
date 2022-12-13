import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { VendorPayload } from '../dto';
import { APP_SECRET } from '../config';
import { AuthPayload } from '../dto/Auth.dto';

export const GenerateSalt = async () => {
	 return await bcrypt.genSalt();
}

export const GeneratePassword = async (password: string, salt: string)=>{
	return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async(enteredPassword: string, savedPassword: string, salt: string)=>{
	return await GeneratePassword(enteredPassword, salt) === savedPassword;
}

export const GenerateSignature = (payload: AuthPayload)=>{
	return jwt.sign(payload, APP_SECRET,{ expiresIn: '1d'});
}

export const  ValidateSignature = async (req:Request | any)=>{ //"any" type needed as optional parameter
	const signature = req.get('Authorization'); //req.headers.authorization
	//console.log(signature) //signature is of form "Bearer eyJhch.fgfdg.dfgdf.dfgdfg"
	

	if(signature){

		const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload;
		req.user = payload;

		return true;

	}

	return false;
}
