import { Request, Response, NextFunction } from 'express';
import { VendorLoginInputs, EditVendorInputs, CreateFoodInputs } from '../dto';
import { Food } from '../models';
import { GenerateSignature, ValidatePassword } from '../utility';
import { FindVendor } from './AdminController';
import fileUpload from 'express-fileupload';

export const VendorLogin = async(req:Request, res:Response, next:NextFunction) =>{
	
	const { email, password } = <VendorLoginInputs>req.body;
	const existingVendor = await FindVendor('', email); 
	if(existingVendor !== null){
		const validation = await ValidatePassword(password, existingVendor.password, existingVendor.salt);
		
		if(validation){

			const signature = GenerateSignature({
				_id: existingVendor.id,
				email: existingVendor.email,
				foodType: existingVendor.foodType,
				name:existingVendor.name
			})
			// return res.status(200).json({
        // signature
      // });
      return res.status(200).json({
          signature,
          roles: existingVendor.name
      })
		}
		else {
			return res.status(403).json({"message":"Password is not valid", "status": 490});
		}
	}
	return res.status(404).json({"message":"Login credentials not valid"});
}	

export const GetVendorProfile = async(req:Request | any, res:Response, next:NextFunction)=>{
	const user = req.user;
	
	if(user){
		const existingVendor = await FindVendor(user._id);

		return res.json(existingVendor);
	}

	return res.json({"message":"Vendor info not found"});
}

export const UpdateVendorProfile = async(req:Request, res:Response, next: NextFunction)=>{
	
	const { foodTypes, name, address, phone } = <EditVendorInputs>req.body;
	
	const user = req.user;
	
	if(user){
		const existingVendor = await FindVendor(user._id);

		if(existingVendor !== null){
			existingVendor.name = name;
			existingVendor.address = address;
			existingVendor.phone = phone;
			existingVendor.foodType = foodTypes;

			const savedResult = await existingVendor.save();
			return res.json(savedResult);
		}
	}
	return res.json({"message":"Vendor info not found"});
}

export const UpdateVendorService = async(req:Request, res:Response, next:NextFunction)=>{
	const user = req.user;
	
	if(user){
		const existingVendor = await FindVendor(user._id);

		if(existingVendor !== null){
			existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
			const savedResult = await existingVendor.save();
			return res.json(savedResult);
				
		}
	}

	return res.json({"message":"Vendor info not found"});
}

export const AddFood= async(req:Request, res:Response, next:NextFunction)=>{
	const user = req.user;
	
	if(user){
		
		const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;
		const vendor = await FindVendor(user._id);

		if(vendor !== null){
			const files = req.files as fileUpload.FileArray; //req.files returns the list of all files sent to the server from client.
			const file = files.images as  fileUpload.UploadedFile; //req.files.images return all the files sent by using name="image" in input tag.E.g.<input name="images" type="file" />
			
			if (Array.isArray(file)){
			const images = file.map(singleFile =>{
				singleFile.mv('./images/' + singleFile.name)
				return singleFile.name
			}) as [string];				
			const createdFood = await Food.create({
				vendorId: vendor._id,
				name: name,
				description: description,
				category: category,
				foodType: foodType,
				images: images,
				readyTime: readyTime,
				price: price,
				rating: 0
			})
			
			vendor.foods.push(createdFood);
			const result = await vendor.save();
			
			return res.json(result);	
		}
		else
		{
			file.mv('./images/' + file.name);
			const image = file.name as string;
			const createdFood = await Food.create({
				vendorId: vendor._id,
				name: name,
				description: description,
				category: category,
				foodType: foodType,
				images: [image],
				readyTime: readyTime,
				price: price,
				rating: 0
			})	
			vendor.foods.push(createdFood);
			const result = await vendor.save();
		
			return res.json(result);
		}
	}
}
	return res.json({"message":"Something went wrong"});
}

export const UpdateVendorCoverImage = async (req: Request, res: Response, next: NextFunction)=>{
	const user = req.user;	
	if(user){
		const vendor = await FindVendor(user._id);

		if(vendor !== null){
			const files = req.files as fileUpload.FileArray; //req.files returns the list of all files sent to the server from client.
			const file = files.images as  fileUpload.UploadedFile; //req.files.images return all the files sent by using name="image" in input tag.E.g.<input name="images" type="file" />
			
			if (Array.isArray(file)){
			const images = file.map(singleFile =>{
				singleFile.mv('./images/' + singleFile.name);
				return singleFile.name;
			}) as [string];		
			vendor.coverImages.push(...images);
			const result = await vendor.save();
			
			return res.json(result);	
		}
		else
		{
			file.mv('./images/' + file.name);
			const image = [file.name] as [string];
			vendor.coverImages.push(...image)
			const result = await vendor.save();
		
			return res.json(result);
		}
	}
}
}

export const GetFoods = async(req:Request, res:Response, next:NextFunction)=>{
	const user = req.user;
	
	if(user){
		const foods = await Food.find({ vendorId: user._id})
		if(foods !== null){
			return res.json(foods)
		}
	}

	return res.json({"message":"Foods info not found"});
}

