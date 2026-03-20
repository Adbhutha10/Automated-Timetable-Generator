import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ─── Admin user ───────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', password: hashedPassword, name: 'System Admin', role: 'ADMIN' },
  });
  console.log('✅ Admin seeded: admin@example.com / admin123');

  // ─── Timeslots (7 periods per day, Mon–Sat) ───────────────────
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [
    { start_time: '09:20', end_time: '10:10' }, // Period 1
    { start_time: '10:10', end_time: '11:00' }, // Period 2
    { start_time: '11:10', end_time: '12:00' }, // Period 3 (after break)
    { start_time: '12:00', end_time: '12:50' }, // Period 4
    { start_time: '13:30', end_time: '14:20' }, // Period 5 (after lunch)
    { start_time: '14:20', end_time: '15:10' }, // Period 6
    { start_time: '15:10', end_time: '15:50' }, // Period 7
  ];

  for (const day of days) {
    for (const period of periods) {
      await prisma.timeslot.upsert({
        where: { day_start_time_end_time: { day, start_time: period.start_time, end_time: period.end_time } },
        update: {},
        create: { day, start_time: period.start_time, end_time: period.end_time },
      });
    }
  }
  console.log('✅ Timeslots seeded (7 periods × 6 days = 42 slots)');

  // ─── Rooms ───────────────────────────────────────────────────
  const rooms = [
    // Classrooms for 5 sections
    { room_number: 'A-301', capacity: 70 },
    { room_number: 'A-302', capacity: 70 },
    { room_number: 'A-303', capacity: 70 },
    { room_number: 'A-304', capacity: 70 },
    { room_number: 'A-305', capacity: 70 },
    // Labs
    { room_number: 'ELN-505 (MLT Lab)', capacity: 40 },
    { room_number: 'ELN-507 (WT Lab)', capacity: 40 },
    { room_number: 'ELN-506 (ACS Lab)', capacity: 40 },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { room_number: room.room_number },
      update: {},
      create: room,
    });
  }
  console.log('✅ Rooms seeded (5 classrooms + 3 labs)');

  // ─── Subjects ─────────────────────────────────────────────────
  const subjects = [
    { name: 'Information Security (IS)', department: 'CSE', hours_per_week: 4 },
    { name: 'Machine Learning Techniques (MLT)', department: 'CSE', hours_per_week: 4 },
    { name: 'Business Economics & Financial Analysis (BEFA)', department: 'CSE', hours_per_week: 4 },
    { name: 'Intellectual Property Rights (IPR)', department: 'CSE', hours_per_week: 2 },
    { name: 'Professional Elective-III (PE-3)', department: 'CSE', hours_per_week: 3 },
    { name: 'Professional Elective-IV (PE-4)', department: 'CSE', hours_per_week: 3 },
    { name: 'MLT Lab', department: 'CSE', hours_per_week: 2 },
    { name: 'WT Lab (Web Technologies)', department: 'CSE', hours_per_week: 2 },
    { name: 'ACS Lab (Advanced Communication Skills)', department: 'CSE', hours_per_week: 2 },
    { name: 'Mini Project / Internship', department: 'CSE', hours_per_week: 3 },
    { name: 'Self Study / Library', department: 'CSE', hours_per_week: 0 },
    { name: 'Sports / Seminar', department: 'CSE', hours_per_week: 0 },
  ];

  const createdSubjects = {};
  for (const subject of subjects) {
    const existing = await prisma.subject.findFirst({ where: { name: subject.name } });
    const sub = existing
      ? await prisma.subject.update({ where: { id: existing.id }, data: subject })
      : await prisma.subject.create({ data: subject });
    createdSubjects[subject.name] = sub.id;
  }
  console.log('✅ Subjects seeded (6 theory + 3 labs)');

  // ─── Classes (5 sections) ─────────────────────────────────────
  const classes = ['CSE-A', 'CSE-B', 'CSE-C', 'CSE-D', 'CSE-E'];
  const createdClasses = {};
  for (const name of classes) {
    const cls = await prisma.class.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdClasses[name] = cls.id;
  }
  console.log('✅ Classes seeded (5 sections: CSE-A to CSE-E)');

  // ─── Assign all subjects to all classes ───────────────────────
  for (const classId of Object.values(createdClasses)) {
    for (const subjectId of Object.values(createdSubjects)) {
      const existing = await prisma.classSubject.findFirst({ where: { class_id: classId, subject_id: subjectId } });
      if (!existing) {
        await prisma.classSubject.create({ data: { class_id: classId, subject_id: subjectId } });
      }
    }
  }
  console.log('✅ Class-Subject mappings created');

  // ─── Teachers ────────────────────────────────────────────────
  const teachers = [
    { name: 'Mrs. B. Usha Sri', email: 'usha.sri@college.edu', department: 'CSE' },
    { name: 'Dr. G. Ramani', email: 'g.ramani@college.edu', department: 'CSE' },
    { name: 'Mr. B. Lakshmipathi', email: 'b.lakshmipathi@college.edu', department: 'CSE' },
    { name: 'Dr. R. Pitchai', email: 'r.pitchai@college.edu', department: 'CSE' },
    { name: 'Dr. Ashok Kumar Nanda', email: 'ashok.nanda@college.edu', department: 'CSE' },
    { name: 'Mrs. V. Nirosha', email: 'v.nirosha@college.edu', department: 'CSE' },
    { name: 'Mrs. M.V.V.S Lakshmi', email: 'mvvs.lakshmi@college.edu', department: 'CSE' },
    { name: 'Mr. S. Dinesh Krishnan', email: 's.dinesh@college.edu', department: 'CSE' },
    { name: 'Dr. G. V. Ramana', email: 'gv.ramana@college.edu', department: 'CSE' },
    { name: 'Dr. L. Pallavi', email: 'l.pallavi@college.edu', department: 'CSE' },
    { name: 'Mrs. M. Shreesha Reddy', email: 'm.shreesha@college.edu', department: 'CSE' },
    { name: 'Mrs. A. Vijaya Lakshmi', email: 'a.vijaya@college.edu', department: 'CSE' },
  ];

  const createdTeachers = {};
  for (const teacher of teachers) {
    const t = await prisma.teacher.upsert({
      where: { email: teacher.email },
      update: {},
      create: teacher,
    });
    createdTeachers[teacher.name] = t.id;
  }
  console.log('✅ Teachers seeded (12 faculty members)');

  // ─── Teacher-Subject Assignments (from the timetable) ─────────
  const teacherSubjectMap = [
    // IS
    { teacher: 'Mrs. B. Usha Sri', subject: 'Information Security (IS)' },
    // MLT
    { teacher: 'Dr. G. Ramani', subject: 'Machine Learning Techniques (MLT)' },
    // BEFA
    { teacher: 'Mr. B. Lakshmipathi', subject: 'Business Economics & Financial Analysis (BEFA)' },
    // IPR
    { teacher: 'Dr. R. Pitchai', subject: 'Intellectual Property Rights (IPR)' },
    // PE-3 (EHT / VR)
    { teacher: 'Dr. Ashok Kumar Nanda', subject: 'Professional Elective-III (PE-3)' },
    { teacher: 'Mrs. V. Nirosha', subject: 'Professional Elective-III (PE-3)' },
    // PE-4 (FSD / CF / NLP)
    { teacher: 'Mrs. M.V.V.S Lakshmi', subject: 'Professional Elective-IV (PE-4)' },
    { teacher: 'Dr. Ashok Kumar Nanda', subject: 'Professional Elective-IV (PE-4)' },
    { teacher: 'Mr. S. Dinesh Krishnan', subject: 'Professional Elective-IV (PE-4)' },
    // MLT Lab
    { teacher: 'Dr. G. Ramani', subject: 'MLT Lab' },
    { teacher: 'Mrs. V. Nirosha', subject: 'MLT Lab' },
    // WT Lab
    { teacher: 'Mrs. M.V.V.S Lakshmi', subject: 'WT Lab (Web Technologies)' },
    { teacher: 'Mrs. B. Usha Sri', subject: 'WT Lab (Web Technologies)' },
    // ACS Lab
    { teacher: 'Dr. G. V. Ramana', subject: 'ACS Lab (Advanced Communication Skills)' },
    // Class Advisors teach all subjects
    { teacher: 'Dr. L. Pallavi', subject: 'Information Security (IS)' },
    { teacher: 'Dr. L. Pallavi', subject: 'Professional Elective-III (PE-3)' },
    { teacher: 'Mrs. M. Shreesha Reddy', subject: 'Machine Learning Techniques (MLT)' },
    { teacher: 'Mrs. M. Shreesha Reddy', subject: 'Professional Elective-IV (PE-4)' },
    { teacher: 'Mrs. A. Vijaya Lakshmi', subject: 'Business Economics & Financial Analysis (BEFA)' },
    { teacher: 'Mrs. A. Vijaya Lakshmi', subject: 'Intellectual Property Rights (IPR)' },
  ];

  for (const map of teacherSubjectMap) {
    const teacherId = createdTeachers[map.teacher];
    const subjectId = createdSubjects[map.subject];
    if (!teacherId || !subjectId) continue;
    const existing = await prisma.teacherSubject.findFirst({ where: { teacher_id: teacherId, subject_id: subjectId } });
    if (!existing) {
      await prisma.teacherSubject.create({ data: { teacher_id: teacherId, subject_id: subjectId } });
    }
  }
  console.log('✅ Teacher-Subject assignments created');

  console.log('\n🎉 Seed complete! Ready to generate timetables.');
  console.log('   → Admin: admin@example.com / admin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
