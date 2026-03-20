import express from 'express';
import * as generic from '../controllers/genericController.js';
import * as scheduler from '../controllers/schedulerController.js';
import * as authController from '../controllers/authController.js';
import { auth, authorize, isAdmin, isTeacherOwner, isStudentOfClass } from '../middleware/auth.js';

const router = express.Router();

const models = ['teacher', 'subject', 'class', 'room', 'timeslot'];
const plurals = {
  teacher: 'teachers',
  subject: 'subjects',
  class: 'classes',
  room: 'rooms',
  timeslot: 'timeslots',
};

models.forEach((model) => {
  const route = plurals[model];
  // GET routes are accessible by any authenticated user
  router.get(`/${route}`, auth, (req, res) => generic.getItems(model, req, res));
  
  // Mutations are restricted to ADMIN only
  router.post(`/${route}`, auth, isAdmin, (req, res) => generic.createItem(model, req, res));
  router.put(`/${route}/:id`, auth, isAdmin, (req, res) => generic.updateItem(model, req, res));
  router.delete(`/${route}/:id`, auth, isAdmin, (req, res) => generic.deleteItem(model, req, res));
});

// Special case for TeacherSubject and ClassSubject (many-to-many)
router.get('/teacher-subjects', auth, (req, res) => generic.getItems('teacherSubject', req, res));
router.post('/teacher-subjects', auth, isAdmin, (req, res) => generic.createItem('teacherSubject', req, res));
router.delete('/teacher-subjects/:id', auth, isAdmin, (req, res) => generic.deleteItem('teacherSubject', req, res));

router.get('/class-subjects', auth, (req, res) => generic.getItems('classSubject', req, res));
router.post('/class-subjects', auth, isAdmin, (req, res) => generic.createItem('classSubject', req, res));
router.delete('/class-subjects/:id', auth, isAdmin, (req, res) => generic.deleteItem('classSubject', req, res));

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// User Management (Admin only)
router.get('/users', auth, isAdmin, (req, res) => generic.getItems('user', req, res));
router.put('/users/:id', auth, isAdmin, (req, res) => generic.updateItem('user', req, res));

// Scheduler Routes
router.post('/generate-timetable', auth, isAdmin, scheduler.generateTimetable);
router.get('/timetable/class/:classId', auth, isStudentOfClass, scheduler.getTimetableByClass);
router.get('/timetable/teacher/:teacherId', auth, isTeacherOwner, scheduler.getTimetableByTeacher);
router.get('/timetable/room/:roomId', auth, scheduler.getTimetableByRoom);

export default router;
