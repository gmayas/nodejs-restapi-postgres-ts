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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
const _ = __importStar(require("lodash"));
const Validations_1 = require("../libs/Validations");
/*var redis = require('redis');
var JWTR =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwt = new JWTR(redisClient);*/
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let emailuserExists;
        const newUser = {
            emailuser: req.body.emailuser,
            nameuser: req.body.nameuser,
            passworduser: req.body.passworduser,
            typeiduser: req.body.typeiduser
        };
        console.log('newUser: ', newUser);
        // Email Validation
        emailuserExists = yield database_1.default.query('SELECT * FROM users WHERE emailuser = $1', [newUser.emailuser]);
        if (emailuserExists.rowCount > 0)
            return res.status(400).json('Email already exists');
        // encrypPassword
        newUser.passworduser = yield Validations_1.encrypPassword(newUser.passworduser);
        // insert newUser
        const savedUser = yield database_1.default.query('INSERT INTO users(emailuser, nameuser, passworduser, typeiduser) VALUES ($1, $2, $3, $4);', [newUser.emailuser, newUser.nameuser, newUser.passworduser, newUser.typeiduser]);
        // get token
        const token = yield jsonwebtoken_1.default.sign({ emailuser: newUser.emailuser }, process.env['TOKEN_SECRET'] || '', {
            expiresIn: 60 * 60 * 24 // Duracion de 24 hrs
        });
        emailuserExists = yield database_1.default.query('SELECT id FROM users WHERE emailuser = $1', [newUser.emailuser]);
        console.log('emailuserExists: ', _.get(emailuserExists.rows[0], 'id'));
        newUser.id = _.get(emailuserExists.rows[0], 'id');
        newUser.token = token;
        newUser.success = true;
        return res.header('auth-token', token).json(newUser);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            error: e
        });
    }
});
exports.signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req.body: ', req.body);
        const { emailuser, passworduser } = req.body;
        const queryUser = yield database_1.default.query('SELECT * FROM users WHERE emailuser = $1', [emailuser]);
        if (queryUser.rowCount <= 0)
            return res.status(400).json('Email or Password is wrong');
        const dataResult = queryUser.rows.find(f => f.emailuser == emailuser);
        const correctPassword = yield Validations_1.validatePassword(passworduser, _.get(dataResult, 'passworduser', ''));
        if (!correctPassword) {
            dataResult.success = false;
            dataResult.token = '';
            dataResult.message = 'Invalid Password';
            return res.status(400).json(dataResult);
        }
        // Get Token
        const token = yield jsonwebtoken_1.default.sign({ emailuser: _.get(dataResult, 'emailuser', '') }, process.env['TOKEN_SECRET'] || '', {
            expiresIn: 60 * 60 * 24 // Duracion de 24 hrs
        });
        dataResult.token = token;
        dataResult.success = true;
        console.log('dataResult: ', dataResult);
        return res.header('auth-token', token).json(dataResult);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in query',
            error: e
        });
    }
});
exports.profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.default.query('SELECT * FROM users WHERE emailuser = $1 ORDER BY id ASC LIMIT 1', [req.emailUser]);
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
exports.logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({
            message: 'Come back soon',
            data: {}
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
exports.updatePasswordUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = {
            emailuser: req.body.emailuser,
            passworduser: yield Validations_1.encrypPassword(req.body.passworduser)
        };
        console.log('newUser: ', newUser);
        // update new password
        const response = yield database_1.default.query('UPDATE users SET passworduser = $1 WHERE emailuser = $2', [newUser.passworduser, newUser.emailuser]);
        return res.status(200).json({
            message: 'User updated succesfully',
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
exports.getTypeOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.default.query('SELECT * FROM typeofuser Order by usertype;');
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
