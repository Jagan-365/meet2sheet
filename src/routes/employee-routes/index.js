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
import { validate } from '../../middleware/validate.js';
import { 
    getEmployeeSchema,
    getJobsSchema,
    createTimeLogSchema,
    getTimeSheetSchema,
    createTimeSheetSchema,
    updateTimeSheetSchema,
    updateTimeSheetStatusSchema
} from '../../validations/employee.validations.js';

const router = express.Router();

router.get('/', authenticateToken, validate(getEmployeeSchema), getEmployee);

router.get('/jobs', authenticateToken, validate(getJobsSchema), getJobs);

router.post('/timelog', authenticateToken, validate(createTimeLogSchema), createTimeLog);

router.get('/timesheet', authenticateToken, validate(getTimeSheetSchema), getTimeSheet);

router.post('/timesheet', authenticateToken, validate(createTimeSheetSchema), createTimeSheet);

router.put('/timesheet', authenticateToken, validate(updateTimeSheetSchema), updateTimeSheet);

router.put('/timesheet/status', authenticateToken, validate(updateTimeSheetStatusSchema), updateTimeSheetStatus);

export default router;