import { Request, Response, NextFunction } from 'express'
//import jwt from 'jsonwebtoken';
var redis = require('redis');
var JWTR =  require('jwt-redis').default;
//ES6 import JWTR from 'jwt-redis';
var redisClient = redis.createClient();
var jwt = new JWTR(redisClient);

import bcrypt from 'bcryptjs';

export interface IPayload {
    emailuser: string;
    iat: number;
} 
   
export const TokenValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('token');
        console.log('token: ', token);
        if (!token) return res.status(401).json('Access Denied');
        const payload = await jwt.verify(token, process.env['TOKEN_SECRET'] || '') as IPayload;
        console.log('payload: ', payload)
        req.emailUser = payload.emailuser  // Se guarda en  req.userId paa que todas las rutas la puedan ver. 
        next();
    } catch (e) {
        console.log('error : ', e);
        res.status(400).send('Invalid Token');
    }
}

export const RemoveToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('token');
        console.log('token: ', token);
        if (!token) return res.status(401).json('Access Denied');
        const payload = await jwt.verify(token, process.env['TOKEN_SECRET'] || '') as IPayload;
        console.log('payload: ', payload); 
        const destroy = await jwt.destroy(token, process.env['TOKEN_SECRET'] || ''); 
        console.log('destroy: ', destroy); 
        req.emailUser = '';  // Se guarda en  req.userId paa que todas las rutas la puedan ver. 
        console.log('req.emailUser: ', req.emailUser); 
        next();
    } catch (e) {
        res.status(400).send('Invalid Token');
    }
}

export const encrypPassword = async (password: string): Promise<string> => {
   try{
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
   } catch (e) {
       console.log('Encryption error (encrypPassword)', e);   
       return 'Encryption error (encrypPassword).';
   }
};

export const validatePassword = async function (password: string, QueryPassword: string): Promise<boolean> {
    try{
         return await bcrypt.compare(password, QueryPassword);
    } catch (e) {
        console.log('Error validatePassword: false',  e);   
        return false;
    }
 };
