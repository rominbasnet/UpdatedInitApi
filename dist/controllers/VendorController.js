"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFoods = exports.UpdateVendorCoverImage = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const AdminController_1 = require("./AdminController");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, AdminController_1.FindVendor)('', email);
    if (existingVendor !== null) {
        const validation = yield (0, utility_1.ValidatePassword)(password, existingVendor.password, existingVendor.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: existingVendor.id,
                email: existingVendor.email,
                foodType: existingVendor.foodType,
                name: existingVendor.name
            });
            return res.json(signature);
        }
        else {
            return res.json({ "message": "Password is not valid" });
        }
    }
    return res.json({ "message": "Login credentials not valid" });
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        return res.json(existingVendor);
    }
    return res.json({ "message": "Vendor info not found" });
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { foodTypes, name, address, phone } = req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodTypes;
            const savedResult = yield existingVendor.save();
            return res.json(savedResult);
        }
    }
    return res.json({ "message": "Vendor info not found" });
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const savedResult = yield existingVendor.save();
            return res.json(savedResult);
        }
    }
    return res.json({ "message": "Vendor info not found" });
});
exports.UpdateVendorService = UpdateVendorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files; //req.files returns the list of all files sent to the server from client.
            const file = files.images; //req.files.images return all the files sent by using name="image" in input tag.E.g.<input name="images" type="file" />
            if (Array.isArray(file)) {
                const images = file.map(singleFile => {
                    singleFile.mv('./images/' + singleFile.name);
                    return singleFile.name;
                });
                const createdFood = yield models_1.Food.create({
                    vendorId: vendor._id,
                    name: name,
                    description: description,
                    category: category,
                    foodType: foodType,
                    images: images,
                    readyTime: readyTime,
                    price: price,
                    rating: 0
                });
                vendor.foods.push(createdFood);
                const result = yield vendor.save();
                return res.json(result);
            }
            else {
                file.mv('./images/' + file.name);
                const image = file.name;
                const createdFood = yield models_1.Food.create({
                    vendorId: vendor._id,
                    name: name,
                    description: description,
                    category: category,
                    foodType: foodType,
                    images: [image],
                    readyTime: readyTime,
                    price: price,
                    rating: 0
                });
                vendor.foods.push(createdFood);
                const result = yield vendor.save();
                return res.json(result);
            }
        }
    }
    return res.json({ "message": "Something went wrong" });
});
exports.AddFood = AddFood;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files; //req.files returns the list of all files sent to the server from client.
            const file = files.images; //req.files.images return all the files sent by using name="image" in input tag.E.g.<input name="images" type="file" />
            if (Array.isArray(file)) {
                const images = file.map(singleFile => {
                    singleFile.mv('./images/' + singleFile.name);
                    return singleFile.name;
                });
                vendor.coverImages.push(...images);
                const result = yield vendor.save();
                return res.json(result);
            }
            else {
                file.mv('./images/' + file.name);
                const image = [file.name];
                vendor.coverImages.push(...image);
                const result = yield vendor.save();
                return res.json(result);
            }
        }
    }
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vendorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ "message": "Foods info not found" });
});
exports.GetFoods = GetFoods;
