import { Router } from 'express';
import { register, login, logout, me } from '../controllers/auth.controller';
import { validate } from '../middlewares/validateParams';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { requireAuth } from '../middlewares/requireAuth';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
