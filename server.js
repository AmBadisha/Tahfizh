require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// CONFIGURATION
// ============================================================================

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@alnoor.edu.ng';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// ============================================================================
// 🗄️  DATABASE SETUP (MongoDB with Mongoose)
// ============================================================================
//
// STEP 1: Install mongoose:
//    npm install mongoose
//
// STEP 2: Get your free MongoDB Atlas cluster:
//    1. Go to https://www.mongodb.com/atlas
//    2. Sign up and create a free cluster
//    3. Click "Connect" → "Drivers" → "Node.js"
//    4. Copy the connection string
//    5. Paste it in your .env file as MONGODB_URI
//
// STEP 3: Uncomment the mongoose code below
//
// ============================================================================

/*
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  matric: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: String,
  gender: String,
  address: String,
  class: String,
  father: String,
  fatherPhone: String,
  mother: String,
  motherPhone: String,
  email: String,
  photo: String,
  type: { type: String, enum: ['new', 'returning'] },
  registeredAt: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
});

const paymentSchema = new mongoose.Schema({
  matric: String,
  studentName: String,
  amount: Number,
  method: String,
  type: String,
  ref: String,
  rrr: String,
  status: String,
  date: { type: Date, default: Date.now }
});

const announcementSchema = new mongoose.Schema({
  title: String,
  body: String,
  date: String
});

const Student = mongoose.model('Student', studentSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
*/

// ============================================================================
// IN-MEMORY DATA STORE (Fallback until MongoDB is connected)
// ============================================================================

let students = [
  {
    matric: 'ANIS2026001',
    name: 'Ahmad Ibrahim',
    dob: '2012-03-15',
    gender: 'Male',
    address: '12 Zaria Road, Kano',
    class: 'JSS 2',
    father: 'Ibrahim Musa',
    fatherPhone: '08012345678',
    mother: 'Amina Ibrahim',
    motherPhone: '08087654321',
    email: 'parent1@email.com',
    photo: null,
    type: 'new',
    registeredAt: '2026-07-20T10:00:00Z',
    paymentStatus: 'paid'
  },
  {
    matric: 'ANIS2026002',
    name: 'Fatima Yusuf',
    dob: '2014-07-22',
    gender: 'Female',
    address: '45 Sokoto Street, Kano',
    class: 'Primary 5',
    father: 'Yusuf Abdullahi',
    fatherPhone: '08023456789',
    mother: 'Halima Yusuf',
    motherPhone: '08098765432',
    email: 'parent2@email.com',
    photo: null,
    type: 'returning',
    registeredAt: '2026-07-18T14:30:00Z',
    paymentStatus: 'paid'
  },
  {
    matric: 'ANIS2026003',
    name: 'Abubakar Suleiman',
    dob: '2010-11-05',
    gender: 'Male',
    address: '78 Katsina Road, Kano',
    class: 'SSS 1',
    father: 'Suleiman Danladi',
    fatherPhone: '08034567890',
    mother: 'Zainab Suleiman',
    motherPhone: '08009876543',
    email: 'parent3@email.com',
    photo: null,
    type: 'returning',
    registeredAt: '2026-07-15T09:15:00Z',
    paymentStatus: 'paid'
  }
];

let payments = [];

let announcements = [
  {
    id: uuidv4(),
    title: 'Resumption Date',
    body: 'New academic session begins on September 12, 2026. All students are expected to resume.',
    date: 'July 20, 2026'
  },
  {
    id: uuidv4(),
    title: 'Registration Fee Update',
    body: 'New students: ₦5,000 | Returning students: ₦1,500',
    date: 'July 15, 2026'
  }
];

// ============================================================================
// HELPERS
// ============================================================================

function generateMatric() {
  const num = String(Math.floor(100 + Math.random() * 900)).padStart(3, '0');
  return 'ANIS2026' + num;
}

function formatMoney(n) {
  return '₦' + n.toLocaleString('en-NG') + '.00';
}

// ============================================================================
// 🔌 PAYMENT GATEWAY PLACEHOLDER
// ============================================================================

async function processRealPayment({ matric, amount, method, type, studentName }) {
  // ═══════════════════════════════════════════════════════════════════════
  // 👇 YOUR REAL PAYMENT INTEGRATION GOES HERE
  // ═══════════════════════════════════════════════════════════════════════
  //
  // Example: Remita
  // ---------------------------
  // const Remita = require('@remita/nodejs-sdk');
  // const remita = new Remita({
  //   merchantId: process.env.REMITA_MERCHANT_ID,
  //   apiKey: process.env.REMITA_API_KEY,
  //   serviceTypeId: process.env.REMITA_SERVICE_TYPE_ID
  // });
  // try {
  //   const response = await remita.generateRRR({
  //     serviceTypeId: process.env.REMITA_SERVICE_TYPE_ID,
  //     amount: amount,
  //     orderId: matric + '-' + Date.now(),
  //     payerName: studentName,
  //     payerEmail: 'student@school.edu.ng',
  //     payerPhone: '08000000000',
  //     description: type === 'registration' ? 'Registration Fee' : 'School Fees'
  //   });
  //   return { success: true, ref: response.orderId, rrr: response.RRR, message: 'Payment initiated' };
  // } catch (error) {
  //   return { success: false, message: error.message };
  // }
  //
  // Example: Paystack
  // ------------------------------
  // const Paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY);
  // try {
  //   const response = await Paystack.transaction.initialize({
  //     email: 'student@school.edu.ng',
  //     amount: amount * 100,
  //     reference: 'ANIS-' + Date.now(),
  //     metadata: { matric, type, studentName }
  //   });
  //   return {
  //     success: true,
  //     ref: response.data.reference,
  //     rrr: response.data.access_code,
  //     message: 'Payment initialized',
  //     authorization_url: response.data.authorization_url
  //   };
  // } catch (error) {
  //   return { success: false, message: error.message };
  // }
  //
  // Example: Flutterwave
  // ---------------------------------
  // const Flutterwave = require('flutterwave-node-v3');
  // const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
  // try {
  //   const response = await flw.Payment.initiate({
  //     tx_ref: 'ANIS-' + Date.now(),
  //     amount: amount,
  //     currency: 'NGN',
  //     redirect_url: 'https://yourdomain.com/payment/callback',
  //     customer: { email: 'student@school.edu.ng', phonenumber: '08000000000', name: studentName }
  //   });
  //   return { success: true, ref: response.data.tx_ref, rrr: response.data.flw_ref, message: 'Payment link generated' };
  // } catch (error) {
  //   return { success: false, message: error.message };
  // }
  //
  // ═══════════════════════════════════════════════════════════════════════

  // MOCK IMPLEMENTATION (remove when integrating real gateway)
  console.log(`[MOCK PAYMENT] Matric: ${matric}, Amount: ${amount}, Method: ${method}, Type: ${type}`);
  return {
    success: true,
    ref: 'TXN-' + Date.now(),
    rrr: 'RRR-' + Math.floor(100000000000 + Math.random() * 900000000000),
    message: 'Mock payment successful'
  };
}

// ============================================================================
// API ROUTES
// ============================================================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/students/register', (req, res) => {
  const {
    name, dob, gender, address, class: studentClass,
    father, fatherPhone, mother, motherPhone, email, photo
  } = req.body;

  if (!name || !dob || !gender || !address || !studentClass || !father || !fatherPhone || !mother || !motherPhone) {
    return res.status(400).json({ success: false, message: 'All required fields must be filled' });
  }

  const matric = generateMatric();
  const student = {
    matric, name, dob, gender, address,
    class: studentClass,
    father, fatherPhone, mother, motherPhone,
    email: email || '',
    photo: photo || null,
    type: 'new',
    registeredAt: new Date().toISOString(),
    paymentStatus: 'pending'
  };

  students.push(student);
  res.json({ success: true, student });
});

app.get('/api/students/:matric', (req, res) => {
  const student = students.find(s => s.matric === req.params.matric.toUpperCase());
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.json({ success: true, student });
});

app.post('/api/payments', async (req, res) => {
  const { matric, amount, method, type } = req.body;
  const student = students.find(s => s.matric === matric);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  const paymentResult = await processRealPayment({
    matric, amount,
    method: method || 'remita',
    type: type || 'registration',
    studentName: student.name
  });

  if (!paymentResult.success) {
    return res.status(400).json({ success: false, message: paymentResult.message });
  }

  const payment = {
    id: uuidv4(),
    matric,
    studentName: student.name,
    amount,
    method: method || 'remita',
    type: type || 'registration',
    ref: paymentResult.ref,
    rrr: paymentResult.rrr,
    status: 'successful',
    date: new Date().toISOString()
  };

  payments.push(payment);
  student.paymentStatus = 'paid';

  res.json({ success: true, payment });
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'demo-token-' + Date.now(), message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

app.get('/api/admin/students', (req, res) => {
  res.json({ success: true, students });
});

app.get('/api/admin/stats', (req, res) => {
  const totalStudents = students.length;
  const newRegistrations = students.filter(s => s.type === 'new').length;
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const thisMonthRevenue = payments
    .filter(p => new Date(p.date).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0);

  const monthlyRevenue = [320000, 280000, 450000, 390000, 520000, 480000, 430000];
  const classDistribution = {
    Nursery: students.filter(s => s.class && s.class.toLowerCase().includes('nursery')).length || 180,
    Primary: students.filter(s => s.class && s.class.toLowerCase().includes('primary')).length || 420,
    JSS: students.filter(s => s.class && s.class.toLowerCase().includes('jss')).length || 350,
    SSS: students.filter(s => s.class && s.class.toLowerCase().includes('sss')).length || 297
  };

  res.json({
    success: true,
    stats: { totalStudents, newRegistrations, totalRevenue, thisMonthRevenue, monthlyRevenue, classDistribution }
  });
});

app.get('/api/announcements', (req, res) => {
  res.json({ success: true, announcements });
});

app.post('/api/announcements', (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ success: false, message: 'Title and body are required' });
  }
  const announcement = {
    id: uuidv4(),
    title, body,
    date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
  };
  announcements.unshift(announcement);
  res.json({ success: true, announcement });
});

app.delete('/api/announcements/:id', (req, res) => {
  const index = announcements.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }
  announcements.splice(index, 1);
  res.json({ success: true, message: 'Announcement deleted' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('========================================');
  console.log('  Al-Noor Islamiyya School Portal');
  console.log('========================================');
  console.log(`  Server running at: http://localhost:${PORT}`);
  console.log(`  Admin Email: ${ADMIN_EMAIL}`);
  console.log(`  Admin Password: ${ADMIN_PASSWORD.replace(/./g, '*')}`);
  console.log('');
  console.log('  ⚠️  NOTE: Using in-memory storage.');
  console.log('     Uncomment MongoDB code in server.js');
  console.log('     and set MONGODB_URI in .env for production.');
  console.log('========================================');
});
