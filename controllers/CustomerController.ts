import express, {Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCustomerInputs, UserLoginInputs, EditCustomerProfileInputs } from '../dto';
import { Customer } from '../models';
import { GenerateSalt, GeneratePassword, GenerateOtp, onOtpRequest, GenerateSignature, ValidatePassword } from '../utility';

export const CustomerSignUp = async(req:Request, res: Response, next:NextFunction)=>{
	const customerInputs = plainToClass(CreateCustomerInputs, req.body);
	const inputErrors = await validate(customerInputs, { validationError: { target: true}});

	if(inputErrors.length > 0){
		return res.status(400).json(inputErrors);
	}
	const {email, phone, password} = customerInputs;
	const salt = await GenerateSalt();
	const userPassword = await GeneratePassword(password, salt);
	const {otp, expiry} = GenerateOtp();

	

	const result = await Customer.create({
		email: email,
		password: userPassword,
		salt: salt,
		phone: phone,
		otp: otp,
		otp_expiry: expiry,
		firstName: '',
		lastName: '',
		address: '',
		verified: false,
		lat: 0,
		lng:0
	})

	if(result){
		await onOtpRequest(otp, phone);
		const signature = GenerateSignature({
			_id: result._id,
			email: result.email,
			verified: result.verified
		})
	return res.status(201).json({ signature: signature, verified: result.verified, email: result.email });
	}
	return res.status(400).json({ message: "Signup Error"})

}

export const CustomerLogin = async(req:Request, res: Response, next:NextFunction)=>{
	const loginInputs = plainToClass( UserLoginInputs, req.body);
	const loginErrors = await validate(loginInputs, { validationError: {target: false} })

	if(loginErrors.length > 0){
		return res.status(400).json(loginErrors);
	}
	const { email, password } = req.body;
	const customer = await Customer.findOne({ email: email})
	
	if(customer){
		const validated = await ValidatePassword(password, customer.password, customer.salt)
	
		if(validated){
			const signature = GenerateSignature({
				_id: customer._id,
				email: customer.email,
				verified: customer.verified
			})
			return res.status(200).json({
					signature: signature,
					verified: customer.verified,
					email: customer.email
				});
			}
	}
	return res.status(404).json({
		message: "Login Error"
	});
}

export const CustomerVerify = async(req:Request, res: Response, next:NextFunction)=>{
	const { otp } = req.body;
	const customer = req.user;
	if(customer){
		const profile = await Customer.findById(customer._id)

		if(profile){

			if(profile.otp === parseInt(otp) && profile.otp_expiry <= new Date()){
				profile.verified = true;
				const updatedCustomerResponse = await profile.save();

				const signature = GenerateSignature({
					_id: updatedCustomerResponse._id,
					email: updatedCustomerResponse.email,
					verified: updatedCustomerResponse.verified
				})
				return res.status(201).json({
					signature: signature,
					verified: updatedCustomerResponse.verified,
					email: updatedCustomerResponse.email
				})
			}
		}
	}
	return res.status(400).json({ message: "Error with Otp"})
}

export const RequestOtp = async(req:Request, res: Response, next:NextFunction)=>{
	const customer = req.user;

	if(customer){
		const profile = await Customer.findById(customer._id)
	
		if(profile){
			const { otp, expiry } = GenerateOtp();
			profile.otp = otp;
			profile.otp_expiry = expiry;
			await profile.save();
			await onOtpRequest(otp, profile.phone);
			res.status(200).json({
				message: "OTP sent to the registered number"
			})
		}
	}
	return res.status(400).json({
		message: "Error with Request OTP"
	})
}

export const GetCustomerProfile = async(req:Request, res: Response, next:NextFunction)=>{
	const customer = req.user;

	if(customer){
		
		const profile = await Customer.findById(customer._id)
		if(profile){
			return res.status(200).json(profile)
		}
	}
	return res.status(400).json({ message: "Error with Profile"})
}

export const EditCustomerProfile = async(req:Request, res: Response, next:NextFunction)=>{
	const customer = req.user;
	const profileInputs = plainToClass( EditCustomerProfileInputs, req.body);
	const profileErrors = await validate(profileInputs, { validationError: { target: false} })

	if(profileErrors.length > 0){
		return res.status(400).json(profileErrors);
	}
	const { firstName, lastName, address } = profileInputs;

	if(customer){
		const profile = await Customer.findById(customer._id)

		if(profile){ 
			profile.firstName = firstName;
			profile.lastName = lastName;
			profile.address = address;
			const result = await profile.save();
			res.status(200).json(result);
		}
	}	
}
