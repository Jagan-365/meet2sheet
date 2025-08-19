import express from 'express';
import { authenticate, oauthCallback} from '../../controllers/auth.controller.js';

const router = express.Router();

router.get('/', authenticate);
router.get('/callback', oauthCallback);

export default router;