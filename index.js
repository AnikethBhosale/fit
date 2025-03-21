require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fitness-quest', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    achievements: [String],
    exerciseHistory: [{
        exercise: String,
        reps: Number,
        xp: Number,
        date: { type: Date, default: Date.now }
    }]
});

const User = mongoose.model('User', userSchema);

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Please login first' });
    }
    next();
};

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.json({ message: 'Registration successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        req.session.userId = user._id;
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

app.post('/api/exercise', requireAuth, async (req, res) => {
    try {
        const { exercise, reps } = req.body;
        const xp = calculateXP(exercise, reps);
        const user = await User.findById(req.session.userId);
        
        user.exerciseHistory.push({ exercise, reps, xp });
        user.xp += xp;
        
        // Level up logic
        const newLevel = Math.floor(user.xp / 1000) + 1;
        if (newLevel > user.level) {
            user.level = newLevel;
        }
        
        await user.save();
        res.json({ message: 'Exercise recorded', xp, level: user.level });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.find()
            .select('username level xp')
            .sort({ xp: -1 })
            .limit(10);
        res.json(topUsers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

function calculateXP(exercise, reps) {
    const xpRates = {
        pushup: 5,
        squat: 5,
        plank: 10,
        jumpingjack: 3,
        armraises: 2
    };
    return (xpRates[exercise] || 1) * reps;
}

app.listen(port, '0.0.0.0', () => {
    console.log(`Fitness Quest server running on port ${port}`);
});
