import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { Class } from '../models/Class';
import { Enrollment } from '../models/Enrollment';
import { Session } from '../models/Session';
import { AttendanceRecord } from '../models/AttendanceRecord';
import { AuditLog } from '../models/AuditLog';
import { logger } from '../utils/logger';

async function seed() {
  try {
    logger.info('Starting AttendAI database seeding...');
    await connectDatabase();

    // 1. Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      Class.deleteMany({}),
      Enrollment.deleteMany({}),
      Session.deleteMany({}),
      AttendanceRecord.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);
    logger.info('Cleared existing collections.');

    // 2. Create Users
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const teacher = await User.create({
      name: 'Dr. Sarah Mitchell',
      email: 'teacher@attendai.edu',
      passwordHash,
      role: 'teacher',
      isActive: true,
    });

    const studentUser = await User.create({
      name: 'Alex Johnson',
      email: 'student@attendai.edu',
      passwordHash,
      role: 'student',
      isActive: true,
    });
    logger.info('Created users: Dr. Sarah Mitchell (Teacher), Alex Johnson (Student)');

    // 3. Create Classes
    const classAI = await Class.create({
      name: 'CS401: Artificial Intelligence & Machine Learning',
      code: 'CS401',
      description: 'Foundations of intelligent agents, computer vision, and deep learning architectures.',
      teacher: teacher._id,
      academicYear: '2026-2027',
      semester: 'Fall',
      archived: false,
    });

    const classData = await Class.create({
      name: 'CS201: Data Structures & Algorithms',
      code: 'CS201',
      description: 'Advanced algorithms, graph theory, trees, and complexity analysis.',
      teacher: teacher._id,
      academicYear: '2026-2027',
      semester: 'Fall',
      archived: false,
    });
    logger.info('Created classes: CS401 and CS201');

    // 4. Create Students
    const mockStudentsData = [
      { name: 'Alex Johnson', studentId: 'STU001', email: 'alex.j@attendai.edu', department: 'Computer Science', year: 3 },
      { name: 'Priya Sharma', studentId: 'STU002', email: 'priya.s@attendai.edu', department: 'Computer Science', year: 3 },
      { name: 'Marcus Vance', studentId: 'STU003', email: 'marcus.v@attendai.edu', department: 'Electrical Engineering', year: 3 },
      { name: 'Elena Rostova', studentId: 'STU004', email: 'elena.r@attendai.edu', department: 'Data Science', year: 2 },
      { name: 'David Kim', studentId: 'STU005', email: 'david.k@attendai.edu', department: 'Computer Science', year: 4 },
      { name: 'Fatima Zahra', studentId: 'STU006', email: 'fatima.z@attendai.edu', department: 'Robotics', year: 3 },
      { name: 'Chen Wei', studentId: 'STU007', email: 'chen.w@attendai.edu', department: 'Data Science', year: 2 },
      { name: 'Chloe Bennett', studentId: 'STU008', email: 'chloe.b@attendai.edu', department: 'Computer Science', year: 3 },
    ];

    const studentProfiles = [];
    for (const stu of mockStudentsData) {
      const profile = await StudentProfile.create({
        ...stu,
        enrolledBy: teacher._id,
        isActive: true,
      });
      studentProfiles.push(profile);
    }
    logger.info(`Created ${studentProfiles.length} student profiles.`);

    // 5. Enroll students into classes
    for (const profile of studentProfiles) {
      await Enrollment.create({
        class: classAI._id,
        student: profile._id,
        status: 'active',
      });
      // Enroll first 5 in second class too
      if (profile.studentId <= 'STU005') {
        await Enrollment.create({
          class: classData._id,
          student: profile._id,
          status: 'active',
        });
      }
    }
    logger.info('Enrolled students into classes.');

    // 6. Create Sessions
    const session1 = await Session.create({
      class: classAI._id,
      teacher: teacher._id,
      title: 'Session 01: Computer Vision & Edge Detection',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      durationMinutes: 60,
      mode: 'automated',
      status: 'completed',
    });

    const session2 = await Session.create({
      class: classAI._id,
      teacher: teacher._id,
      title: 'Session 02: Convolutional Neural Networks',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      durationMinutes: 75,
      mode: 'automated',
      status: 'completed',
    });

    const sessionToday = await Session.create({
      class: classAI._id,
      teacher: teacher._id,
      title: 'Session 03: Real-Time Face Detection & Tracking',
      date: new Date(),
      durationMinutes: 60,
      mode: 'automated',
      status: 'active',
    });
    logger.info('Created sessions: 2 completed, 1 active.');

    // 7. Create Attendance Records for Session 1 & 2
    const statuses = ['present', 'present', 'present', 'present', 'present', 'late', 'absent', 'present'] as const;
    for (let i = 0; i < studentProfiles.length; i++) {
      await AttendanceRecord.create({
        session: session1._id,
        class: classAI._id,
        student: studentProfiles[i]._id,
        status: statuses[i],
        aiConfidence: 0.94,
        confirmedBy: teacher._id,
        source: 'ai_detected',
      });

      await AttendanceRecord.create({
        session: session2._id,
        class: classAI._id,
        student: studentProfiles[i]._id,
        status: i === 6 ? 'absent' : 'present',
        aiConfidence: 0.96,
        confirmedBy: teacher._id,
        source: 'ai_detected',
      });
    }
    logger.info('Created attendance records for sessions.');

    // 8. Audit Log
    await AuditLog.create({
      user: teacher._id,
      action: 'SYSTEM_SEED',
      resourceType: 'System',
      changes: { note: 'Initial synthetic dataset seeded' },
      success: true,
    });

    logger.info('Seeding completed successfully!');
    logger.info('----------------------------------------------');
    logger.info('Teacher login: teacher@attendai.edu / Password123!');
    logger.info('Student login: student@attendai.edu / Password123!');
    logger.info('----------------------------------------------');
  } catch (error) {
    logger.error('Error during database seed:', error);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
}

seed();
