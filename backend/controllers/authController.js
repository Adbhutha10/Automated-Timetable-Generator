import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const signup = async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Role Resolution Logic
    let finalRole = 'STUDENT';
    const isTeacher = await prisma.teacher.findUnique({ where: { email } });
    
    if (isTeacher) {
      finalRole = 'TEACHER';
    } else if (role === 'ADMIN') {
      const allowedAdmins = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
      if (allowedAdmins.includes(email)) {
        finalRole = 'ADMIN';
      } else {
        return res.status(403).json({ message: 'Unauthorized: This email is not on the Admin whitelist.' });
      }
    } else {
      finalRole = role === 'ADMIN' ? 'STUDENT' : (role || 'STUDENT');
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: finalRole
      }
    });

    const token = jwt.sign(
      { email: user.email, id: user.id, role: user.role, class_id: user.class_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ result: user, token });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return res.status(404).json({ message: 'User doesn\'t exist' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser.id, role: existingUser.role, class_id: existingUser.class_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
