import express from 'express';
import * as generic from '../controllers/genericController.js';
import * as scheduler from '../controllers/schedulerController.js';

const router = express.Router();

const models = ['teacher', 'subject', 'class', 'room', 'timeslot'];

models.forEach((model) => {
  router.get(`/${model}s`, (req, res) => generic.getItems(model, req, res));
  router.post(`/${model}s`, (req, res) => generic.createItem(model, req, res));
  router.put(`/${model}s/:id`, (req, res) => generic.updateItem(model, req, res));
  router.delete(`/${model}s/:id`, (req, res) => generic.deleteItem(model, req, res));
});

// Special case for TeacherSubject and ClassSubject (many-to-many)
router.get('/teacher-subjects', (req, res) => generic.getItems('teacherSubject', req, res));
router.post('/teacher-subjects', (req, res) => generic.createItem('teacherSubject', req, res));
router.delete('/teacher-subjects/:id', (req, res) => generic.deleteItem('teacherSubject', req, res));

router.get('/class-subjects', (req, res) => generic.getItems('classSubject', req, res));
router.post('/class-subjects', (req, res) => generic.createItem('classSubject', req, res));
router.delete('/class-subjects/:id', (req, res) => generic.deleteItem('classSubject', req, res));

// Scheduler Routes
router.post('/generate-timetable', scheduler.generateTimetable);
router.get('/timetable/class/:classId', scheduler.getTimetableByClass);

export default router;
