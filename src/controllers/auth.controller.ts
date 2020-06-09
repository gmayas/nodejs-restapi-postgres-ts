import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import  pool  from '../database/database';
import * as _ from 'lodash';
import {  encrypPassword, validatePassword } from '../libs/Validations'
/*var redis = require('redis');
var JWTR =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwt = new JWTR(redisClient);*/
import jwt from 'jsonwebtoken';

export const signUp = async (req: Request, res: Response): Promise<Response> => {
    try{
        let emailuserExists: QueryResult;
        const newUser: any = {
            emailuser: req.body.emailuser,
            nameuser: req.body.nameuser,
            passworduser: req.body.passworduser,
            typeiduser: req.body.typeiduser
        };
        console.log('newUser: ', newUser);
        // Email Validation
        emailuserExists = await pool.query('SELECT * FROM users WHERE emailuser = $1', [newUser.emailuser]);
        if (emailuserExists.rowCount > 0) return res.status(400).json('Email already exists');
        // encrypPassword
        newUser.passworduser = await encrypPassword(newUser.passworduser);
        // insert newUser
        const savedUser: QueryResult = await pool.query('INSERT INTO users(emailuser, nameuser, passworduser, typeiduser) VALUES ($1, $2, $3, $4);', [newUser.emailuser, newUser.nameuser, newUser.passworduser, newUser.typeiduser]);
        // get token
        const token: string = await jwt.sign({ emailuser: newUser.emailuser }, process.env['TOKEN_SECRET'] || '', {
            expiresIn: 60 * 60 * 24  // Duracion de 24 hrs
        });
        emailuserExists = await pool.query('SELECT id FROM users WHERE emailuser = $1', [newUser.emailuser]);
        console.log('emailuserExists: ', _.get(emailuserExists.rows[0],'id'));
        newUser.id = _.get(emailuserExists.rows[0],'id');
        newUser.token = token;
        newUser.success = true;
        return res.header('auth-token', token).json(newUser);
    } catch ( e ){
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            error: e
        })
    }   
}; 

export const signIn = async (req: Request, res: Response): Promise<Response> => {
    try{
        console.log('req.body: ', req.body);
        const { emailuser, passworduser } = req.body;
        const queryUser: QueryResult = await pool.query('SELECT * FROM users WHERE emailuser = $1', [emailuser]);
        if ( queryUser.rowCount <=0 ) return res.status(400).json('Email or Password is wrong');
        const dataResult = queryUser.rows.find(f => f.emailuser == emailuser);
        const correctPassword = await validatePassword(passworduser, _.get(dataResult,'passworduser',''));
        if (!correctPassword)
        {   
            dataResult.success = false;
            dataResult.token = '';
            dataResult.message = 'Invalid Password';
            return res.status(400).json(dataResult);
        } 
        // Get Token
        const token: string = await jwt.sign({ emailuser: _.get( dataResult, 'emailuser','') }, process.env['TOKEN_SECRET'] || '',  {
            expiresIn: 60 * 60 * 24 // Duracion de 24 hrs
        });
        dataResult.token = token;
        dataResult.success = true;
        console.log('dataResult: ', dataResult); 
        return res.header('auth-token', token).json(dataResult);
     } catch ( e ){
         console.log(e);
         return res.status(500).json({
            message: 'Error in query',
            error: e
        })
     }  
};

export const profile = async (req: Request, res: Response): Promise<Response> => {
    try{
        const response: QueryResult = await pool.query('SELECT * FROM users WHERE emailuser = $1 ORDER BY id ASC LIMIT 1', [req.emailUser]);
        return res.status(200).json({
            message: 'Query succesfully',
            data: response.rows
        });
     } catch ( e ){
         console.log(e);
         return res.status(500).json({
            message: 'Error in query',
            error: e
        })
     }  
};


export const logOut = async (req: Request, res: Response): Promise<Response> => {
        try{
           return res.status(200).json({
                message: 'Come back soon',
                data: {}
            });
         } catch ( e ){
             console.log(e);
             return res.status(500).json({
                message: 'Error in query',
                error: e
            })
         }  
}; 


export const updatePasswordUser = async (req: Request, res: Response): Promise<Response> => {
  try{
        const newUser: any = {
            emailuser: req.body.emailuser,
            passworduser: await encrypPassword(req.body.passworduser)
        };
        console.log('newUser: ', newUser)
        // update new password
        const response = await pool.query('UPDATE users SET passworduser = $1 WHERE emailuser = $2', [newUser.passworduser, newUser.emailuser]);
        return res.status(200).json({ 
         message: 'User updated succesfully',
         data: response});
    } catch ( e ){
        console.log(e);
        return res.status(500).json({
            message: 'Error in update user',
            error: e
        })
    }   
}; 

export const getTypeOfUser = async (req: Request, res: Response): Promise<Response> => {
    try{
        const response: QueryResult = await pool.query('SELECT * FROM typeofuser Order by usertype;');
        return res.status(200).json({
            message: 'Query succesfully',
            data: response.rows
        });   
     } catch ( e ){
         console.log(e);
         return res.status(500).json({
            message: 'Error in query',
            error: e
        })
     }  
};