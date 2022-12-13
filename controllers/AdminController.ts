import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { CreateVendorInput } from '../dto';
import { Vendor } from '../models';
import { GenerateSalt, GeneratePassword } from '../utility';

export const FindVendor = async(id:string | undefined, email?: string)=>{
	if(email){
		return await Vendor.findOne({ email:email });
	}
  else
  {
    return await Vendor.findById(id);
	}
}

export const CreateVendor = async(req:Request, res: Response, next: NextFunction)=>{
	const { name, address, pincode ,foodType, email, password, ownerName, phone } = <CreateVendorInput>req.body;
	
	const existingVendor = await FindVendor('', email);
	
	if(existingVendor !== null){
		return res.json({"message":"A vendor exists with this email id"})
	} 
	
	const salt = await GenerateSalt();
	const userPassword = await GeneratePassword(password, salt);
	
	const createdVendor  = await Vendor.create({
		name: name,
		address: address,
		pincode: pincode,
		foodType: foodType,
		email: email,
		password: userPassword,
		salt: salt,
		ownerName: ownerName,
		phone: phone,
		rating: 0,
		serviceAvailable: false,
		coverImages: []
	})

	return res.json(createdVendor);
} 	

export const GetVendor = async(req:Request, res: Response, next: NextFunction)=>{
	const vendors = await Vendor.find();

	if(vendors !== null){
		return res.json(vendors)
	}

	return res.json({"message":"Vendors data not available"})
} 

export const GetVendorID = async(req:Request, res: Response, next: NextFunction)=>{
	const vendorId = req.params.id;

	if(mongoose.isValidObjectId(vendorId)){		
		const vendor = await Vendor.findById(vendorId);
	
		if(vendor !== null){
			return res.json(vendor);
    }
		else{
			return res.json({"message":"Vendors data not available"})
    }

	}
	else res.end("Invalid Id");	   //res.end() for error handling
}
