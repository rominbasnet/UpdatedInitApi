export const GenerateOtp = ()=>{
	const otp = Math.floor(100000 + Math.random() * 900000);
	let expiry = new Date();
	expiry.setTime( new Date().getTime() + (30*60*100));
	return {
		otp,
		expiry
	}
}
export const onOtpRequest = async (otp: number, toPhoneNumber: string)=>{
 const accountSid = "AC86f788e0d4e5252a70622832e361aef1";
 const authToken = "42d4c75e58b9d5d50cfcd541d68cc78c";
 const client = require('twilio')(accountSid, authToken);
 
 const response = await client.messages.create({
 	body: `Your OTP is ${otp}`,
 	from: '+16075363921',
 	to: `+977${toPhoneNumber}`
 })
 return response;
}
