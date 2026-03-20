import { prisma } from '../index.js';

let isGenerating = false;

export const generateTimetable = async (req, res) => {
  if (isGenerating) {
    return res.status(429).json({ error: 'Timetable generation is already in progress. Please wait.' });
  }

  isGenerating = true;
  try {
    // 1. Fetch all data
    const teachers = await prisma.teacher.findMany({ include: { subjects: true } });
    const subjects = await prisma.subject.findMany({ include: { teachers: true, classes: true } });
    const classes = await prisma.class.findMany({ include: { subjects: true } });
    const rooms = await prisma.room.findMany();
    const timeslotsRaw = await prisma.timeslot.findMany();

    // Sort timeslots horizontally: All P1 slots (Mon-Sat), then P2 (Mon-Sat), etc.
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeslots = timeslotsRaw.sort((a, b) => {
      const timeDiff = a.start_time.localeCompare(b.start_time);
      if (timeDiff !== 0) return timeDiff;
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    });

    const timetableEntries = [];
    const usedSlots = new Set(); // To track teacher-slot, room-slot, class-slot conflicts

    // Helper to check feasibility
    const isFeasible = (teacherId, roomId, classId, slotId) => {
      const teacherSlot = `T-${teacherId}-S-${slotId}`;
      const roomSlot = `R-${roomId}-S-${slotId}`;
      const classSlot = `C-${classId}-S-${slotId}`;
      return !usedSlots.has(teacherSlot) && !usedSlots.has(roomSlot) && !usedSlots.has(classSlot);
    };

    const bookSlot = (teacherId, roomId, classId, slotId, subjectId) => {
      timetableEntries.push({
        class_id: classId,
        subject_id: subjectId,
        teacher_id: teacherId,
        room_id: roomId,
        timeslot_id: slotId,
      });
      usedSlots.add(`T-${teacherId}-S-${slotId}`);
      usedSlots.add(`R-${roomId}-S-${slotId}`);
      usedSlots.add(`C-${classId}-S-${slotId}`);
    };

    // ─── 3. Pre-fill Saturday Afternoon (Constant) ────────────────
    const saturdayAfternoonSlots = timeslots.filter(s =>
      s.day === 'Saturday' && s.start_time >= '13:30'
    );

    // Find or create the "Mini Project / Internship" subject to ensure it exists
    let projectSubject = await prisma.subject.findFirst({ where: { name: 'Mini Project / Internship' } });
    if (!projectSubject) {
      projectSubject = await prisma.subject.create({
        data: { name: 'Mini Project / Internship', department: 'CSE', hours_per_week: 3 }
      });
    }
    const defaultTeacher = await prisma.teacher.findFirst();
    const defaultRoom = await prisma.room.findFirst();

    for (const cls of classes) {
      for (const slot of saturdayAfternoonSlots) {
        bookSlot(defaultTeacher.id, defaultRoom.id, cls.id, slot.id, projectSubject.id);
      }
    }

    // ─── 4. Schedule Labs (3 Consecutive Periods, 1 per Day) ──────
    for (const cls of classes) {
      const classLabs = cls.subjects.map(cs => subjects.find(s => s.id === cs.subject_id))
        .filter(s => s && s.name.toLowerCase().includes('lab'));

      const daysWithLabs = new Set();

      for (const lab of classLabs) {
        let labAssigned = false;
        const teacherIds = lab.teachers.map(t => t.teacher_id);

        // Try random days (Exclude Saturday for labs)
        const possibleDays = dayOrder.filter(d => d !== 'Saturday');
        const shuffledDays = [...possibleDays].sort(() => Math.random() - 0.5);
        for (const day of shuffledDays) {
          if (daysWithLabs.has(day)) continue;
          if (labAssigned) break;

          const daySlots = timeslotsRaw.filter(s => s.day === day).sort((a, b) => a.start_time.localeCompare(b.start_time));
          
          // Generate all possible starting indices for a 3-period lab
          const possibleStarts = [];
          for (let i = 0; i <= daySlots.length - 3; i++) {
            possibleStarts.push(i);
          }
          // Shuffle starting indices
          possibleStarts.sort(() => Math.random() - 0.5);

          for (const i of possibleStarts) {
            const consecutive = [daySlots[i], daySlots[i + 1], daySlots[i + 2]];

            for (const teacherId of teacherIds) {
              for (const room of rooms) {
                const allAvailable = consecutive.every(slot => isFeasible(teacherId, room.id, cls.id, slot.id));
                if (allAvailable) {
                  consecutive.forEach(slot => bookSlot(teacherId, room.id, cls.id, slot.id, lab.id));
                  daysWithLabs.add(day);
                  labAssigned = true;
                  break;
                }
              }
              if (labAssigned) break;
            }
            if (labAssigned) break;
          }
        }
      }
    }

    // ─── 5. Schedule Theory (Distributed/Scattered Fill) ──────────
    // Shuffle timeslots to distribute theory classes across the day/week
    const theorySlots = [...timeslots].sort(() => Math.random() - 0.5);

    for (const cls of classes) {
      const classTheory = cls.subjects.map(cs => subjects.find(s => s.id === cs.subject_id))
        .filter(s => s && !s.name.toLowerCase().includes('lab'));

      for (const subject of classTheory) {
        let hoursAssigned = 0;
        const totalHoursNeeded = subject.hours_per_week;
        const teacherIds = subject.teachers.map(t => t.teacher_id);

        for (const slot of theorySlots) {
          if (hoursAssigned >= totalHoursNeeded) break;
          for (const teacherId of teacherIds) {
            if (hoursAssigned >= totalHoursNeeded) break;
            for (const room of rooms) {
              if (isFeasible(teacherId, room.id, cls.id, slot.id)) {
                bookSlot(teacherId, room.id, cls.id, slot.id, subject.id);
                hoursAssigned++;
                break;
              }
            }
          }
        }
      }
    }

    // ─── 6. Fill Remaining Slots (Auxiliary) ─────────────────────
    const fillerNames = ['Self Study / Library', 'Sports / Seminar'];
    const fillerSubjects = [];
    
    for (const name of fillerNames) {
      let sub = await prisma.subject.findFirst({ where: { name } });
      if (!sub) {
        sub = await prisma.subject.create({ 
          data: { name, department: 'CSE', hours_per_week: 0 } 
        });
      }
      fillerSubjects.push(sub);
    }

    if (fillerSubjects.length > 0) {
      for (const cls of classes) {
        let fillerIndex = 0;
        for (const slot of timeslots) {
          // Check if class is already busy in this slot
          if (!usedSlots.has(`C-${cls.id}-S-${slot.id}`)) {
            const filler = fillerSubjects[fillerIndex % fillerSubjects.length];
            // Fillers use default teacher/room but multi-booking is allowed for study
            timetableEntries.push({
              class_id: cls.id,
              subject_id: filler.id,
              teacher_id: defaultTeacher.id,
              room_id: defaultRoom.id,
              timeslot_id: slot.id,
            });
            usedSlots.add(`C-${cls.id}-S-${slot.id}`);
            fillerIndex++;
          }
        }
      }
    }

    // ─── 7. Save to Database (Transactional) ──────────────────────
    await prisma.$transaction(async (tx) => {
      // 1. Clear old data
      await tx.timetable.deleteMany();
      
      // 2. Save new data
      if (timetableEntries.length > 0) {
        await tx.timetable.createMany({ data: timetableEntries });
      }
    });

    res.json({ message: 'Timetable generated successfully with advanced constraints', count: timetableEntries.length });
  } catch (error) {
    console.error('Timetable Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate timetable. Your existing schedule has been preserved.' });
  } finally {
    isGenerating = false;
  }
};

export const getTimetableByClass = async (req, res) => {
  const { classId } = req.params;
  try {
    const timetable = await prisma.timetable.findMany({
      where: { class_id: parseInt(classId) },
      include: {
        subject: true,
        teacher: true,
        room: true,
        timeslot: true,
      },
    });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTimetableByTeacher = async (req, res) => {
  const { teacherId } = req.params;
  try {
    const timetable = await prisma.timetable.findMany({
      where: { teacher_id: parseInt(teacherId) },
      include: {
        subject: true,
        class: true,
        room: true,
        timeslot: true,
      },
    });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTimetableByRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const timetable = await prisma.timetable.findMany({
      where: { room_id: parseInt(roomId) },
      include: {
        subject: true,
        class: true,
        teacher: true,
        timeslot: true,
      },
    });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
