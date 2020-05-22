import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import  pool  from '../database/database';
import * as _ from 'lodash';
var redis = require('redis');
var JWTR =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwt = new JWTR(redisClient);

export const userVehicles = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { id } = req.params;
        const  emailUser = req.emailUser;
                
        console.log('req.params', req.params);
        console.log('emailUser, id', emailUser, id);
                
        const response: QueryResult = await pool.query('SELECT V.id, V.plates, V.make, V.color, V.model, V.userid, V.positiongps FROM users AS U INNER JOIN vehicles AS V ON (V.userid = U.id) WHERE U.emailuser = $1 ORDER BY V.id', [emailUser]);
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

export const userVehiclesId = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { id } = req.params;
        const  emailUser = req.emailUser;
                
        console.log('req.params', req.params);
        console.log('emailUser, id', emailUser, id);
                
        const response: QueryResult = await pool.query('SELECT V.id, V.plates, V.make, V.color, V.model, V.userid, V.positiongps FROM users AS U INNER JOIN vehicles AS V ON (V.userid = U.id) WHERE U.emailuser = $1 AND V.id = %2', [emailUser,id]);
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

export const addVehicle = async (req: Request, res: Response): Promise<Response> => {
    try{
        const newVehicle: any = {
            plates: req.body.plates,
            make: req.body.make,
            color: req.body.color, 
            model: req.body.model, 
            userid: req.body.userid,
            positiongps: req.body.positiongps
        };
        console.log('newVehicle: ', newVehicle);
        // newVehicle Validation
        const platesExists: QueryResult = await pool.query('SELECT * FROM vehicles WHERE plates = $1', [newVehicle.plates]);
        if (platesExists.rowCount > 0) return res.status(400).json('Vehicle already exists');
        // insert vehicles
        const savedVehicle: QueryResult = await pool.query('INSERT INTO vehicles(plates, make, color, model, userid, positiongps) VALUES ($1, $2, $3, $4, $5, $6);', [newVehicle.plates, newVehicle.make, newVehicle.color, newVehicle.model, newVehicle.userid, newVehicle.positiongps]);
        newVehicle.success = true;
        console.log('savedVehicle: ', savedVehicle);
        return res.status(200).json({ 
            message: 'Vehicle add succesfully',
            data: newVehicle});
    } catch ( e ){
        console.log(e);
        return res.status(500).json({
            message: 'Error in create vehicle',
            error: e
        })
    }   
}; 

export const updateVehicle = async (req: Request, res: Response): Promise<Response> => {
    try{
        const Vehicle: any = {
            id: req.params.id,
            plates: req.body.plates,
            make: req.body.make,
            color: req.body.color, 
            model: req.body.model 
        };
        console.log('Vehicle: ', Vehicle);
          // update Vehicle
          const response = await pool.query('UPDATE vehicles SET plates = $2, make = $3, color = $4, model = $5 WHERE id = $1', [Vehicle.id, Vehicle.plates, Vehicle.make, Vehicle.color, Vehicle.model]);
          return res.status(200).json({ 
           message: 'vehicle updated succesfully',
           data: response});
      } catch ( e ){
          console.log(e);
          return res.status(500).json({
              message: 'Error in update user',
              error: e
          })
      }   
  }; 

  //addPosition
  export const addPosition = async (req: Request, res: Response): Promise<Response> => {
    try{
        const newPosition: any = {
            idvehicles: req.body.idvehicles,
            latitude: req.body.latitude, 
            longitude: req.body.longitude, 
            zoom: req.body.zoom
        };
        console.log('newPosition: ', newPosition);
        // insert Position
        const savePosition: QueryResult = await pool.query('INSERT INTO position(idvehicles, latitude, longitude, zoom) VALUES ($1, $2, $3, $4);;', [newPosition.idvehicles, newPosition.latitude, newPosition.longitude, newPosition.zoom]);
        newPosition.success = true;
        console.log('savePosition: ', savePosition);
        return res.status(200).json({ 
            message: 'Position add succesfully',
            data: newPosition});
    } catch ( e ){
        console.log(e);
        return res.status(500).json({
            message: 'Error in add position',
            error: e
        })
    }   
}; 