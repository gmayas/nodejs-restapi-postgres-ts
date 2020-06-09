import { Router } from 'express';
const router = Router();

import { signUp, signIn, profile, logOut, getTypeOfUser, updatePasswordUser } from '../controllers/auth.controller'
import { TokenValidation } from '../libs/Validations'

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/profile', TokenValidation, profile);
router.post('/newPassword', updatePasswordUser);
router.post('/logout', TokenValidation, logOut);
router.get('/tuser', getTypeOfUser);

export default router;
