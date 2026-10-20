import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { getStudents, createStudent, getStudentById, updateStudent, getStudentAttendance, importStudentsFromCSV } from '../controllers/studentController';

const router = Router();
router.use(authenticateToken);

router.get('/', authorizeRole('teacher'), getStudents);
router.post('/', authorizeRole('teacher'), createStudent);
router.post('/import', authorizeRole('teacher'), importStudentsFromCSV);
router.get('/:id', getStudentById);
router.patch('/:id', authorizeRole('teacher'), updateStudent);
router.get('/:id/attendance', getStudentAttendance);

export default router;
