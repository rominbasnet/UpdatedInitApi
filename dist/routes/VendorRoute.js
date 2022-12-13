"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
//import multer from 'multer';
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const router = express_1.default.Router();
exports.VendorRoute = router;
router.post('/login', controllers_1.VendorLogin);
router.use(middleware_1.Authenticate);
router.get('/profile', controllers_1.GetVendorProfile);
router.patch('/profile', controllers_1.UpdateVendorProfile);
router.patch('/coverImage', (0, express_fileupload_1.default)({ createParentPath: true }), controllers_1.UpdateVendorCoverImage);
router.patch('/service', controllers_1.UpdateVendorService);
router.post('/food', (0, express_fileupload_1.default)({ createParentPath: true }), controllers_1.AddFood);
router.get('/foods', controllers_1.GetFoods);
router.get('/', (req, res, next) => {
    res.json({ message: "Hello from Vendor" });
});
