"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.AdminRoute = router;
router.post('/vendor', controllers_1.CreateVendor); //creating vendor
router.get('/vendors', controllers_1.GetVendor); //getting all vendor list
router.post('/vendor/:id', controllers_1.GetVendorID); //getting vendor detail based on ID
router.get('/', (req, res, next) => {
    res.json({ message: "Hello from Admin" });
});
