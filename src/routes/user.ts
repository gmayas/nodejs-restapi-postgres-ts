import { Router } from 'express';
const router = Router();

import { userVehicles, addVehicle, updateVehicle, addPosition } from '../controllers/user.controller'
import { TokenValidation } from '../libs/Validations'

router.get('/userVehicles/:id', TokenValidation, userVehicles);
router.post('/addVehicle', TokenValidation, addVehicle);
router.post('/updateVehicle/:id', TokenValidation, updateVehicle);
router.post('/addPosition', addPosition);
export default router;