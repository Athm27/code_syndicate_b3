const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateToken, authenticateToken, authorizeRole } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory data store (replace with database in production)
const db = {
    users: [
        {
            id: 1,
            username: 'patient1',
            password: 'password123',
            role: 'patient'
        },
        {
            id: 2,
            username: 'doctor1',
            password: 'password123',
            role: 'doctor'
        }
    ],
    medicines: [],
    reminders: [],
    bloodBank: {
        'A+': 5, 'A-': 3, 'B+': 4, 'B-': 2,
        'AB+': 2, 'AB-': 1, 'O+': 6, 'O-': 3
    },
    bloodRequests: []
};

// Authentication Routes
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = generateToken(user);
        res.json({ 
            success: true, 
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            },
            token 
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { username, password, role } = req.body;
    
    if (db.users.some(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const newUser = {
        id: db.users.length + 1,
        username,
        password,
        role
    };

    db.users.push(newUser);
    const token = generateToken(newUser);
    
    res.status(201).json({ 
        success: true, 
        user: {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role
        },
        token 
    });
});

// Protected Routes
// User Routes
app.get('/api/users', authenticateToken, authorizeRole(['doctor', 'admin']), (req, res) => {
    const users = db.users.map(u => ({
        id: u.id,
        username: u.username,
        role: u.role
    }));
    res.json(users);
});

// Medicine Routes
app.get('/api/medicines', authenticateToken, (req, res) => {
    const { patientId } = req.query;
    
    // Only allow access to own medicines or if doctor/admin
    if (req.user.role === 'patient' && req.user.id !== parseInt(patientId)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    const medicines = db.medicines.filter(m => m.patientId === parseInt(patientId));
    res.json(medicines);
});

app.post('/api/medicines', authenticateToken, (req, res) => {
    const medicine = {
        id: db.medicines.length + 1,
        ...req.body,
        createdBy: req.user.id
    };
    db.medicines.push(medicine);
    res.status(201).json(medicine);
});

// Reminder Routes
app.get('/api/reminders', authenticateToken, (req, res) => {
    const { patientId } = req.query;
    
    // Only allow access to own reminders or if doctor/caretaker
    if (req.user.role === 'patient' && req.user.id !== parseInt(patientId)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    const reminders = db.reminders.filter(r => r.patientId === parseInt(patientId));
    res.json(reminders);
});

app.post('/api/reminders', authenticateToken, (req, res) => {
    const reminder = {
        id: db.reminders.length + 1,
        ...req.body,
        createdBy: req.user.id
    };
    db.reminders.push(reminder);
    res.status(201).json(reminder);
});

// Blood Bank Routes
app.get('/api/blood-bank/status', authenticateToken, (req, res) => {
    res.json(db.bloodBank);
});

app.post('/api/blood-bank/request', authenticateToken, (req, res) => {
    const request = {
        id: db.bloodRequests.length + 1,
        status: 'pending',
        createdAt: new Date().toISOString(),
        requestedBy: req.user.id,
        ...req.body
    };
    db.bloodRequests.push(request);
    res.status(201).json(request);
});

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
