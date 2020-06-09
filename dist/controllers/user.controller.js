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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
exports.userVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const emailUser = req.emailUser;
        console.log('req.params', req.params);
        console.log('emailUser, id', emailUser, id);
        const response = yield database_1.default.query('SELECT V.id, V.plates, V.make, V.color, V.model, V.userid, V.positiongps FROM users AS U INNER JOIN vehicles AS V ON (V.userid = U.id) WHERE U.emailuser = $1 ORDER BY V.id', [emailUser]);
        return res.status(200).json({
            message: 'Query succesfully',
            data: response.rows
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in query',
            error: e
        });
    }
});
exports.userVehiclesId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const emailUser = req.emailUser;
        console.log('req.params', req.params);
        console.log('emailUser, id', emailUser, id);
        const response = yield database_1.default.query('SELECT V.id, V.plates, V.make, V.color, V.model, V.userid, V.positiongps FROM users AS U INNER JOIN vehicles AS V ON (V.userid = U.id) WHERE U.emailuser = $1 AND V.id = %2', [emailUser, id]);
        return res.status(200).json({
            message: 'Query succesfully',
            data: response.rows
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in query',
            error: e
        });
    }
});
exports.addVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newVehicle = {
            plates: req.body.plates,
            make: req.body.make,
            color: req.body.color,
            model: req.body.model,
            userid: req.body.userid,
            positiongps: req.body.positiongps
        };
        console.log('newVehicle: ', newVehicle);
        // newVehicle Validation
        const platesExists = yield database_1.default.query('SELECT * FROM vehicles WHERE plates = $1', [newVehicle.plates]);
        if (platesExists.rowCount > 0)
            return res.status(400).json('Vehicle already exists');
        // insert vehicles
        const savedVehicle = yield database_1.default.query('INSERT INTO vehicles(plates, make, color, model, userid, positiongps) VALUES ($1, $2, $3, $4, $5, $6);', [newVehicle.plates, newVehicle.make, newVehicle.color, newVehicle.model, newVehicle.userid, newVehicle.positiongps]);
        newVehicle.success = true;
        console.log('savedVehicle: ', savedVehicle);
        return res.status(200).json({
            message: 'Vehicle add succesfully',
            data: newVehicle
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create vehicle',
            error: e
        });
    }
});
exports.updateVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Vehicle = {
            id: req.params.id,
            plates: req.body.plates,
            make: req.body.make,
            color: req.body.color,
            model: req.body.model
        };
        console.log('Vehicle: ', Vehicle);
        // update Vehicle
        const response = yield database_1.default.query('UPDATE vehicles SET plates = $2, make = $3, color = $4, model = $5 WHERE id = $1', [Vehicle.id, Vehicle.plates, Vehicle.make, Vehicle.color, Vehicle.model]);
        return res.status(200).json({
            message: 'vehicle updated succesfully',
            data: response
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in update user',
            error: e
        });
    }
});
//addPosition
exports.addPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPosition = {
            idvehicles: req.body.idvehicles,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            zoom: req.body.zoom
        };
        console.log('newPosition: ', newPosition);
        // insert Position
        const savePosition = yield database_1.default.query('INSERT INTO position(idvehicles, latitude, longitude, zoom) VALUES ($1, $2, $3, $4);;', [newPosition.idvehicles, newPosition.latitude, newPosition.longitude, newPosition.zoom]);
        newPosition.success = true;
        console.log('savePosition: ', savePosition);
        return res.status(200).json({
            message: 'Position add succesfully',
            data: newPosition
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in add position',
            error: e
        });
    }
});
