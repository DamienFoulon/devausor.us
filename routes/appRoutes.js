// Libs
import express from 'express';

// Config
const router = express.Router();

// Controllers
import {
    getHome,
    createUrl,
    getUrl,
} from '../controllers/app.js';

// Middleware

// Routes
router.get('/', getHome);
router.get('/url/:url', getUrl);

router.post('/url', createUrl);

// Export
export default router;