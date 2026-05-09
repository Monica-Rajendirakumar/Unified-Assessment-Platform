/**
 * Seed Script — run once to populate sample assessments in MongoDB
 * Usage: node backend/seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assessment = require('./models/Assessment');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uap');
  console.log('Connected to MongoDB');

  // Find the first Instructor in the DB (or use first user as fallback)
  let instructor = await User.findOne({ role: 'Instructor' });
  if (!instructor) instructor = await User.findOne();

  if (!instructor) {
    console.log('❌ No users found. Please register a user first, then run this seed.');
    process.exit(1);
  }

  console.log(`Using instructor: ${instructor.name} (${instructor.email})`);

  // Clear existing assessments
  await Assessment.deleteMany({});
  console.log('Cleared existing assessments');

  const assessments = [
    {
      title: 'Introduction to React Fundamentals',
      description: 'Test your knowledge of React basics including components, props, and state handling.',
      subject: 'Web Development',
      type: 'MCQ',
      duration: 60,
      instructor: instructor._id,
      questions: [
        {
          questionText: 'What is the primary purpose of React hooks?',
          type: 'MCQ',
          options: [
            'To replace class components',
            'To manage state and side effects in functional components',
            'To improve performance',
            'To handle routing'
          ],
          marks: 5,
        },
        {
          questionText: 'Which hook is used to perform side effects in React?',
          type: 'MCQ',
          options: ['useState', 'useEffect', 'useContext', 'useReducer'],
          marks: 5,
        },
        {
          questionText: 'What does JSX stand for?',
          type: 'MCQ',
          options: [
            'JavaScript XML',
            'JavaScript Extension',
            'Java Syntax Extension',
            'JSON XML'
          ],
          marks: 5,
        },
      ],
    },
    {
      title: 'Advanced JavaScript ES6+',
      description: 'Comprehensive assessment on modern JavaScript features including closures, scopes, and array methods.',
      subject: 'Programming',
      type: 'MCQ',
      duration: 90,
      instructor: instructor._id,
      questions: [
        {
          questionText: 'What is a closure in JavaScript?',
          type: 'MCQ',
          options: [
            'A function that has access to its outer function scope even after the outer function has returned',
            'A way to close browser windows',
            'An error handling mechanism',
            'A type of loop'
          ],
          marks: 10,
        },
        {
          questionText: 'What does the spread operator (...) do?',
          type: 'MCQ',
          options: [
            'Creates a deep copy of objects',
            'Expands an iterable into individual elements',
            'Merges two functions',
            'Declares a rest parameter'
          ],
          marks: 10,
        },
      ],
    },
    {
      title: 'Database Management Systems',
      description: 'Covering SQL, normalization, and database design principles.',
      subject: 'Database',
      type: 'Mixed',
      duration: 120,
      instructor: instructor._id,
      questions: [
        {
          questionText: 'What does ACID stand for in database transactions?',
          type: 'MCQ',
          options: [
            'Atomicity, Consistency, Isolation, Durability',
            'Accuracy, Consistency, Integrity, Durability',
            'Atomicity, Concurrency, Isolation, Data',
            'Access, Control, Integrity, Durability'
          ],
          marks: 10,
        },
        {
          questionText: 'Explain the difference between a primary key and a foreign key.',
          type: 'Written',
          options: [],
          marks: 20,
        },
      ],
    },
  ];

  await Assessment.insertMany(assessments);
  console.log(`✅ Seeded ${assessments.length} assessments successfully!`);
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
