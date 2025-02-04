const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ragavan24",
    database: "alzcare"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

/* ================= User Authentication ================= */

// User Signup
app.post("/signup", (req, res) => {
    const { username, email, password, caregiver_phone } = req.body;
    const sql = "INSERT INTO users (username, email, password, caregiver_phone) VALUES (?, ?, ?, ?)";
    db.query(sql, [username, email, password, caregiver_phone], (err, result) => {
        if (err) return res.json({ success: false, error: err.sqlMessage });
        res.json({ success: true, userId: result.insertId });
    });
});

// User Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT id, username, email, caregiver_phone FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.json({ success: false, error: err.sqlMessage });
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    });
});

/* ================= Profile & Emergency Contact ================= */

// Get User Profile by ID (Dynamic)
app.get("/profile/:userId", (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT username, email, caregiver_phone FROM users WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) return res.json({ success: false, error: err });
        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.json({ success: false, message: "User not found" });
        }
    });
});

/* ================= Daily Routine API ================= */

// Fetch all routine tasks for a user
app.get("/routine/:userId", (req, res) => {
    const userId = req.params.userId;
    db.query("SELECT * FROM daily_routine WHERE user_id = ?", [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Add a new task
app.post("/routine", (req, res) => {
    const { userId, task, time } = req.body;
    const sql = "INSERT INTO daily_routine (user_id, task, time) VALUES (?, ?, ?)";
    db.query(sql, [userId, task, time], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, id: result.insertId });
    });
});

// Update a task
app.put("/routine/:id", (req, res) => {
    const { id } = req.params;
    const { task, time } = req.body;
    const sql = "UPDATE daily_routine SET task = ?, time = ? WHERE id = ?";
    db.query(sql, [task, time, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// Delete a task
app.delete("/routine/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM daily_routine WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

/* ================= Appointments API ================= */

// Fetch all appointments for a user
app.get("/appointments/:userId", (req, res) => {
    const userId = req.params.userId;
    db.query("SELECT * FROM appointments WHERE user_id = ?", [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Add a new appointment
app.post("/appointments", (req, res) => {
    const { userId, doctor, time } = req.body;
    const sql = "INSERT INTO appointments (user_id, doctor, time) VALUES (?, ?, ?)";
    db.query(sql, [userId, doctor, time], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, id: result.insertId });
    });
});

// Update an appointment
app.put("/appointments/:id", (req, res) => {
    const { id } = req.params;
    const { doctor, time } = req.body;
    const sql = "UPDATE appointments SET doctor = ?, time = ? WHERE id = ?";
    db.query(sql, [doctor, time, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// Delete an appointment
app.delete("/appointments/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM appointments WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

/* ================= Location Updates API ================= */

// Update user's location dynamically
app.post("/update-location", (req, res) => {
    const { userId, latitude, longitude } = req.body;
    const sql = "UPDATE users SET latitude = ?, longitude = ? WHERE id = ?";
    db.query(sql, [latitude, longitude, userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// Get user’s last known location
app.get("/location/:userId", (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT latitude, longitude FROM users WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            res.json({ success: true, location: result[0] });
        } else {
            res.json({ success: false, message: "Location not found" });
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
