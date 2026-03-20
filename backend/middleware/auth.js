import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;
    req.userId = decodedData?.id;
    req.userRole = decodedData?.role;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }
  next();
};

export const isTeacherOwner = async (req, res, next) => {
  const { teacherId } = req.params;
  const { email, role } = req.user;

  if (role === 'ADMIN') return next();
  
  try {
    const teacher = await prisma.teacher.findUnique({ where: { id: parseInt(teacherId) } });
    if (!teacher || teacher.email !== email) {
      return res.status(403).json({ message: 'Access denied: You can only view your own schedule' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error verifying ownership' });
  }
};

export const isStudentOfClass = (req, res, next) => {
  const { classId } = req.params;
  const { role, class_id } = req.user;

  if (role === 'ADMIN' || role === 'TEACHER') return next();
  
  if (parseInt(classId) !== class_id) {
    return res.status(403).json({ message: 'Access denied: You can only view your assigned class schedule' });
  }
  next();
};
