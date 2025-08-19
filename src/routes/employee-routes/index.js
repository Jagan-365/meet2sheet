import express from 'express';
import { 
    getEmployee, 
    getJobs, 
    createTimeLog, 
    getTimeSheet, 
    createTimeSheet, 
    updateTimeSheet, 
    updateTimeSheetStatus 
} from '../../controllers/employee.controller.js';
import { authenticateToken } from '../../middleware/authentication.js';

const router = express.Router();

router.get('/', authenticateToken, getEmployee);

router.get('/jobs', authenticateToken, getJobs);

router.post('/timelog', authenticateToken, createTimeLog);

router.get('/timesheet', authenticateToken, getTimeSheet);

router.post('/timesheet', authenticateToken, createTimeSheet);

router.put('/timesheet', authenticateToken, updateTimeSheet);

router.put('/timesheet/status', authenticateToken, updateTimeSheetStatus);

export default router;