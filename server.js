const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'alzcare'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Route to add a reminder
app.post('/addReminder', (req, res) => {
    const { title, description, date, time } = req.body;
    const sql = 'INSERT INTO reminders (title, description, date, time) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, description, date, time], (err, result) => {
        if (err) throw err;
        res.send({ status: 'Reminder added', id: result.insertId });
    });
});

// Route to get all reminders
app.get('/getReminders', (req, res) => {
    const sql = 'SELECT * FROM reminders';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Route to add an appointment
app.post('/addAppointment', (req, res) => {
    const { doctorName, date, time, location } = req.body;
    const sql = 'INSERT INTO appointments (doctorName, date, time, location) VALUES (?, ?, ?, ?)';
    db.query(sql, [doctorName, date, time, location], (err, result) => {
        if (err) throw err;
        res.send({ status: 'Appointment added', id: result.insertId });
    });
});

// Route to get all appointments
app.get('/getAppointments', (req, res) => {
    const sql = 'SELECT * FROM appointments';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Route to save a location
app.post('/saveLocation', (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    const sql = 'INSERT INTO locations (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, address, latitude, longitude], (err, result) => {
        if (err) throw err;
        res.send({ status: 'Location saved', id: result.insertId });
    });
});

// Route to get all saved locations
app.get('/getLocations', (req, res) => {
    const sql = 'SELECT * FROM locations';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
