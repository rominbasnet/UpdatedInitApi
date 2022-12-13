"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'images')));
// app.use(express.static(__dirname + '/public'));
// app.use(express.static('dest'));
app.use('/admin', routes_1.AdminRoute);
app.use('/vendor', routes_1.VendorRoute);
mongoose_1.default.connect(config_1.MONGO_URI)
    .then(result => {
    console.log("Database is working!!!");
}).catch(err => console.log('error' + err));
app.listen(8000, () => {
    console.clear();
    console.log("App is listening on port 8000");
});
