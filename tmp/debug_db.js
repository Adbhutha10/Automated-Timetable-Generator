import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const timeslots = await prisma.timeslot.findMany({ take: 10 });
  console.log('--- Sample Timeslots ---');
  console.table(timeslots.map(t => ({ id: t.id, day: t.day, start: t.start_time, end: t.end_time })));

  const timetable = await prisma.timetable.findMany({
    take: 5,
    include: { timeslot: true, class: true, subject: true }
  });
  console.log('--- Sample Timetable Entries ---');
  console.table(timetable.map(t => ({ 
    id: t.id, 
    class: t.class.name, 
    subject: t.subject.name, 
    day: t.timeslot.day 
  })));
  
  const days = await prisma.timeslot.findMany({
    select: { day: true },
    distinct: ['day']
  });
  console.log('--- Distinct Days in DB ---');
  console.log(days.map(d => `"${d.day}"`).join(', '));
}

main().catch(console.error).finally(() => prisma.$disconnect());
