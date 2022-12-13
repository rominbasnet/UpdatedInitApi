import express, { Request, Response, NextFunction } from 'express';
import { Vendor, FoodDoc } from '../models';
export const GetFoodAvailability = async (req: Request, res:Response, next: NextFunction)=>{
	const pincode = req.params.pincode;
	const result  = await Vendor.find({pincode: pincode, serviceAvailable: false})
	.sort([['rating', 'descending']]) //sorting the query
	.populate('foods'); //filling the food collection.This will prevent showing default "id" collection.
	
	if(result.length > 0){
	 	return res.status(200).json(result)
	}

	return res.status(404).json({message:"Data not found"})

}
	
export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction)=>{
	const pincode = req.params.pincode;
	const result  = await Vendor.find({pincode: pincode, serviceAvailable: false})
	.sort([['rating', 'descending']])
	.limit(10)
	
	if(result.length > 0){
	 	return res.status(200).json(result)
	}

	return res.status(404).json({message:"Data not found"})
}

export const GetFoodsIn30Min = async (req:Request, res: Response, next: NextFunction) => {
	const pincode = req.params.pincode;
	const result = await Vendor.find({pincode:pincode, serviceAvailable: false})
	.populate('foods')

	if( result.length> 0){
		let foodResult:any = [];
		result.map(vendor =>{
			const foods = vendor.foods as [FoodDoc];
			foodResult.push(...foods.filter(food=>food.readyTime <=30));
	})
	}
}

export const SearchFoods = async (req:Request, res:Response, next:NextFunction) =>{
	const pincode = req.params.pincode;
	const result = await Vendor.find({ pincode:pincode, serviceAvailable: false})
	.populate('foods');

	if(result.length > 0){
		let foodResult: any = []; //"any" type for items of different types
		result.map( item =>{
			foodResult.push(...item.foods)
		});
		return res.status(400).json({message:"Data not found"});
	}
}

export const RestaurantById = async(req:Request, res: Response, next: NextFunction) =>{
	const id = req.params.id;
	const result = await Vendor.findById(id)
	.populate('foods')
	
	if(result){
		return res.status(200).json(result)
	}
	return res.status(400).json({ message:"Data not found"})
}