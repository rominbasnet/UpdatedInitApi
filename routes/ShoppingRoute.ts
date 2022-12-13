import express, { Request, Response, NextFunction } from 'express';
import { GetFoodAvailability, GetTopRestaurants, GetFoodsIn30Min, SearchFoods, RestaurantById } from '../controllers';	

const router = express.Router();

//Food Available
router.get('/:pincode', GetFoodAvailability);

router .get('/top-restaurants/:pincode', GetTopRestaurants);

router.get('/food-in-30-min/:pincode', GetFoodsIn30Min);

router.get('/search/:pincode', SearchFoods);

router.get('/restaurant/:id', RestaurantById);


export { router as ShoppingRoute };