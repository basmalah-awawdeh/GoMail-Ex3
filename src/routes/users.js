import express from 'express';
import { registerUser, getUser, loginUser } from '../controllers/users.js';

//creating a new router for user related endpoints
const router = express.Router();
//user functions
router.post('/', registerUser);
router.get('/:id', getUser);
router.post('/tokens', loginUser);

export default router;
