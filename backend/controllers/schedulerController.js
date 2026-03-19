import { prisma } from '../index.js';

export const generateTimetable = async (req, res) => {
  try {
    // 1. Fetch all data
    const teachers = await prisma.teacher.findMany({ include: { subjects: true } });
    const subjects = await prisma.subject.findMany({ include: { teachers: true, classes: true } });
    const classes = await prisma.class.findMany({ include: { subjects: true } });
    const rooms = await prisma.room.findMany();
    const timeslots = await prisma.timeslot.findMany();

    // 2. Clear existing entries (optional, or just for this run)
    await prisma.timetable.deleteMany();

    const timetableEntries = [];
    const usedSlots = new Set(); // To track teacher-slot, room-slot, class-slot conflicts

    // Helper to check feasibility
    const isFeasible = (teacherId, roomId, classId, slotId) => {
      const teacherSlot = `T-${teacherId}-S-${slotId}`;
      const roomSlot = `R-${roomId}-S-${slotId}`;
      const classSlot = `C-${classId}-S-${slotId}`;
      return !usedSlots.has(teacherSlot) && !usedSlots.has(roomSlot) && !usedSlots.has(classSlot);
    };

    // 3. Algorithm (Greedy)
    for (const cls of classes) {
      for (const clsSub of cls.subjects) {
        const subject = subjects.find((s) => s.id === clsSub.subject_id);
        if (!subject) continue;

        let hoursAssigned = 0;
        const totalHoursNeeded = subject.hours_per_week;

        // Find available teacher for this subject
        const teacherIds = subject.teachers.map((t) => t.teacher_id);
        
        // Try to assign slots until hours are met
        for (const slot of timeslots) {
          if (hoursAssigned >= totalHoursNeeded) break;

          for (const teacherId of teacherIds) {
            if (hoursAssigned >= totalHoursNeeded) break;

            for (const room of rooms) {
              if (hoursAssigned >= totalHoursNeeded) break;

              if (isFeasible(teacherId, room.id, cls.id, slot.id)) {
                timetableEntries.push({
                  class_id: cls.id,
                  subject_id: subject.id,
                  teacher_id: teacherId,
                  room_id: room.id,
                  timeslot_id: slot.id,
                });

                usedSlots.add(`T-${teacherId}-S-${slot.id}`);
                usedSlots.add(`R-${room.id}-S-${slot.id}`);
                usedSlots.add(`C-${cls.id}-S-${slot.id}`);
                hoursAssigned++;
              }
            }
          }
        }
      }
    }

    // 4. Save to Database
    if (timetableEntries.length > 0) {
      await prisma.timetable.createMany({ data: timetableEntries });
    }

    res.json({ message: 'Timetable generated successfully', count: timetableEntries.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate timetable' });
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
